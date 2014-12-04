// This file bootstraps the Karma tests by...
//   - Loading all spec files
//   - Setting up Polymer by importing `polymer.html` and all elements from `build/elements/`
//   - Starts the Karma tests once both specs are loaded and Polymer is setup
(function(){

// make it async
window.__karma__.loaded = function() {};

// Add all spec js files
var allTestFiles =
  Object.keys(window.__karma__.files)
    .filter(function(file){return /spec_build\/.*(spec|test)\.js$/i.test(file);})
    .map(function(file){return file.replace(/^\//, '').replace(/\.js$/, '');});

// TODO(pwong): I wonder if we could refactor these out somehow...
System.paths['elements/*'] = '/base/build/elements/*.js';
System.paths['models/*'] = '/base/build/models/*.js';
System.paths['data/*'] = '/base/build/data/*.js';
System.paths['filters/*'] = '/base/build/filters/*.js';
System.paths['helpers/*'] = '/base/build/helpers/*.js';
System.paths['states/*'] = '/base/build/states/*.js';

Promise.all(
  // Import all specs
  allTestFiles
    .map(function(file){return System.import(file)})
    // Wait for all web components to be loaded
    .concat(new Promise(function(resolve){
      window.addEventListener('polymer-ready',resolve);
    }))
).then(platformFlush)
 .then(window.__karma__.start);

// Auto-reruns specs with LiveReload
if (/debug.html$/.test(window.location.pathname))
  document.write("<script src='http://" + (location.host || 'localhost').split(':')[0] + ":35729/livereload.js?snipver=1'></" + "script>");

})();
