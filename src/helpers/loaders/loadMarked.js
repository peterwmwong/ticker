import loadHighlight from './loadHighlight';
import {EXT_TO_SYNTAX} from '../getSyntaxForFile';
import ALL_LANGUAGES from '../../../vendor/highlightjs/allLanguages.js';

const getSyntaxForLanguage = (lang)=> {
  const syntax = EXT_TO_SYNTAX[lang] || lang;
  return ALL_LANGUAGES[syntax] && syntax;
};

const renderer = new window.marked.Renderer();
renderer.link = (href, title, text)=>
  `<a href="${href}" title="${title}" target="_blank">${text}</a>`;

window.marked.setOptions({
  renderer,
  highlight(code, lang, callback){
    const syntax = getSyntaxForLanguage(lang);
    if (!syntax) return callback(null, code);

    loadHighlight(syntax).then((hljs)=> {
      callback(null, hljs.highlight(syntax, code).value)
    });
  }
});

export default (content, cb)=> {
  let result = null;
  if(content){
    window.marked(content, (err, r)=> {
      if (result === null){
        result = r;
      }
      else {
        cb(r);
      }
    });
  }
  result = result || '';
  return result;
}
