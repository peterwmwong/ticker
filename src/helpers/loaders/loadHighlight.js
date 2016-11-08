import '../../../vendor/highlightjs/styles/github.css';
import loadScript from './loadScript';

const syntaxPromises = {};

const loadSyntax = lang =>
  syntaxPromises[lang] || (
    syntaxPromises[lang] =
      loadScript(`../vendor/highlightjs/languages/${lang}.min.js`)
  )

let loadHighlightJSPromise;
const loadHighlightJS = () =>
  loadHighlightJSPromise ||
    (loadHighlightJSPromise = loadScript('../vendor/highlightjs/highlight.min.js'))

export default lang =>
  loadHighlightJS()
    .then(() => loadSyntax(lang))
    .then(() => window.hljs)
