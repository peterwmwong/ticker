import xvdom from 'xvdom/src/index';

const ChunkedArrayRender = ({props: {render}, state}) =>
  <div>{state.map(render)}</div>;

const renderSome = (array, bindSend) => (
  window.setTimeout(bindSend('renderAll'), 100),
  array.slice(0, 3)
);

ChunkedArrayRender.state = {
  onInit: ({props: {array}, bindSend}) =>
    renderSome(array, bindSend),

  onProps: ({props: {array, arrayKey, render}, bindSend}, {arrayKey: prevArrayKey}) =>
    (arrayKey === prevArrayKey ? array : renderSome(array, bindSend)),

  renderAll: ({props: {array}}) => array
};

export default ChunkedArrayRender;
