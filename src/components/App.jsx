import './App-old.css';
import './App.css';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import Toolbar    from './Toolbar.jsx';
import EventsView from './EventsView.jsx';
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
  {currentUser, overlayView, view, type, id, resourceId, scrollClass, title},
  {enableDrawer, enableSearch, disableOverlay, login, onScroll, changeTitle}
)=>
  <body className='App fit fullbleed' onscroll={onScroll}>
    {   view === 'events' ? <EventsView type={type} id={id} />
      : view === 'repo'   ? <RepoView   type={type} id={id} />
      : view === 'issue'  ? <IssueView  repo={id} issueId={resourceId} />
      : view === 'commit' ? <CommitView repo={id} commitId={resourceId} />
      : null
    }
    <Toolbar
      className={`fixed fixed--top ${scrollClass}`}
      title={title}
      onRequestDrawer={enableDrawer}
      onRequestSearch={enableSearch}
    />
    <div
      className={`App-backdrop fixed ${overlayView ? 'is-enabled' : ''}`}
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
      title: '',
      currentUser: getPreviousUser(),
      scrollClass: '',
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
      ...actions.onScroll(),
      drawerEnabled: false,
      overlayView: ''
    }
  },

  viewUser: (props, state, actions, user)=>({
    ...state,
    view: 'events',
    type: 'users',
    id: user,
    title: user
  }),

  viewRepo: (props, state, actions, repo)=>({
    ...state,
    view: 'repo',
    type: 'repos',
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
    currentUser ? {...state, currentUser} : state,

  onScroll: (props, state, actions)=>{
    const scrollTop = document.body ? document.body.scrollTop : 0;
    return {
      ...state,
      scrollTop,
      scrollClass:
        (scrollTop < 60                  ? 'is-hiding'         : '') +
        (scrollTop - state.scrollTop > 0 ? ' is-scrolling-down': '')
    };
  }
};

export default App;
