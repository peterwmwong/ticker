import session from '../helpers/session';

Polymer('ticker-app',{
  selectedEventStream: null,
  isSearching: false,
  searchText: '',
  events: [],
  session,

  ready(){
    this.selectEventStream(session.user.eventStreams[0], 0);
  },

  // Selects an EventStream and delays rendering of events by a specified amount.
  // Delaying rendering allows for smooth, jank-free drawer close (see
  // `onSelectEventStream()`).
  selectEventStream(newSelectedEventStream, renderDelay){
    if(newSelectedEventStream){
      Promise.all([
        newSelectedEventStream.events().$promise,
        new Promise((resolve)=>setTimeout(resolve, renderDelay))
      ]).then(([events])=>{
        this.events = events;
        this.injectBoundHTML(
          "<ticker-github-events-card block events='[[events]]'></ticker-github-events-card>",
          this.$.content
        );
      });
      this.selectedEventStream = newSelectedEventStream;
    }
  },

  // Change Handlers
  // ===============

  // Event Handlers
  // ==============

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
    this.selectEventStream(event.target.templateInstance.model.eventStream, 325);
  },

  onOpenDrawer(){
    this.$.drawerPanel.openDrawer();
  },

  onRefresh(){
    this.events = this.selectedEventStream.events();
  }

});
