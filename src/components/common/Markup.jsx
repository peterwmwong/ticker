import './Markup.css';
import xvdom      from 'xvdom/src/index';
import marked from '../../helpers/loaders/loadMarked';

const Markup = ({props: {className}, state}) =>
  <div className={`Markup ${className}`} innerHTML={state} />;

const onInit = ({props: {content}, bindSend}) =>
  content ? marked(content, bindSend('loadMarkup')) : '';

Markup.state = {
  onInit,
  onProps: onInit,
  loadMarkup: (component, contentHTML) => contentHTML
};

export default Markup;
