import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-app', {
  state:tickerAppState,

  DRAWER_SWIPE_DISABLED:(
    /AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
  ),

  expandedToSelected:{
    toDOM:drawerExpanded=>drawerExpanded ? 'drawer' : 'main',
    toModel(selected){
      if(this.state.appDrawerExpanded != (selected === 'drawer'))
        this.stateEvent('toggleAppDrawer');
      return this.state.appDrawerExpanded;
    }
  }
});
