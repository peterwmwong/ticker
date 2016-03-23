import loadScript from './loadScript';
import loadStyle  from './loadStyle';

const syntaxPromises = {};
let loadingPromise;

const loadSyntax = (lang)=>
  syntaxPromises[lang] = syntaxPromises[lang]
    || loadScript(`../vendor/highlightjs/languages/${lang}.min.js`)

const loadCore = ()=>
  loadingPromise = loadingPromise
    || Promise.all([
      loadScript('../vendor/highlightjs/highlight.min.js'),
      loadStyle('../vendor/highlightjs/styles/github.css')
    ]).then(()=> window.hljs)

export default (lang)=>
  loadCore().then((hljs)=>
    loadSyntax(lang).then(()=> hljs)
  )
