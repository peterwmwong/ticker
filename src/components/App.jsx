import './App-old.css';
import './App.css';
import xvdom      from 'xvdom';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import AppToolbar from './AppToolbar.jsx';
import UserView   from './UserView.jsx';
import CommitView from './CommitView.jsx';
import IssueView  from './IssueView.jsx';
import RepoView   from './RepoView.jsx';
import loadFonts  from '../helpers/loaders/loadFonts';
import {
  authWithOAuthPopup,
  getCurrentUser,
  getPreviousUser
} from '../helpers/getCurrentUser';

const App = (
  props,
  {currentUser, isSearchEnabled, isDrawerEnabled, view, id, resourceId},
  {disableOverlay, login}
)=>
  <body className='App fit fullbleed'>
    {   view === 'events' ? <UserView   id={id} />
      : view === 'repo'   ? <RepoView   id={id} />
      : view === 'issue'  ? <IssueView  repo={id} issueId={resourceId} />
      : view === 'commit' ? <CommitView repo={id} commitId={resourceId} />
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
      title: '',
      currentUser: getPreviousUser(),
      ...onHashChange()
    };
  },

  onHashChange: (props, state, actions)=>{
    const [, owner, repo, repoResource, repoResourceId] = window.location.hash.split('/');
    if(state) document.body.scrollTop = 0;
    return {
      ...(
         repo ? actions[repoResource ? `viewRepo_${repoResource}` : 'viewRepo'](
            `${owner}/${repo}`, repoResourceId )
        : owner ? actions.viewUser(owner)
        : {...state, view: 'waiting'}
      ),
      isDrawerEnabled: false,
      isSearchEnabled: false
    }
  },

  viewUser: (props, state, actions, user)=>({
    ...state,
    view: 'events',
    id: user,
    title: user
  }),

  viewRepo: (props, state, actions, repo)=>({
    ...state,
    view: 'repo',
    id: repo,
    title: repo
  }),

  viewRepo_issues: (props, state, actions, repo, issueId)=>({
    ...state,
    view: 'issue',
    id: repo,
    resourceId: issueId,
    title: issueId
  }),

  viewRepo_commits: (props, state, actions, repo, commitId)=>({
    ...state,
    view: 'commit',
    id: repo,
    resourceId: commitId,
    title: commitId
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
