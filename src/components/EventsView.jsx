import GithubEvent from '../models/github/GithubEvent';
import EventCard   from './EventCard.jsx';
import Toolbar     from './Toolbar.jsx';

const EventsView = ({id, onRequestDrawer}, {events})=>
  <div>
    <Toolbar title={id} onRequestDrawer={onRequestDrawer}/>
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
  </div>;

const onInit = (props, state, {loadEvents})=>(
  GithubEvent.query(props).then(loadEvents),
  {events: GithubEvent.localQuery(props)}
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=>({events})
};

export default EventsView;
