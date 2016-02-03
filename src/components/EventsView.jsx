import xvdom       from 'xvdom';
import EventCard   from './EventCard.jsx';
import GithubEvent from '../models/github/GithubEvent';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const EventsView = (props, events)=>
  <div className="l-margin-t2">
    {events.map(event=>
      <EventCard key={event.id} event={event} recycle />
    )}
  </div>;

const onInit = (props, state, {loadEvents})=>(
  GithubEvent.query(props).then(loadEvents),
  loadEvents(GithubEvent.localQuery(props))
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=>
    events.filter(e=>!EVENT_TYPES_TO_HIDE[e.type])
};

export default EventsView;
