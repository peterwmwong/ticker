import xvdom       from 'xvdom';
import EventCard   from './EventCard.jsx';
import GithubEvent from '../models/github/GithubEvent';
import modelStateComponent  from '../helpers/modelStateComponent';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const filterEvents = (e)=> !EVENT_TYPES_TO_HIDE[e.type];

export default modelStateComponent(GithubEvent, 'query', (props, events)=>
  <div>
    {(events || []).filter(filterEvents).map((event)=>
      <EventCard event={event} key={event.id} recycle />
    )}
  </div>
);
