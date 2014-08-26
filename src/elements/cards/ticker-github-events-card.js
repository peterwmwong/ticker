// TODO(pwong): get this outa here!
PolymerExpressions.prototype.limitArray = function(array, size){
  return array && array.slice(0,size);
};

Polymer('ticker-github-events-card', {
  dataChanged(_, data){
    var nameParts = data.repo.name.split('/');
    data.repoOwner = nameParts[0];
    data.repoName = nameParts[1];
  }
})
