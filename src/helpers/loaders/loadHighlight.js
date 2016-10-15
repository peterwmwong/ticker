import '../../../vendor/highlightjs/styles/github.css';
import loadScript from './loadScript';

const syntaxPromises = {};

const loadSyntax = lang =>
  syntaxPromises[lang] || (
    syntaxPromises[lang] =
      loadScript(`../vendor/highlightjs/languages/${lang}.min.js`)
  )

export default lang => loadSyntax(lang).then(() => window.hljs)
