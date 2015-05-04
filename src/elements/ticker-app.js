Polymer({
  is: 'ticker-app',

  behaviors:[
    syncState(['appView', 'isLoggedIn'])
  ],

  _onToggleDrawer(e){ this.$.drawer.togglePanel(); }

  // TODO(pwong): Currently unused but will need to sprinkle this all over the
  //              place.  Wherever the user needs to do a user specfic operation
  //              (ex. Favorite a Github User/Repo)
  // _onAuthWithGithub:()=>appState.fire('authWithGithub')
});
