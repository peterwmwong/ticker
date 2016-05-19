import xvdom from 'xvdom';

const INITIAL_RENDER_SIZE = 3;

const ChunkedArrayRender = ({state: {renderedItems}})=>
  <div>
    {renderedItems}
  </div>;

const renderRest = (render, array, state)=> {
  const prevArray = state && state.prevArray;
  let renderedItems, length;

  if(prevArray === array){
    length = array.length;
    renderedItems = [].concat(state.renderedItems);
  }
  else {
    length = Math.min(array.length, INITIAL_RENDER_SIZE);
    renderedItems = [];
  }

  let i = renderedItems.length;
  while(i < length){
    renderedItems.push(
      render(array[i++])
    );
  }

  return {
    prevArray: array,
    renderedItems
  }
};

const onInit = ({props: {array, render}, state, bindSend})=> {
  window.setTimeout(bindSend('renderRest'), 100);
  return renderRest(render, array, state);
};

ChunkedArrayRender.state = {
  onInit,
  onProps: onInit,
  renderRest: ({props:{render, array}, state})=> renderRest(render, array, state)

};

export default ChunkedArrayRender;
