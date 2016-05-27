import xvdom from 'xvdom';

const INITIAL_RENDER_SIZE = 3;

const ChunkedArrayRender = ({props: {render}, state})=>
  <div>{state.map(render)}</div>;

const renderSome = (array, bindSend)=> (
  window.setTimeout(bindSend('renderAll'), 100),
  array.slice(0, Math.min(array.length, INITIAL_RENDER_SIZE))
);

ChunkedArrayRender.state = {
  onInit: ({props: {array}, bindSend})=>
    renderSome(array, bindSend),

  onProps: ({props: {array, arrayKey, render}, bindSend}, {arrayKey: prevArrayKey})=>
    (arrayKey === prevArrayKey ? array : renderSome(array, bindSend)),

  renderAll: ({props: {array}})=> array
};

export default ChunkedArrayRender;
