import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-app', {

  state:tickerAppState,

  DRAWER_SWIPE_DISABLED:(
    /AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
  ),

  isSearching:false,
  searchText:'',
  events:[],


  // Event Handlers
  // ==============

  onLogin(){
    this.$.session.login();
  },

  onCloseSearch(){
    this.isSearching = false;
  },

  // When an event stream is selected from <ticker-search>
  // TODO(pwong): better naming! bound to be confused with onSelectSearch!
  onSearchSelect(event, selectedEventStream){
    this.selectEventStream(selectedEventStream, 0);
    this.onCloseSearch();
  },

  onSelectSearch(){
    this.isSearching = true;
    this.$.drawerPanel.closeDrawer();
  },

  onSelectEventStream(event){
    this.$.drawerPanel.closeDrawer();
    this.isSearching = false;
    this.selectEventStream(
      event.target.templateInstance.model.eventStream,
      (this.narrow ? 450 : 0)
    );
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  }

});
