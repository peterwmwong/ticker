Polymer('ticker-app', {
  DRAWER_SWIPE_DISABLED: (
    /AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
  ),
  selectedEventStream: null,
  isSearching: false,
  searchText: '',
  events: [],

  observe: {
    '$.state.data.user': 'onUserChanged'
  },

  onUserChanged(_, user){
    if(user){
      if(user.eventStreams.length)
        this.selectEventStream(user.eventStreams[0], 0);
      else
        this.isSearching = true;
    }
  },

  // Selects an EventStream and delays rendering of events by a specified amount.
  // Delaying rendering allows for smooth, jank-free drawer close (see
  // `onSelectEventStream()`).
  // TODO(pwong): Maybe do something like #drawerPanel(on-transitionend='{{loadEventStream}}')
  selectEventStream(newSelectedEventStream, renderDelay){
    if(newSelectedEventStream){
      // TODO(pwong): This is is not optimal.  We'd like to kick off the request
      //              for events AND THEN delay.  This is in response to jank that
      //              is caused by the Model framework burning too many cycles
      //              parsing the response during the drawer closing. T_T
      setTimeout(()=>{
        this.selectedEventStream = newSelectedEventStream;
      }, renderDelay);
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
    this.selectEventStream(
      event.target.templateInstance.model.eventStream,
      (this.narrow ? 450 : 0)
    );
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  }

});
