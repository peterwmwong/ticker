import '../../vendor/octicons/octicons.css';
import '../css/colors.css';
import '../css/flex.css';
import '../css/icons.css';
import '../css/layout.css';
import '../css/link.css';
import '../css/reset.css';
import '../css/text.css';
import './App.css';

import '../helpers/installServiceWorker';
import '../helpers/globalLogger';

import xvdom from 'xvdom';
import DataComponent  from '../helpers/DataComponent';
import DB from '../models/DB';
import User from '../models/User';

const PAGE_SIZE = 10;
const SELECTED_ROW_STYLE  = `background: #DDD;`;
const SELECTED_CELL_STYLE = `border: 4px solid black;`;
const CATEGORIES = [ 'Yup', 'Nope', 'Maybe' ];
const ITEM_TYPES = [ 'bottom', 'shirt', 'sweater', 'businessAttire' ];
const EMPTY_SELECTED_ITEM_IDS = ITEM_TYPES.reduce((obj, type) => ((obj[type] = 0), obj), {});

const isEmptySelection = selectedItems =>
  ITEM_TYPES.reduce((sum, type) => sum + (selectedItems[type] && 1), 0) < 2;

const OutfitRow = ({
  props: { db, outfitId, outfit, selectedOutfitId, onSelect, onAddExclusion },
  state: { selectedItems },
  bindSend
}) => {
  const isSelected = outfitId === selectedOutfitId;
  return (
    <tr style={isSelected ? SELECTED_ROW_STYLE : ''}>
      {ITEM_TYPES.map(type => {
        const itemId = outfit[type];
        return (
          <td
            itemId={itemId}
            itemType={type}
            onclick={bindSend('handleSelectItem')}
            style={selectedItems[type] === itemId ? SELECTED_CELL_STYLE : ''}
          >
            <img style='height: 150' src={db.items[itemId].closet_image_url} />
          </td>
        );
      })}
      <td>
        {isSelected &&
          <div>
            {!isEmptySelection(selectedItems) &&
              <a href="#" onclick={bindSend('handleRemoveCombosWithSelected')}>Remove outfits with these items</a>
            }
            {CATEGORIES.map(cat =>
              <a href="#" onclick={() => onAddToCategory(outfitId, cat)}>{cat}</a>
            )}
          </div>
        }
      </td>
    </tr>
  );
};

OutfitRow.state = {
  onInit: ({ props }) => ({
    selectedItems: EMPTY_SELECTED_ITEM_IDS
  }),
  onProps: ({ props: { selectedOutfitId, outfit, outfitId }, state }) => ({
    selectedItems: selectedOutfitId === outfitId ? state.selectedItems : EMPTY_SELECTED_ITEM_IDS
  }),
  handleSelectItem: ({ props, state: { selectedItems } }, { currentTarget }) => {
    const { itemId, itemType } = currentTarget;
    setTimeout(() => props.onSelect(props.outfitId));
    return {
      selectedItems: {
        ...selectedItems,
        [itemType]: selectedItems[itemType] === 0 ? +itemId : 0
      }
    };
  }
};

const OutfitList = ({
  props: { db, outfits },
  state: { page, selectedOutfitId },
  bindSend
}) => (
  <div>
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {outfits.slice(0, PAGE_SIZE).map(outfitId =>
          <OutfitRow
            db={db}
            outfitId={outfitId}
            outfit={db.outfits[outfitId]}
            selectedOutfitId={selectedOutfitId}
            onSelect={bindSend('handleSelectOutfit')}
            onAddExclusion={()=>{}}
          />
        )}
      </tbody>
    </table>
  </div>
);

const onInit = ({ props, state }) => ({
  page: 0,
  selectedOutfitId: 0
});

OutfitList.state = {
  onInit,
  onProps: onInit,

  handleSelectOutfit: ({ state }, outfitId) => ({
    ...state,
    selectedOutfitId: outfitId
  }),

  handleSelectItem: ({ state }, event) => {
    const { currentTarget } = event;
    if(!currentTarget) return;

    const selectedOutfitId = +currentTarget.parentNode.outfitId;
    const selectedItemType = currentTarget.itemType;
    const selectedItem = +currentTarget.itemId;
    let selectedItemIds;
    if(selectedOutfitId !== state.selectedOutfitId){
      selectedItemIds = {
        [selectedItemType]: selectedItem
      };
    }
    else {
      selectedItemIds = state.selectedItemIds;
      selectedItemIds[selectedItemType] = selectedItemIds[selectedItemType] ? null : selectedItem;
    }
    
    this.setState({
      ...state,
      selectedOutfitId,
      selectedItemIds
    });

    event.stopPropagation();
  }
}

function toggleSignIn() {
  if (firebase.auth().currentUser) {
    User.unsetCurrent();
    return firebase.auth().signOut();
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  firebase.auth()
    .signInWithPopup(provider)
    .catch(error => console.error(error));
}

const App = ({ user, db }) => (
  <body>
    <div>{ user && user.displayName }</div>
    {user && db && <OutfitList db={db} outfits={user.uncategorized} />}
    <button onclick={toggleSignIn}>{user ? 'Sign out' : 'Sign in'}</button>
  </body>
);

const renderApp = (user, db) => <App user={user} db={db} />;

firebase.initializeApp({
  apiKey: "AIzaSyB0wl7pEwIcb9VzHluaAQAZhOe1huyPxi8",
  authDomain: "outfit-knockout.firebaseapp.com",
  databaseURL: "https://outfit-knockout.firebaseio.com",
  storageBucket: "outfit-knockout.appspot.com",
  messagingSenderId: "60167804767"
});


DB.get().then(db => {
  document.body = xvdom.render(renderApp(User.current(), db));

  firebase.auth().onAuthStateChanged(authUser => {
    if(!authUser) return xvdom.rerender(document.body, renderApp(null, null));

    // Get or create user information
    User.get(authUser.uid)
      .catch(() =>
        User.save({
          // Couldn't find existing user w/authId, so create a new User
          id: authUser.uid,
          displayName: authUser.displayName,
          excludedCombos: {},
          uncategorized: Object.keys(db.outfits),
          yup: [],
          nope: [],
          maybe: []
        })
      )
      .then(user => {
        User.setCurrent(user.id);
        xvdom.rerender(document.body, renderApp(user, db));
      })
  });
})
