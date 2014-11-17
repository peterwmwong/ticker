import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

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
