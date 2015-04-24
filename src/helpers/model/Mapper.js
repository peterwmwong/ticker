// Public: `Mapper` is the default `Model`
// [data mapper](http://martinfowler.com/eaaCatalog/dataMapper.html) object, its
// methods are invoked by `Model` objects when data needs to be moved between the
// model objects and some database.
//
// The implementation of the default mapper does nothing and should not be used
// in production code. It exists here mainly for documenting the methods you'll
// need to implement on your own custom mapper objects.
//
// You can set up a single mapper object for your model layer by assigning it to
// the `Model.mapper` property. You can also specify mappers on a per-class basis
// by assigning a mapper object to the `mapper` property of a `Model` subclass.
export default {
  // Public: Invoked by the model layer to load a collection of model objects
  // from the database. When the collection has been retrieved, it should be
  // loaded into the model layer using `Model.load` or `Model.loadAll` and the
  // resulting model instances should be spliced into the given array using the
  // array's `$replace` method. Finally, the given `deferred` object should be
  // either resolved with the given `array` or rejected with an appropriate error
  // message in order to notify the model layer that the mapper is finished doing
  // its work.
  //
  // array    - An empty array that should be populated once the records have
  //            been retrieved and loaded into the model layer. This array has an
  //            additional property added to it called `$class` that is set to
  //            the `Model` subclass that `query` was invoked on.
  // ...args  - Zero or more additional arguments passed down by the model layer.
  //
  // Returns deferred - A deferred object created with `$q.defer()`. This method
  //            must either resolve or reject this object once it has finished
  //            performing the query.
  query(array, ...args){},

  // Public: Invoked by the model layer in order to load a single record from the
  // database based on an id. It is passed a `deferred` object and a `Model`
  // instance with its `id` property set.  When the record has been retrieved it
  // should be loaded using `Model.load` and the `deferred` object should be
  // resolved with the model instance. If the get fails, the `deferred` object
  // should be rejected with an appropriate error message.
  //
  // model    - A `Model` instance with its `id` property set to the id of the
  //            record to get.
  // ...args  - Zero or more additional arguments passed down by the model layer.
  //
  // Returns deferred - A deferred object created with `$q.defer()`. This method
  //            must either resolve or reject this object once it has finished
  //            getting the record.
  get(model, ...args){},

  // Public: Invoked by the model layer in order to create a new record in the
  // database. It is passed a `deferred` object and a `Model` instance containing
  // the attributes to save. When the record has been successfully saved this
  // method should resolve the given `deferred` object with the model instance.
  // If the create fails, the `deferred` object should be rejected with an
  // appropriate error message.
  //
  // model    - A `Model` instance containing the attributes to save to the
  //            database.
  // ...args  - Zero or more additional arguments passed down by the model layer.
  //
  // Returns deferred - A deferred object created with `$q.defer()`. This method
  //            must either resolve or reject this object once it has finished
  //            creating the record.
  create(model, ...args){},

  // Public: Invoked by the model layer in order to update an existing record in
  // the database. It is passed a `deferred` object and a `Model` instance
  // containing the attributes to update. The raw attributes can be accessed from
  // the model object with the `$attrs` method. When the record has been
  // successfully updated this method should resolve the given `deferred` object
  // with the model instance. If the update fails, the `deferred` object should
  // be rejected with an appropriate error message.
  //
  // model    - A `Model` instance containing the attributes to save to the
  //            database.
  // ...args  - Zero or more additional arguments passed down by the model layer.
  //
  // Returns deferred - A deferred object created with `$q.defer()`. This method
  //            must either resolve or reject this object once it has finished
  //            updating the record.
  update(model, ...args){},

  // Public: Invoked by the model layer in order to delete an existing record
  // from the database. Its passed a `deferred` object and a `Model` instance
  // with the `id` of the record to delete. When the record has been successfully
  // deleted this method should resolve the given `deferred` object with the
  // model instance. If the delete fails, the `deferred` object should be
  // rejected with an appropriate error message.
  //
  // model    - A `Model` instance representing the record to delete.
  // ...args  - Zero or more additional arguments passed down by the model layer.
  //
  // Returns deferred - A deferred object created with `$q.defer()`. This method
  //            must either resolve or reject this object once it has finished
  //            deleting the record.
  delete(model, ...args){}
};
