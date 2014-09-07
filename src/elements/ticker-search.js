import EventStream from '../models/EventStream';

Polymer('ticker-search',{
  searchText: '',
  results: [],
  suggestions: [],

  // Change Handlers
  // ===============

  searchTextChanged(_, searchText){
    this.job('search',()=>{
      if(this.searchText)
        this.searchResults = EventStream.query({term:this.searchText});
    },100);
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
