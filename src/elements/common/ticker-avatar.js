Polymer({
  is: 'ticker-avatar',
  properties:{
    source:{
      type:Object,
      observer:'_sourceChanged'
    }
  },
  _sourceChanged(source){
    this._avatarUrl = source.avatar_url ? `${source.avatar_url}&s=32` : null;
  }
});
