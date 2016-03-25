import './Markup.css';
import xvdom      from 'xvdom';
import loadMarked from '../../helpers/loaders/loadMarked';

const Markup = ({className}, contentHTML)=>
  <div className={`Markup ${className}`} innerHTML={contentHTML} />;

const onInit = ({content}, state, {loadMarkup})=> {
  if (content){
    loadMarked().then((marked)=> marked(content, loadMarkup));
  }
  return '';
};

Markup.state = {
  onInit,
  onProps: onInit,
  loadMarkup: (props, state, actions, err, contentHTML)=> contentHTML
};

export default Markup;
