import loadScript from './loadScript';

let loadingPromise;

export default ()=>
  loadingPromise = loadingPromise
    || loadScript('../vendor/marked/marked.min.js')
        .then(()=> window.marked);
