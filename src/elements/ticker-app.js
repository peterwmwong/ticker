import Event from '../models/github/Event';
import EventStream from '../models/EventStream';

Polymer('ticker-app',{
  selectedEventStream: null,
  isSearching: false,
  searchText: '',

  ready(){
    this.eventStreams = EventStream.query();
    this.eventStreams.$promise.then(_=>{
      this.selectedEventStream = this.eventStreams[0];
    })
  },

  focusSearchInput(){
    this.job('focusSearchInput', _=>{
      var searchInput = this.shadowRoot.querySelector('#searchInput');
      if(searchInput)
        searchInput.focus();
    }, 150);
  },

  // Change Handlers
  // ===============
  selectedEventStreamChanged(_, selectedEventStream){
    if(selectedEventStream)
      this.events = selectedEventStream.events();
  },

  // Event Handlers
  // ==============

  onSelectEventStream(event){
    this.selectedEventStream = event.target.templateInstance.model.eventStream;
    this.job('closeDrawer', _=>this.$.drawerPanel.closeDrawer(), 10);
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  },

  onRefresh(){
    this.githubEvents.$query(this.query);
  },

  onShowSearch(){
    this.isSearching = true;
    this.focusSearchInput();
  },

  onHideSearch(){
    this.isSearching = false;
  },

  onClearSearch(){
    this.searchText = '';
    this.focusSearchInput();
  }

});
