Polymer('ticker-stream', {
  isLoaded: false,
  stream: null,
  events: null,

  isEventStreamFavorited(item){
    return this.$.session.data &&
            this.$.session.data.user.eventStreams &&
            (this.$.session.data.user.eventStreams.indexOf(item) !== -1);
  },

  streamChanged(_, newStream){
    this.isLoaded = false;
    this.events = null;
    newStream.events().$promise.then((events)=>{
      this.events = events;
      this.isLoaded = true;
    });

    this.isSelectedEventStreamFavorited = this.isEventStreamFavorited(newStream);
  },

  // Event Handlers
  // ==============

  onOpenDrawer(){
    this.fire('ticker-stream-open-drawer');
  },

  onToggleFavoriteEventStream(event){
    var user = this.$.session.data && this.$.session.data.user;
    if(this.stream && user && user.eventStreams){
      if(this.isEventStreamFavorited(this.stream)){
        user.removeEventStreams(this.stream);
        this.isSelectedEventStreamFavorited = false;
      }else{
        user.addEventStreams(this.stream);
        this.isSelectedEventStreamFavorited = true;
      }
      user.$save();
    }
  },
})
