Polymer('ticker-github-branch', {
  branchChanged(_, branch){
    this.branchName = branch && branch.split('/').slice(-1);
  }
})
