Polymer({
  is: 'ticker-app',

  behaviors:[
    syncState(['appView', 'isLoggedIn'])
  ],

  _onToggleDrawer(e){ this.$.drawer.togglePanel(); },
  _onAuthWithGithub:()=>appState.fire('authWithGithub')
});
