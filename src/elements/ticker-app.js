import Event from '../models/github/Event';

Polymer('ticker-app',{
  query: {type:'users',users:'Polymer'},
  isSearching: false,
  searchText: '',

  ready(){
    // this.githubEvents = Event.query({type:'repos', repos:'centro/centro-media-manager'});
    this.githubEvents = Event.query(this.query);
  },

  focusSearchInput(){
    this.job('focusSearchInput',_=>{
      var searchInput = this.shadowRoot.querySelector('#searchInput');
      if(searchInput)
        searchInput.focus();
    }, 150);
  },

  // Event Handlers
  // ==============

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
