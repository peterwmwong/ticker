import GithubEvent from '../models/github/GithubEvent';
import EventCard from './EventCard.jsx';

const RepoView = ({user}, {events})=>
  <div className="l-margin-t2">
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
  </div>;

const loadEvents = (props, state, dispatch, events)=>({events});

RepoView.getInitialState = RepoView.onProps = ({repo}, state, dispatch)=>{
  const queryParams = {type:'repos', id:repo};
  GithubEvent.query(queryParams).then(events=>dispatch(loadEvents, events));
  return {events: GithubEvent.localQuery(queryParams)};
};

export default RepoView;
