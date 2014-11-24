import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-search', {
  state:appState
});
