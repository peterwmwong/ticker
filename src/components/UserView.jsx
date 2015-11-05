import GithubEvent from '../models/github/GithubEvent';
import EventCard from './EventCard.jsx';

const UserView = ({user}, {events})=>
  <div className="l-margin-t2">
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
  </div>;

const loadEvents = (props, state, dispatch, events)=>({events});

UserView.getInitialState = UserView.onProps = ({user}, state, dispatch)=>{
  const queryParams = {type:'users', id:user};
  GithubEvent.query(queryParams).then(events=>dispatch(loadEvents, events));
  return {events: GithubEvent.localQuery(queryParams)};
};

export default UserView;
