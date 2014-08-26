// TODO(pwong): get this outa here!
PolymerExpressions.prototype.limitArray = function(array, size){
  return array && array.slice(0,size);
};

Polymer('ticker-github-events-card', {
})
