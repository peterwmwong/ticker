import './App.css';
import AppDrawer         from './AppDrawer.jsx';
import EventsView        from './EventsView.jsx';
import loadFonts         from '../helpers/loaders/loadFonts';
import {
  authWithOAuthPopup,
  getCurrentUser
} from '../helpers/getCurrentUser';

const App = (props, state, actions)=>
  <body className='App fit fullbleed'>
    {state.view === 'events' &&
      <EventsView
        type={state.type}
        id={state.id}
        onRequestDrawer={actions.enableDrawer}
      />
    }
    <AppDrawer
      user={state.currentUser}
      enabled={state.drawerEnabled}
      onRequestDisable={actions.disableDrawer}
      onLogin={actions.login}
    />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange})=>{
    window.onhashchange = onHashChange;
    getCurrentUser().then(onCurrentUserChange);
    loadFonts();
    return onHashChange();
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
  login: (props, state, {onCurrentUserChange})=>{
    authWithOAuthPopup().then(onCurrentUserChange);
    return state;
  }
};

export default App;
