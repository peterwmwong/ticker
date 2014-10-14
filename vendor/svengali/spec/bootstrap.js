// This file bootstraps the Karma tests by...
//   - Loading all spec files
//   - Starts the Karma tests once both specs are loaded
(function(){

// this needs to be added to apply the extension
register(System);

// Make karma wait
window.__karma__.loaded = function(){};

// Wait for all spec modules to be imported, then start test run
Promise.all(
  Object.keys(window.__karma__.files).reduce(function(imports, file){
    // Isolate spec modules
    if (/spec_build\/.*(spec|test)\.js$/i.test(file)){
      // Normalize paths to module and import
      imports.push(System.import(/^\/(.*)\.js$/.exec(file)[1]));
    }
    return imports;
  },[])
).then(window.__karma__.start);

// Auto-reruns specs with LiveReload
if (/debug.html$/.test(window.location.pathname))
  document.write("<script src='http://" + (location.host || 'localhost').split(':')[0] + ":35729/livereload.js?snipver=1'></" + "script>");

})();
