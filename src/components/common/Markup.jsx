import './Markup.css';
import xvdom      from 'xvdom';
import loadMarked from '../../helpers/loaders/loadMarked';

const Markup = (props, contentHTML)=>
  <div className="Markup" innerHTML={contentHTML} />;

const onInit = (props, state, {markup})=>(
  loadMarked().then(markup),
  ''
);

Markup.state = {
  onInit,
  onProps: onInit,
  markup: ({content}, state, actions, marked)=>marked(content)
};

export default Markup;
