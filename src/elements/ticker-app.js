import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

// Load Global Filters
import limitArray from '../filters/limitArray';
import timeAgo from '../filters/timeAgo';

StatefulPolymer('ticker-app', {
  state:appState,

  DRAWER_SWIPE_DISABLED: !/Chrome/.test(window.navigator.userAgent) &&
    /AppleWebKit.*Mobile.*Safari/.test(window.navigator.userAgent),

  openedToSelected:{
    toDOM:drawerOpened=>drawerOpened ? 'drawer' : 'main',
    toModel(selected){
      if(this.state.appDrawerOpened != (selected === 'drawer'))
        this.stateEvent('toggleAppDrawer');
      return this.state.appDrawerOpened;
    }
  }
});
