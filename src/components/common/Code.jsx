import './Code.css';
import xvdom         from 'xvdom';
import loadHighlight from '../../helpers/loaders/loadHighlight';

const Code = ({code}, codeHTML)=>
  <pre
    className='Code'
    innerHTML={codeHTML}
    textContent={code}
  />;

Code.state = {
  onInit: ({syntax}, state, {highlight})=> {
    if(syntax) loadHighlight(syntax).then(highlight);
    return '';
  },
  highlight: ({syntax, code}, state, actions, hljs)=>
    hljs.highlight(syntax, code).value
};

export default Code;
