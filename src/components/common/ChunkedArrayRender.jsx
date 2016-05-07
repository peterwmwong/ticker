import xvdom from 'xvdom';

const INITIAL_RENDER_SIZE = 3;

const ChunkedArrayRender = (props, {renderedItems})=>
  <div>
    {renderedItems}
  </div>;

const onInit = ({array, render}, state, {renderRest})=> {
  window.setTimeout(renderRest, 100);
  return renderRest();
};

ChunkedArrayRender.state = {
  onInit,
  onProps: onInit,
  renderRest: ({render, array}, state)=> {
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
  }
};

export default ChunkedArrayRender;
