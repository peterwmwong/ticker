import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-source-github-user', {
  state:appState
})