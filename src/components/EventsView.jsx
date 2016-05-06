import xvdom       from 'xvdom';
import EventCard   from './EventCard.jsx';
import GithubEvent from '../models/github/GithubEvent';
import modelStateComponent  from '../helpers/modelStateComponent';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const filterEvents = (e)=> !EVENT_TYPES_TO_HIDE[e.type];

const INITIAL_RENDER_SIZE = 3;

const ChunkedArrayRender = ({renderItem}, {renderedItems})=>
  <div>
    {renderedItems}
  </div>;

const onInit = ({array, render}, state, {renderRest})=> {
  window.setTimeout(renderRest, 64);
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
      numRendered: length,
      renderedItems
    }
  }
}

const renderEvent = (event)=> <EventCard event={event} key={event.id} recycle />;

export default modelStateComponent(GithubEvent, 'query', (props, events)=>
  <ChunkedArrayRender
    array={(events || []).filter(filterEvents)}
    render={renderEvent}
  />
);
