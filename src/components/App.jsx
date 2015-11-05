import './App.css';
import AppDrawer      from './AppDrawer.jsx';
import Toolbar        from './Toolbar.jsx';
import UserView       from './UserView.jsx';
import RepoView       from './RepoView.jsx';
import CommitView     from './CommitView.jsx';
import loadMaterialIcons from '../helpers/loaders/loadMaterialIcons';
import {
  authWithOAuthPopup,
  getCurrentUser
} from '../helpers/getCurrentUser';

const viewUser = (props, state, dispatch, user)=>({...state, view: 'user', data: user});
const viewRepo = (props, state, dispatch, repo)=>({...state, view: 'repo', data: repo});
const onCurrentUserChange = (props, state, dispatch, currentUser)=>({
  ...state,
  currentUser
});

const enableDrawer  = (props, state, dispatch)=>({...state, drawerEnabled: true});
const disableDrawer = (props, state, dispatch)=>({...state, drawerEnabled: false});
const selectSource  = (props, state, dispatch, source)=>{
  window.location.hash = `#github/${source.displayName}`;
  return state;
};

function onHashChange(props, state, dispatch){
  const hash = window.location.hash;
  if(hash){
    const [, owner, repo] = hash.split('/');
    if(repo)       return dispatch(viewRepo, `${owner}/${repo}`);
    else if(owner) return dispatch(viewUser, owner);
  }
  return {...state, view: 'waiting'};
}

const login = (props, state, dispatch)=>{
  authWithOAuthPopup().then(()=>dispatch(onCurrentUserChange));
  return state;
};

const App = (props, state, dispatch)=>
  <body className='App fit fullbleed'>
    <Toolbar title={state.data} onRequestDrawer={()=>dispatch(enableDrawer)} />
    {
        state.view === 'user'   ? <UserView   user={state.data} />
      : state.view === 'repo'   ? <RepoView   repo={state.data} />
      : state.view === 'commit' ? <CommitView commit={state.data} />
      : null
    }
    <AppDrawer
      user={state.currentUser}
      enabled={state.drawerEnabled}
      onSelectSource={()=>dispatch(selectSource)}
      onRequestDisable={()=>dispatch(disableDrawer)}
      onLogin={()=>dispatch(login)}
    />
  </body>;

App.getInitialState = (props, state, dispatch)=>{
  window.onhashchange = ()=>dispatch(onHashChange);
  getCurrentUser().then(()=>dispatch(onCurrentUserChange));
  loadMaterialIcons();
  return dispatch(onHashChange);
}

export default App;
