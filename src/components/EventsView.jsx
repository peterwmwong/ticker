import GithubEvent from '../models/github/GithubEvent';
import EventCard   from './EventCard.jsx';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const EventsView = (props, state)=>
  <div className="l-margin-t2">
    {state.events.map(event=>
      <EventCard key={event.id} event={event} recycle />
    )}
  </div>;

const onInit = (props, state, {loadEvents})=>(
  GithubEvent.query(props).then(loadEvents),
  {events: loadEvents(GithubEvent.localQuery(props)).events}
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=>({
    events: events.filter(e=>!EVENT_TYPES_TO_HIDE[e.type])
  })
};

export default EventsView;
