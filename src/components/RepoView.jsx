import GithubEvent from '../models/github/GithubEvent';
import EventCard from './EventCard.jsx';

const RepoView = ({user}, {events})=>
  <div className="l-margin-t2">
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
  </div>;

RepoView.state = {
  onInit: ({repo}, state, {loadEvents})=>{
    const queryParams = {type:'repos', id:repo};
    GithubEvent.query(queryParams).then(loadEvents);
    return {events: GithubEvent.localQuery(queryParams)};
  },
  onProps: (props, state, {onInit})=>onInit(),
  loadEvents: (props, state, actions, events)=>({events})
};

export default RepoView;
