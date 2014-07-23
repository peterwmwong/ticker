//
// `importModule(moduleId, modulesToMock)`
//
// Import a module with specified dependencies replaced with mocks.
//
// Params
// ------
//
// moduleId:string      - Module id to import
// modulesToMock:object - Map of module id's to mock module definitions.
//
// Returns
// -------
//
// A `Promise` that resolves to the imported module.
//
// Examples
// --------
//
//   await importModule('mymodule', {'myDendencyModule':jasmine.createSpy()});
//   > MyModule
//

export default function importModule(moduleid,mocks = {}){
  // TODO(pwong): handle multiple importModule calls?
  // if(window.System !== origSystem){/* reuse loader, don't clone System again */}

  // Create an ES6 Custom Loader
  var loader = new Reflect.Loader(System);
  loader.paths = System.paths;

  // Load the mock modules into the custom loader
  for (var mockid in mocks) {
    // TODO(pwong): Shouldn't be necessary, maybe a bug in SystemJS AMD format...
    var mock = Object.create(mocks[mockid]);
    mock.__esModule = true;

    loader.set(mockid, new Module(mock));
  }

  window.System = loader;
  return loader.import(moduleid);
};

var origSystem = window.System;
afterEach(function(){
  window.System = origSystem;
});
