/*

Abstract base class for all data sources.

Here's an example of implementing a new data source:

```js
class MySource extends Source {
  // Constructor for recreating the Source from JSON (returned from `toJSON()`)
  constructor(jsonObj){...}

  // Returns a JSON object to be persisted
  toJSON(){...}

  // Name to be used for display
  get name(){...}

  // Retrieves all sources that matches the `term`.
  // This method is called when a user searches for a source by string.
  //
  // Returns a promise the resolves to all sources matching the `term`
  static query({term}){...}
}

Source.registerSource(MySource);
```

*/

const SOURCE_CLASSES = {};

export default class {
  static load({type, config}){return new SOURCE_CLASSES[type](config)}

  static query({term}){
    return Promise.all(
      Object.keys(SOURCE_CLASSES).map(key=>SOURCE_CLASSES[key].query({term}))
    ).then(allSources=>[].concat(...allSources));
  }

  static registerSource(SourceClass){
    SOURCE_CLASSES[SourceClass.name] = SourceClass;
  }

  toSourceJSON(){
    return {
      type:this.constructor.name,
      config:this.toJSON()
    }
  }

  get name(){throw 'Subclasses should implement `get name()`'}
  toJSON(){throw 'Subclasses should implement `toJSON()`'}
}
