import '../../vendor/octicons/octicons.css';
import '../../vendor/highlightjs/styles/github.css';
import './App-old.css';
import './App.css';
import '../helpers/globalLogger';
import xvdom      from 'xvdom';
import AppDrawer  from './AppDrawer.jsx';
import AppSearch  from './AppSearch.jsx';
import UserView   from './UserView.jsx';
import RepoView   from './RepoView.jsx';
import {
  authWithOAuthPopup,
  getCurrentUser
} from '../helpers/getCurrentUser';

const App = (
  props,
  {user, hasSearch, hasDrawer, view, viewId, viewUrl},
  {disableOverlay, login}
)=>
  <body className='App fit fullbleed'>
    {view === 'user'
      ? <UserView id={viewId} user={user} viewUrl={viewUrl} />
      : <RepoView id={viewId} user={user} viewUrl={viewUrl} />
    }
    <div
      className={`App-backdrop fixed ${hasSearch || hasDrawer ? 'is-enabled' : ''}`}
      onclick={disableOverlay}
    />
    <AppSearch enabled={hasSearch} />
    <AppDrawer enabled={hasDrawer} onLogin={login} user={user} />
  </body>;

App.state = {
  onInit: (props, state, {onHashChange, onUserChange, enableSearch, enableDrawer})=> {
    App.showDrawer      = enableDrawer;
    App.showSearch      = enableSearch;
    window.onhashchange = onHashChange;
    return {
      user: getCurrentUser(onUserChange),
      ...onHashChange()
    };
  },

  onHashChange: (props, state, {view, disableOverlay})=> {
    if(state) document.body.scrollTop = 0;
    const [appUrl, viewUrl] = window.location.hash.split('?');
    const viewId = appUrl.slice(8);
    return {
      ...view((/\//.test(viewId) ? 'repo' : 'user'), viewId, viewUrl),
      ...disableOverlay()
    }
  },

  view: (props, state, actions, view, viewId, viewUrl)=> ({
    ...state, view, viewId, viewUrl
  }),

  enableSearch:   (props, state)=> ({...state, hasSearch:true,  hasDrawer:false}),
  enableDrawer:   (props, state)=> ({...state, hasSearch:false, hasDrawer:true}),
  disableOverlay: (props, state)=> ({...state, hasSearch:false, hasDrawer:false}),
  onUserChange:   (props, state, actions, user)=> ({...state, user}),

  login: (props, state, {onUserChange})=> (
    authWithOAuthPopup().then(onUserChange),
    state
  )
};

document.body = xvdom.render(<App />);

export default App;
