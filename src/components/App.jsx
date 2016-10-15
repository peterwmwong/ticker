import '../../vendor/octicons/octicons.css';
import '../css/colors.css';
import '../css/flex.css';
import '../css/icons.css';
import '../css/layout.css';
import '../css/link.css';
import '../css/reset.css';
import '../css/text.css';
import './App.css';

import '../helpers/installServiceWorker';
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

const APP_CLASS = `App ${window.navigator.standalone ? 'is-apple-standalone' : ''}`;

const App = ({
  state: {user, hasSearch, hasDrawer, view, viewId, viewUrl},
  bindSend
}) =>
  <body className={APP_CLASS}>
    {view === 'user'
      ? <UserView id={viewId} user={user} viewUrl={viewUrl} />
      : <RepoView id={viewId} user={user} viewUrl={viewUrl} />
    }
    <div
      className={`App-backdrop fixed ${hasSearch || hasDrawer ? 'is-enabled' : ''}`}
      onclick={bindSend('disableOverlay')}
    />
    <AppSearch enabled={hasSearch} />
    <AppDrawer enabled={hasDrawer} onLogin={bindSend('login')} user={user} />
  </body>;

const stateFromHash = hash => {
  const [appUrl, viewUrl] = hash.split('?');
  const viewId = appUrl.slice(8);
  return {
    hasSearch: false,
    hasDrawer: false,
    view: (/\//.test(viewId) ? 'repo' : 'user'),
    viewId,
    viewUrl
  }
};

App.state = {
  onInit: ({bindSend}) => {
    App.showDrawer      = bindSend('enableDrawer');
    App.showSearch      = bindSend('enableSearch');
    window.onhashchange = bindSend('onHashChange');
    return {
      user: getCurrentUser(bindSend('onUserChange')),
      ...stateFromHash(window.location.hash)
    };
  },

  onHashChange: ({state}) => {
    document.body.scrollTop = 0;
    return {
      ...state,
      ...stateFromHash(window.location.hash)
    };
  },

  enableSearch:   ({state}) => ({...state, hasSearch:true,  hasDrawer:false}),
  enableDrawer:   ({state}) => ({...state, hasSearch:false, hasDrawer:true}),
  disableOverlay: ({state}) => ({...state, hasSearch:false, hasDrawer:false}),
  onUserChange:   ({state}, user) => ({...state, user}),

  login: ({state, bindSend}) => (
    authWithOAuthPopup().then(bindSend('onUserChange')),
    state
  )
};

document.body = xvdom.render(<App />);

export default App;
