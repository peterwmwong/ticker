(function(){
  var fbRecipes =  new Firebase("https://menudev.firebaseio.com/recipes");
  var IDMAP     = {};

  function clone(arr){ return Array.prototype.slice.call(arr) }

  function Recipe(fb, createData){
    var _this       = this;
    IDMAP[fb.key()] = this;
    this._fb        = fb;
    this._initData(createData);

    if(!createData)
      fb.once("value", function(snap){ _this._initData(snap.val()) });
    else
      this.isNew = true;
  }

  Recipe.prototype = {
    get id(){
      return this._fb.key();
    },
    _initData: function(data){
      data             = data || {};
      this.name        = data.name;
      this.ingredients = data.ingredients || [];
      this.directions  = data.directions  || [];
    },
    delete: function(cb){
      this._fb.remove(cb);
    },
    save: function(){
      this._fb.set({
        name        : this.name,
        ingredients : clone(this.ingredients),
        directions  : clone(this.directions)
      });
      this.isNew = false;
    }
  };

  Recipe.create = function(){
    var data = {
      name        : '',
      ingredients : [],
      directions  : []
    };
    return new Recipe(fbRecipes.push(), data);
  };

  Recipe.all = [];

  fbRecipes.on("child_added", function(data) {
    Recipe.all.push(IDMAP[data.key()] || new Recipe(data.ref()));
  });

  fbRecipes.on("child_removed", function(data) {
    for(var i=0; i<Recipe.all.length; ++i){
      if(Recipe.all[i].id === data.key()){
        Recipe.all.splice(i, 1);
        return;
      }
    }
  });

  window.Recipe = Recipe;
})();
