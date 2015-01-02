import StatefulPolymer from '../helpers/StatefulPolymer.js';
import appState from '../states/appState.js';

// Load Global Filters
import '../filters/limitArray.js';
import '../filters/timeAgo.js';
import '../filters/trueFalseTo.js';

StatefulPolymer('ticker-app', {
  state:appState
});
