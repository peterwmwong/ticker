import loadScript from './loadScript';
import loadHighlight from './loadHighlight';
import {EXT_TO_SYNTAX} from '../getSyntaxForFile';
import ALL_LANGUAGES from '../../../vendor/highlightjs/allLanguages.js';

const getSyntaxForLanguage = (lang)=> {
  const syntax = EXT_TO_SYNTAX[lang] || lang;
  return ALL_LANGUAGES[syntax] && syntax;
};

const load = ()=>
  loadScript('../vendor/marked/marked.min.js', 'marked').then((marked)=> {
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text)=>
      `<a href="${href}" title="${title}" target="_blank">${text}</a>`;

    marked.setOptions({
      renderer,
      highlight(code, lang, callback){
        const syntax = getSyntaxForLanguage(lang);
        if (!syntax) return callback(null, code);

        loadHighlight(syntax).then((hljs)=> {
          callback(null, hljs.highlight(syntax, code).value)
        });
      }
    });
    return marked;
  });

let loadingPromise;
export default ()=>
  loadingPromise || (loadingPromise = load());
