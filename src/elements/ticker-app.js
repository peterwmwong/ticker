import Event from '../models/github/Event';
import EventStream from '../models/EventStream';

Polymer('ticker-app',{
  selectedEventStream: null,
  isSearching: false,
  searchText: '',

  ready(){
    // TODO(pwong): Can't we assign eventStreams on promise resolve?
    this.eventStreams = EventStream.query();
    this.eventStreams.$promise.then(_=>
      this.selectedEventStream = this.eventStreams[0]);
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
