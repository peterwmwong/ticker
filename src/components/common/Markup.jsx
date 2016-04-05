import './Markup.css';
import xvdom      from 'xvdom';
import marked from '../../helpers/loaders/loadMarked';

const Markup = ({className}, contentHTML)=>
  <div className={`Markup ${className}`} innerHTML={contentHTML} />;

const onInit = ({content}, state, {loadMarkup})=> marked(content, loadMarkup);

Markup.state = {
  onInit,
  onProps: onInit,
  loadMarkup: (props, state, actions, contentHTML)=> contentHTML
};

export default Markup;
