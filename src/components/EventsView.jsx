import xvdom       from 'xvdom';
import EventCard   from './EventCard.jsx';
import GithubEvent from '../models/github/GithubEvent';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const filterEvents = (e)=> !EVENT_TYPES_TO_HIDE[e.type];

const EventsView = (props, events)=>
  <div>
    {events.map((event)=>
      <EventCard event={event} key={event.id} recycle />
    )}
  </div>;

const onInit = (props, state, {loadEvents})=> (
  GithubEvent.query(props).then(loadEvents),
  loadEvents(GithubEvent.localQuery(props) || [])
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=> events.filter(filterEvents)
};

export default EventsView;
