import './App-old.css';
import './App.css';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import EventsView from './EventsView.jsx';
import loadFonts  from '../helpers/loaders/loadFonts';
import {
  authWithOAuthPopup,
  getCurrentUser,
  getPreviousUser
} from '../helpers/getCurrentUser';

const App = (
  props,
  {currentUser, overlayView, view, type, id},
  {enableDrawer, enableSearch, disableOverlay, login}
)=>
  <body className='App fit fullbleed'>
    {view === 'events' &&
      <EventsView
        type={type}
        id={id}
        onRequestDrawer={enableDrawer}
        onRequestSearch={enableSearch}
      />
    }
    <div
      className={`App-backdrop fit ${overlayView ? 'is-enabled' : ''}`}
      onclick={disableOverlay}
    />
    <AppSearch enabled={overlayView === 'search'} onRequestDisable={disableOverlay} />
    <AppDrawer
      user={currentUser}
      enabled={overlayView === 'drawer'}
      onLogin={login}
    />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange})=>{
    loadFonts();
    getCurrentUser().then(onCurrentUserChange);
    window.onhashchange = onHashChange;
    return {
      ...onHashChange(),
      currentUser: getPreviousUser()
    };
  },
  onHashChange: (props, state, {viewRepo, viewUser})=>{
    const hash = window.location.hash;
    if(hash){
      const [, owner, repo] = hash.split('/');
      if(repo)       return viewRepo(`${owner}/${repo}`);
      else if(owner) return viewUser(owner);
    }
    return {...state, view: 'waiting'};
  },
  viewUser:  (props, state, actions, user)=>({
    ...state,
    view: 'events',
    type: 'users',
    id: user,
    drawerEnabled: false,
    overlayView: ''
  }),
  viewRepo:  (props, state, actions, repo)=>({
    ...state,
    view: 'events',
    type: 'repos',
    id: repo,
    overlayView: ''

  }),
  onCurrentUserChange: (props, state, actions, currentUser)=>
    (currentUser ? {...state, currentUser} : state),
  enableSearch:  (props, state, actions)=>({...state,  overlayView: 'search'}),
  enableDrawer:  (props, state, actions)=>({...state,  overlayView: 'drawer'}),
  disableOverlay: (props, state, actions)=>({...state, overlayView: ''}),
  login: (props, state, {onCurrentUserChange})=>{
    authWithOAuthPopup().then(onCurrentUserChange);
    return state;
  }
};

export default App;
