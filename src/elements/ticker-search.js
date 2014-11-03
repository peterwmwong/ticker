import EventStream from '../models/EventStream';
import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-search', {
  state:appState,
  searchText: '',
  results: [],
  suggestions: [],

  // Change Handlers
  // ===============

  searchTextChanged(_, searchText){
    this.job('search',()=>{
      if(this.searchText)
        this.searchResults = EventStream.query({term:this.searchText});
    }, 500);
  },

  // Event Handlers
  // ==============

  onClearSearch(){
    this.searchText = '';
    this.searchResults = [];
  },

  onCloseSearch(){
    this.fire('ticker-search-close');
  },

  onSearchResultSelected(event){
    this.fire('ticker-search-select', event.target.templateInstance.model.searchResult);
  }

});
