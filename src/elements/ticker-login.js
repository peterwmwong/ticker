import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from './ticker-app-state';

StatefulPolymer('ticker-login', {
  state:appState,

  onLogin(){appState.fire('authWithGithub')}
});
