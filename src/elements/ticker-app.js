Polymer({
  is: 'ticker-app',

  behaviors:[
    new SyncState({
      appView: 'appView'
    })
  ],

  properties: {
    _topToolbarClass: {
      type:  String,
      value: 'ticker-app__top-toolbar'
    },
    _prevScrollTop: {
      type:  Number,
      value: 0
    }
  },

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

    this.$.bottomBar = scrollTop;
    this._prevScrollTop = scrollTop;
  },

  _onToggleDrawer(e){
    e.stopPropagation();
    this.$.drawer.togglePanel();
  },

  _onOpenSearch:()=>window.appState.fire('appSearchOpen')
});
