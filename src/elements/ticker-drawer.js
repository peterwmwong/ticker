import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-drawer', {
  state:tickerAppState
});
