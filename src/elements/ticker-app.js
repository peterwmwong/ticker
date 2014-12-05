import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

// Load Global Filters
import limitArray from '../filters/limitArray';
import timeAgo from '../filters/timeAgo';
import trueFalseTo from '../filters/trueFalseTo';

StatefulPolymer('ticker-app', {
  state:appState
});
