import './Markup.css';
import xvdom      from 'xvdom';
import marked from '../../helpers/loaders/loadMarked';

const Markup = ({props:{className}, state:contentHTML})=>
  <div className={`Markup ${className}`} innerHTML={contentHTML} />;

const onInit = ({props: {content}, bindSend})=> marked(content, bindSend('loadMarkup'));

Markup.state = {
  onInit,
  onProps: onInit,
  loadMarkup: (component, contentHTML)=> contentHTML
};

export default Markup;
