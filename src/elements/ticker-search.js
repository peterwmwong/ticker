import User from '../models/github/User';

Polymer('ticker-search',{
  searchText: '',
  results: [],
  suggestions: [],

  // Change Handlers
  // ===============

  searchTextChanged(_, searchText){
    this.job('search',()=>{
      if(this.searchText)
        this.searchResults = User.query({q:this.searchText});
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
