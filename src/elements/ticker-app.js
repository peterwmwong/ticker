Polymer('ticker-app', {
  selectedEventStream: null,
  isSearching: false,
  searchText: '',
  events: [],

  observe: {
    '$.session.data.user': 'onUserChanged'
  },

  onUserChanged(_, user){
    if(user)
      this.selectEventStream(user.eventStreams[0], 0);
  },

  // Selects an EventStream and delays rendering of events by a specified amount.
  // Delaying rendering allows for smooth, jank-free drawer close (see
  // `onSelectEventStream()`).
  // TODO(pwong): Maybe do something like #drawerPanel(on-transitionend='{{loadEventStream}}')
  selectEventStream(newSelectedEventStream, renderDelay){
    if(newSelectedEventStream){
      this.$.content.style.opacity = 0;
      // TODO(pwong): This is is not optimal.  We'd like to kick off the request
      //              for events AND THEN delay.  This is in response to jank that
      //              is caused by the Model framework burning too many cycles
      //              parsing the response during the drawer closing. T_T
      setTimeout(()=>{
        newSelectedEventStream.events().$promise.then((events)=>{
          this.events = events;
          this.$.content.scrollTop = 0;
          this.$.content.style.opacity = 1;
        });
      }, renderDelay);
      this.selectedEventStream = newSelectedEventStream;
    }
  },

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
    this.selectEventStream(event.target.templateInstance.model.eventStream, 450);
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  },

  onRefresh(){
    this.events = this.selectedEventStream.events();
  }

});
