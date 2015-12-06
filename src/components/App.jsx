import './App-old.css';
import './App.css';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import Toolbar    from './Toolbar.jsx';
import EventsView from './EventsView.jsx';
import CommitView from './CommitView.jsx';
import IssueView  from './IssueView.jsx';
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
    {   view === 'events' ? <EventsView
                              type={type}
                              id={id}
                              onRequestDrawer={enableDrawer}
                              onRequestSearch={enableSearch}
                              onTitleChange={changeTitle}
                            />
      : view === 'issue' ?  <IssueView
                              repo={id}
                              issueId={resourceId}
                              onRequestDrawer={enableDrawer}
                              onRequestSearch={enableSearch}
                              onTitleChange={changeTitle}
                            />
      : view === 'commit' ? <CommitView
                              repo={id}
                              commitId={resourceId}
                              onRequestDrawer={enableDrawer}
                              onRequestSearch={enableSearch}
                              onTitleChange={changeTitle}
                            />
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
      ...onHashChange(),
      scrollTop: 0,
      currentUser: getPreviousUser(),
      title: '',
      scrollClass: ''
    };
  },

  onHashChange: (props, state, actions)=>{
    const [, owner, repo, repoResource, repoResourceId] = window.location.hash.split('/');
    if(state) document.body.scrollTop = 0;
    return (
         repo ? actions[repoResource ? `viewRepo_${repoResource}` : 'viewRepo'](
          `${owner}/${repo}`, repoResourceId )
      : owner ? actions.viewUser(owner)
      : {...state, view: 'waiting'}
    )
  },

  viewUser: (props, state, actions, user)=>({
    ...state,
    scrollTop: 0,
    view: 'events',
    type: 'users',
    id: user,
    drawerEnabled: false,
    overlayView: ''
  }),

  viewRepo: (props, state, actions, repo)=>({
    ...state,
    scrollTop: 0,
    view: 'events',
    type: 'repos',
    id: repo,
    overlayView: ''
  }),

  viewRepo_issues: (props, state, actions, repo, issueId)=>({
    ...state,
    scrollTop: 0,
    view: 'issue',
    id: repo,
    resourceId: issueId,
    overlayView: ''
  }),

  viewRepo_commits: (props, state, actions, repo, commitId)=>({
    ...state,
    scrollTop: 0,
    view: 'commit',
    id: repo,
    resourceId: commitId,
    overlayView: ''
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

  changeTitle: (props, state, {doChangeTitle}, title)=>(
    window.setTimeout(()=>doChangeTitle(title), 250),
    state
  ),
  doChangeTitle: (props, state, actions, title)=>({...state, title}),

  onScroll: (props, state, actions, scrollEvent)=>{
    const scrollTop = document.body.scrollTop;
    return {
      ...state,
      scrollTop,
      scrollClass: (
        (scrollTop > 56 && scrollTop - state.scrollTop > 0) ? 'is-scrolling-down'
          : ''
      )
    };
  }
};

export default App;
