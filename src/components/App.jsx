import '../../vendor/octicons/octicons.css';
import '../css/colors.css';
import '../css/flex.css';
import '../css/icons.css';
import '../css/layout.css';
import '../css/link.css';
import '../css/reset.css';
import '../css/text.css';

import './common/Card.css';
import './common/List.css';
import './App.css';

import xvdom      from 'xvdom';
import Icon       from './common/Icon.jsx';
import List       from './common/List.jsx';
import Tabs       from './common/Tabs.jsx';
import DB         from '../models/DB';
import User       from '../models/User';
import AppToolbar from './AppToolbar.jsx';

import '../helpers/installServiceWorker';
import '../helpers/globalLogger';

const PAGE_SIZE           = 25;
const CATEGORIES          = [ 'Yup', 'Nope', 'Maybe' ];
const ITEM_TYPES          = [ 'bottom', 'shirt', 'sweater', 'businessAttire' ];
const EMPTY_SELECTED_ITEM_IDS = ITEM_TYPES.reduce((obj, type) => ((obj[type] = 0), obj), {});

const isEmptySelection = selectedItems =>
  ITEM_TYPES.reduce((sum, type) => sum + (selectedItems[type] && 1), 0) < 2;

const OutfitRow = ({
  props: { db, outfitId, selectedOutfitId, onSelect },
  state: { selectedItems },
  bindSend
}) => {
  const outfit     = db.outfits[outfitId];
  const isSelected = outfitId === selectedOutfitId;
  return (
    <div className={`OutfitRow ${isSelected ? 'is-selected' : ''}`}>
      <div className='OutfitRow-items layout horizontal center'>
        {ITEM_TYPES.map(type => {
          const itemId = outfit[type];
          return (
            <span
              className={`OutfitRow-item flex ${selectedItems[type] === itemId ? 'is-selected' : ''}`}
              itemId={itemId}
              itemType={type}
              onclick={bindSend('handleSelectItem')}
              style={`background-image: url(${db.items[itemId].closet_image_url})`}
            />
          );
        })}
      </div>
      <span>
        {isSelected &&
          <div>
            {!isEmptySelection(selectedItems) &&
              <a href="#" onclick={bindSend('handleRemoveCombosWithSelected')}>Remove outfits with these items</a>
            }
            {CATEGORIES.map(cat =>
              <a href="#" onclick={() => onAddToCategory(outfitId, cat)} innerText={cat}></a>
            )}
          </div>
        }
      </span>
    </div>
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

const renderOutfitListItem = (outfitId, { db, selectedOutfitId, onSelect }) => ({
  text: (
    <OutfitRow
      db={db}
      outfitId={outfitId}
      selectedOutfitId={selectedOutfitId}
      onSelect={onSelect}
    />
  )
})

const firstTen = outfits => outfits.slice(0, PAGE_SIZE);

const OutfitList = ({ props: { db, outfits }, state, bindSend }) => (
  <List
    className='Card'
    transform={firstTen}
    item={renderOutfitListItem}
    itemClass='List-item--noPadding'
    context={{ db, selectedOutfitId: state, onSelect: bindSend('handleSelectOutfit') }}
    list={outfits}
  />
);

const onInit = ({ props, state }) => state || 0;

OutfitList.state = {
  onInit,
  onProps: onInit,
  handleSelectOutfit: (_, outfitId) => outfitId
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

const TABS = {
  uncategorized:{
    title: 'Uncategorized',
    view: id => <div>Hello</div>
  },
  yup:{
    title: 'Yup',
    view: id => <div>Hello</div>
  },
  nope:{
    title: 'Nope',
    view: id => <div>Hello</div>
  },
  maybe:{
    title: 'Maybe',
    view: id => <div>Hello</div>
  }
};

const App = ({ user, db }) => (
  <body>
    <AppToolbar
      left={
        <Icon
          className='c-white l-padding-h4'
          name='three-bars'
          size='small'
        />
      }
      secondary={
        <Tabs hrefPrefix='#ok/?' selected='uncategorized' tabs={TABS} />
      }
      title='OK'
    />
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
