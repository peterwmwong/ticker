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

EventsView.state = {
  onInit: ({type, id}, state, {loadEvents})=>{
    const queryParams = {type, id};
    GithubEvent.query(queryParams).then(loadEvents);
    debugger; //eslint-disable-line
    return {events: GithubEvent.localQuery(queryParams)};
  },
  onProps: (props, state, {onInit})=>onInit(),
  loadEvents: (props, state, actions, events)=>({events})
};

export default EventsView;
