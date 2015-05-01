Polymer({
  is: 'ticker-search',
  hostAttributes:{
    hidden: true
  },

  behaviors:[
    new SyncState({
      appSearch: 'appSearch',
      searchResults: 'searchResults'
    })
  ],

  properties:{
    appSearch:{
      type:Boolean,
      value:false,
      observer: '_appSearchChanged'
    }
  },

  created(){
    this.className = 'fixed-top fixed-bottom';
  },

  _appSearchChanged(val){
    if(val){
      this.$.searchInput.value = '';
    }
    this.hidden = !val;
  },

  _onCloseSearch:()=>appState.fire('appSearchClose'),

  _onSearchTextInput:e=>appState.fire('searchTextChanged', e.target.value)
});
