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
  {currentUser, drawerEnabled, searchEnabled, view, type, id},
  {enableDrawer, disableDrawer, enableSearch, disableSearch, login}
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
    <AppSearch enabled={searchEnabled} onRequestDisable={disableSearch} />
    <AppDrawer
      user={currentUser}
      enabled={drawerEnabled}
      onRequestDisable={disableDrawer}
      onLogin={login}
    />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange})=>{
    loadFonts();
    getCurrentUser().then(onCurrentUserChange);
    window.onhashchange = onHashChange
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
    id: user
  }),
  viewRepo:  (props, state, actions, repo)=>({
    ...state,
    view: 'events',
    type: 'repos',
    id: repo
  }),
  onCurrentUserChange: (props, state, actions, currentUser)=>({
    ...state,
    currentUser
  }),
  enableDrawer:  (props, state, actions)=>({...state, drawerEnabled: true}),
  disableDrawer: (props, state, actions)=>({...state, drawerEnabled: false}),
  enableSearch:  (props, state, actions)=>({...state, searchEnabled: true}),
  disableSearch: (props, state, actions)=>({...state, searchEnabled: false}),
  login: (props, state, {onCurrentUserChange})=>{
    authWithOAuthPopup().then(onCurrentUserChange);
    return state;
  }
};

export default App;
