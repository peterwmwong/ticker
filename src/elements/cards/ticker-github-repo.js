Polymer('ticker-github-repo', {
  repoChanged: function(_, repo){
    if(repo)
      [this.repoOwner, this.repoName] = repo.split('/');
  }
});
