Polymer({
  is: 'ticker-avatar',
  properties:{
    source:{
      type:Object,
      observer:'_sourceChanged'
    }
  },
  _sourceChanged(source){
    this.innerHTML = (source.avatar_url)
      ? `<img src='${source.avatar_url}&s=32' class='ticker-avatar-icon' onerror='this.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="'>`
      : `<iron-icon icon='github:book' class='c-gray-light' style='width:28px; height:28px; display:inline-block;'></iron-icon>`;
  }
});
