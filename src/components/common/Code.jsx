import './Code.css';
import xvdom         from 'xvdom';
import loadHighlight from '../../helpers/loaders/loadHighlight';

const Code = ({props: {code}, state})=>
  <pre className='Code' innerHTML={state} textContent={code || ''} />;

Code.state = {
  onInit: ({props: {code, syntax}, bindSend})=> {
    if(code && syntax) loadHighlight(syntax).then(bindSend('highlight'));
    return '';
  },
  highlight: ({props: {syntax, code}}, hljs)=>
    hljs.highlight(syntax, code).value
};

export default Code;
