Polymer({
  is: 'ticker-github-user-view',

  behaviors:[
    new SyncState({
      isSourceFavorited: 'isSourceFavorited',
      source: 'source'
    })
  ],

  properties: {
    isSourceFavorited:{
      type: Object,
      observer: '_isSourceFavoritedChanged'
    },
    _topToolbarClass: {
      type:  String,
      value: 'ticker-app__top-toolbar'
    },
    _prevScrollTop: {
      type:  Number,
      value: 0
    }
  },

  _isSourceFavoritedChanged(faved){
    this._favOrUnfavIcon = faved ? 'ticker:bookmark' : 'ticker:bookmark-outline';
  },

  _onFavorite(){ appState.fire('toggleFavoriteSource'); },

  _onPanelScroll(e){
    const scrollTop = e.detail.target.scrollTop;
    if(scrollTop && this._prevScrollTop > scrollTop){
      if(this._topToolbarClass !== 'ticker-app__top-toolbar is-scrolling-up'){
        this.$.topToolbar.style.top = '';
        this._topToolbarClass = 'ticker-app__top-toolbar is-scrolling-up';
      }
    }
    else{
      if(this._topToolbarClass !== 'ticker-app__top-toolbar'){
        this.$.topToolbar.style.top = `${scrollTop}px`;
        this._topToolbarClass = 'ticker-app__top-toolbar';
      }
    }

    this._prevScrollTop = scrollTop;
  },

  _onToggleDrawer(e){
    e.stopPropagation();
    this.fire('toggle-app-drawer', null, {bubbles:false});
  },

  _onOpenSearch:()=>appState.fire('appSearchOpen')
});
