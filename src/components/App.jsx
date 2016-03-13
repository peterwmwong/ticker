import './App-old.css';
import './App.css';
import xvdom      from 'xvdom';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import AppToolbar from './AppToolbar.jsx';
import UserView   from './UserView.jsx';
import RepoView   from './RepoView.jsx';
import loadFonts  from '../helpers/loaders/loadFonts';
import {
  authWithOAuthPopup,
  getCurrentUser,
  getPreviousUser
} from '../helpers/getCurrentUser';

if(process.env.NODE_ENV === 'development'){
  window.log = (message, obj)=>(console.log(message, obj), obj)
}

const App = (
  props,
  {currentUser, isSearchEnabled, isDrawerEnabled, view, viewId, viewPath},
  {disableOverlay, login}
)=>
  <body className='App fit fullbleed'>
    {   view === 'user'   ? <UserView id={viewId} viewPath={viewPath} />
      : view === 'repo'   ? <RepoView id={viewId} viewPath={viewPath} />
      : null
    }
    <div
      className={`App-backdrop fixed ${isSearchEnabled || isDrawerEnabled ? 'is-enabled' : ''}`}
      onclick={disableOverlay}
    />
    <AppSearch enabled={isSearchEnabled} />
    <AppDrawer
      user={currentUser}
      enabled={isDrawerEnabled}
      onLogin={login}
    />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange, enableSearch, enableDrawer})=>{
    AppToolbar.onDrawer = enableDrawer;
    AppToolbar.onSearch = enableSearch;
    loadFonts();
    getCurrentUser().then(onCurrentUserChange);
    window.onhashchange = onHashChange;
    return {
      currentUser: getPreviousUser(),
      ...onHashChange()
    };
  },

  onHashChange: (props, state, {viewRepo, viewUser})=>{
    if(state) document.body.scrollTop = 0;
    const [appPath, viewPath] = window.location.hash.split('?');
    const [, owner, repo] = appPath.split('/');
    return {
      ...(
        repo
          ? viewRepo(`${owner}/${repo}`, viewPath)
          : viewUser(owner, viewPath)
      ),
      isDrawerEnabled: false,
      isSearchEnabled: false
    }
  },

  viewUser: (props, state, actions, user, viewPath)=>({
    ...state,
    view: 'user',
    viewId: user,
    viewPath
  }),

  viewRepo: (props, state, actions, repo, viewPath)=>({
    ...state,
    view: 'repo',
    viewId: repo,
    viewPath
  }),

  enableSearch:   (props, state)=>({...state, isSearchEnabled:true,  isDrawerEnabled:false}),
  enableDrawer:   (props, state)=>({...state, isSearchEnabled:false, isDrawerEnabled:true}),
  disableOverlay: (props, state)=>({...state, isSearchEnabled:false, isDrawerEnabled:false}),

  login: (props, state, {onCurrentUserChange})=>(
    authWithOAuthPopup().then(onCurrentUserChange),
    state
  ),

  onCurrentUserChange: (props, state, actions, currentUser)=>({
    ...state,
    currentUser
  })

};

document.body = xvdom.render(<App />);
