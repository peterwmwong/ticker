Polymer({
  is: 'ticker-user-view',

  behaviors:[
    syncState(['isSourceFavorited', 'sourceName'])
  ],

  properties: {
    source:{
      type: Object,
      observer: '_sourceChanged'
    },
    isSourceFavorited:{
      type: Object,
      observer: '_isSourceFavoritedChanged'
    },
    _isScrollingUp: {
      type: Boolean,
      value: false
    },
    _prevScrollTop: {
      type:  Number,
      value: 0
    }
  },

  _sourceChanged(){
    this.$.headerPanel.scroller.scrollTop = 0;
    this._onPanelScroll({detail:{target:{scrollTop:0}}});
  },

  _isSourceFavoritedChanged(faved){
    this._favOrUnfavIcon = faved ? 'ticker:bookmark' : 'ticker:bookmark-outline';
  },

  _onFavorite(){ appState.fire('toggleFavoriteSource'); },

  _onPanelScroll(e){
    const scrollTop = e.detail.target.scrollTop;
    if(this._prevScrollTop > scrollTop){
      if(!this._isScrollingUp){
        this.$.toolbar.style.top = '';
        this._isScrollingUp = true;
      }
    }
    else if(this._isScrollingUp){
      this.$.toolbar.style.top = `${scrollTop}px`;
      this._isScrollingUp = false;
    }

    this._prevScrollTop = scrollTop;
  },

  _getToolbarClass(isScrollingUp){
    return `ticker-user-view__toolbar ${isScrollingUp ? 'is-scrolling-up' : ''}`;
  },

  _onToggleDrawer(e){
    e.stopPropagation();
    this.fire('toggle-app-drawer', null, {bubbles:false});
  },

  _onOpenSearch:()=>appState.fire('appSearchOpen')
});
