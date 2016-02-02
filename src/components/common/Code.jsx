import './Code.css';
import xvdom         from 'xvdom';
import loadHighlight from '../../helpers/loaders/loadHighlight';

const INITIAL_STATE = {};

const Code = ({code}, {codeHTML})=>
  <pre
    className="Code"
    innerHTML={codeHTML}
    textContent={code}
  />;

Code.state = {
  onInit: (props, state, {highlight})=>(
    loadHighlight().then(highlight),
    INITIAL_STATE
  ),
  highlight: ({code}, state, actions, hljs)=>({
    codeHTML: hljs.highlight('diff', code).value
  })
};

export default Code;
