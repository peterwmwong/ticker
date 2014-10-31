import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-stream', {

  state:tickerAppState,

  events: null,

  computed:{
    'stream': 'state.stream'
  },

  streamChanged(_, newStream){
    this.events = null;
    newStream.events().$promise.then((events)=>{
      this.events = events;
    });
  },

  // Event Handlers
  // ==============

  onOpenDrawer(){this.stateEvent('toggleAppDrawer')},

  onToggleFavoriteEventStream(){this.stateEvent('toggleFavoriteStream')}
})
