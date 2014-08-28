import Event from '../models/github/Event';

Polymer('ticker-app',{
  query: {type:'users',users:'polymer'},

  ready(){
    // this.githubEvents = Event.query({type:'repos', repos:'centro/centro-media-manager'});
    this.githubEvents = Event.query(this.query);
  },

  // Event Handlers
  onRefresh(){
    this.githubEvents.$query(this.query);
  }
});
