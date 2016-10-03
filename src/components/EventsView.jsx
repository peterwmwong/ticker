import xvdom               from 'xvdom/src/index';
import EventCard           from './EventCard.jsx';
import ChunkedArrayRender  from './common/ChunkedArrayRender.jsx';
import GithubEvent         from '../models/github/GithubEvent';
import modelStateComponent from '../helpers/modelStateComponent';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const filterEvents = ({type})=> !EVENT_TYPES_TO_HIDE[type];

const renderEvent = (event)=> <EventCard event={event} key={event.id} recycle />;

export default modelStateComponent(GithubEvent, 'query', ({props:{id}, state})=>
  <ChunkedArrayRender
    array={(state || []).filter(filterEvents)}
    arrayKey={id}
    render={renderEvent}
  />
);
