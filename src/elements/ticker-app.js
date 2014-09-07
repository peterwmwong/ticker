import session from '../helpers/session';

Polymer('ticker-app',{
  selectedEventStream: null,
  isSearching: false,
  searchText: '',
  session,

  ready(){
    this.selectedEventStream = session.user.eventStreams[0];
  },

  // Change Handlers
  // ===============

  selectedEventStreamChanged(_, selectedEventStream){
    if(selectedEventStream){
      this.events = selectedEventStream.events();
    }
  },

  // Event Handlers
  // ==============

  onCloseSearch(){
    this.isSearching = false;
  },

  // When an event stream is selected from <ticker-search>
  // TODO(pwong): better naming! bound to be confused with onSelectSearch!
  onSearchSelect(event,selectedEventStream){
    this.selectedEventStream = selectedEventStream;
    this.onCloseSearch();
  },

  onSelectSearch(){
    this.isSearching = true;
    this.$.drawerPanel.closeDrawer();
  },

  onSelectEventStream(event){
    this.isSearching = false;
    this.selectedEventStream = event.target.templateInstance.model.eventStream;
    this.$.drawerPanel.closeDrawer();
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  },

  onRefresh(){
    this.events = this.selectedEventStream.events();
  }

});
