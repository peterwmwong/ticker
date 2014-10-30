import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-stream', {

  state:tickerAppState,

  isLoaded: false,
  stream: null,
  events: null,

  computed:{
    'stream': 'state.stream'
  },

  isEventStreamFavorited(item){
    return this.stream &&
            this.state.user.eventStreams &&
            (this.state.user.eventStreams.indexOf(item) !== -1);
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
    var user = this.$.state.data && this.$.state.data.user;
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
