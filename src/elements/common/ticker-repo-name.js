Polymer({
  is: 'ticker-repo-name',
  properties:{
    repoName:{
      type:String,
      observer:'_repoNameChanged'
    }
  },
  _repoNameChanged(repoName){
    if(!repoName){ return; }
    const [org, repo] = repoName.split('/');
    this._org  = `${org}/`;
    this._repo = repo;
  }
});
