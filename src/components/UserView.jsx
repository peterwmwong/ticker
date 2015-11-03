import GithubEvent from '../models/github/GithubEvent';
import EventCard from './EventCard.jsx';

const UserView = ({user}, {events})=>
  <div className="l-margin-t2">
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
  </div>;

UserView.state = {
  onInit: ({user}, state, {loadEvents})=>{
    const queryParams = {type:'users', id:user};
    GithubEvent.query(queryParams).then(loadEvents);
    return {events: GithubEvent.localQuery(queryParams)};
  },
  onProps: (props, state, {onInit})=>onInit(),
  loadEvents: (props, state, actions, events)=>({events})
};

export default UserView;
