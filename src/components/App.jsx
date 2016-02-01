import './App-old.css';
import './App.css';
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
  {currentUser, overlayView, view, type, id, resourceId},
  {enableDrawer, enableSearch, disableOverlay, login, changeTitle}
)=>
  <body className='App fit fullbleed'>
    {   view === 'events' ? <UserView   id={id} />
      : view === 'repo'   ? <RepoView   id={id} />
      : view === 'issue'  ? <IssueView  repo={id} issueId={resourceId} />
      : view === 'commit' ? <CommitView repo={id} commitId={resourceId} />
      : null
    }
    <div
      className={`App-backdrop fixed ${overlayView ? 'is-enabled' : ''}`}
      onclick={disableOverlay}
    />
    <AppSearch
      enabled={overlayView === 'search'}
      onRequestDisable={disableOverlay}
    />
    <AppDrawer
      user={currentUser}
      enabled={overlayView === 'drawer'}
      onLogin={login}
    />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onCurrentUserChange, enableSearch, enableDrawer})=>{
    (AppToolbar.onDrawer=enableDrawer),
    (AppToolbar.onSearch=enableSearch),
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
      drawerEnabled: false,
      overlayView: ''
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

  enableSearch:   (props, state, actions)=>({...state, overlayView: 'search'}),
  enableDrawer:   (props, state, actions)=>({...state, overlayView: 'drawer'}),
  disableOverlay: (props, state, actions)=>({...state, overlayView: ''}),

  login: (props, state, {onCurrentUserChange})=>(
    authWithOAuthPopup().then(onCurrentUserChange),
    state
  ),

  onCurrentUserChange: (props, state, actions, currentUser)=>
    currentUser ? {...state, currentUser} : state

};

export default App;
