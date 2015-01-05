import StatefulPolymer from '../helpers/StatefulPolymer.js';
import appState from '../states/appState.js';

StatefulPolymer('ticker-drawer', {
  state:appState
});
