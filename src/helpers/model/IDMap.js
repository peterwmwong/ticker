// Internal: An auto-incrementing id used to distinguish between model classes.
var nextClassId = 0;

// Internal: An object that keeps track of all model instances by their class
// and id.
var models = {};

// Internal: The `IDMap` object is an
// [identity map](http://martinfowler.com/eaaCatalog/identityMap.html). Its
// purpose is to prevent loading multiple instances of the same model object into
// memory. The `Model` API always checks the `IDMap` for a model instance before
// instantiating a new one.
export default {

  // Internal: Inserts the model into the identity map.
  //
  // Returns `undefined`.
  // Throws `Error` if a model with the same class and id already exists in the
  //   map.
  insert(model){
    model.constructor.__classId__ = model.constructor.__classId__ || nextClassId++;

    var id  = model.id;
    var map = models[model.constructor.__classId__] = (models[model.constructor.__classId__] || {});

    if(map[id])
      throw `${model.$className()}: a model with id '${id}' already exists`;

    map[id] = model;
  },

  // Internal: Gets a model from the identity map.
  //
  // klass - The class of the model to get.
  // id    - The id of the model to get.
  //
  // Returns the model if it exists in the identity map or `null` if it does not.
  get:(klass, id)=>models[klass.__classId__] && models[klass.__classId__][id],

  // Internal: Returns all instances of the given model class presently in the
  // identity map.
  //
  // klass - The model class.
  //
  // Returns an array of model instances.
  all:klass=>Object.keys(models[klass.__classId__]),

  // Internal: Deletes the given model from the identity map.
  //
  // model - The model instance to delete.
  //
  // Returns `undefined`.
  delete(model){
    var map = models[model.constructor.__classId__];
    if(map) delete map[model.id];
  },

  // Internal: Resets the identity map by removing all model instances.
  reset(){
    models={};
  }
};
