import './App-old.css';
import './App.css';
import '../helpers/globalLogger';
import xvdom      from 'xvdom';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import AppToolbar from './AppToolbar.jsx';
import UserView   from './UserView.jsx';
import RepoView   from './RepoView.jsx';
// import loadFonts  from '../helpers/loaders/loadFonts';
import {
  authWithOAuthPopup,
  getCurrentUser,
  getPreviousUser
} from '../helpers/getCurrentUser';

const App = (
  props,
  {currentUser, isSearchEnabled, isDrawerEnabled, view, viewId, viewUrl},
  {disableOverlay, login}
)=>
  <body className='App fit fullbleed ticker-roboto-font-loaded ticker-material-icons-loaded ticker-octicons-loaded'>
    {view}
    <div
      className={`App-backdrop fixed ${isSearchEnabled || isDrawerEnabled ? 'is-enabled' : ''}`}
      onclick={disableOverlay}
    />
    <AppSearch enabled={isSearchEnabled} />
    <AppDrawer enabled={isDrawerEnabled} onLogin={login} user={currentUser} />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange, enableSearch, enableDrawer})=> {
    AppToolbar.onDrawer = enableDrawer;
    AppToolbar.onSearch = enableSearch;
    // loadFonts();
    getCurrentUser()
      .then(onCurrentUserChange)
      .catch(()=> onCurrentUserChange(null));
    window.onhashchange = onHashChange;
    return {
      currentUser: getPreviousUser(),
      ...onHashChange()
    };
  },

  onHashChange: (props, state, {viewRepo, viewUser})=> {
    if(state) document.body.scrollTop = 0;
    const [appUrl, viewUrl] = window.location.hash.split('?');
    const [, owner, repo] = appUrl.split('/');
    return {
      ...(
        repo
          ? viewRepo(`${owner}/${repo}`, viewUrl)
          : viewUser(owner, viewUrl)
      ),
      isDrawerEnabled: false,
      isSearchEnabled: false
    }
  },

  viewUser: (props, state, actions, user, viewUrl)=> ({
    ...state,
    view: <UserView id={user} viewUrl={viewUrl} />
  }),

  viewRepo: (props, state, actions, repo, viewUrl)=> ({
    ...state,
    view: <RepoView id={repo} viewUrl={viewUrl} />
  }),

  enableSearch:   (props, state)=> ({...state, isSearchEnabled:true,  isDrawerEnabled:false}),
  enableDrawer:   (props, state)=> ({...state, isSearchEnabled:false, isDrawerEnabled:true}),
  disableOverlay: (props, state)=> ({...state, isSearchEnabled:false, isDrawerEnabled:false}),

  login: (props, state, {onCurrentUserChange})=> (
    authWithOAuthPopup().then(onCurrentUserChange),
    state
  ),

  onCurrentUserChange: (props, state, actions, currentUser)=> ({
    ...state,
    currentUser
  })

};

document.body = xvdom.render(<App />);
