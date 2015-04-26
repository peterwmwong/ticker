Polymer({
  is: 'ticker-app',

  behaviors:[
    new SyncState({
      appView: 'appView',
      isLoggedIn: 'isLoggedIn'
    })
  ],

  _onToggleDrawer(e){ this.$.drawer.togglePanel(); },
  _onAuthWithGithub:()=>appState.fire('authWithGithub')
});
