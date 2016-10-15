import xvdom               from 'xvdom/src/index';
import EventCard           from './EventCard.jsx';
import ChunkedArrayRender  from './common/ChunkedArrayRender.jsx';
import GithubEvent         from '../models/github/GithubEvent';
import modelStateComponent from '../helpers/modelStateComponent';

const filterEvents = ({type:t}) => t !== 'WatchEvent' && t !== 'GollumEvent';

const renderEvent = event => <EventCard event={event} key={event.id} recycle />;

export default modelStateComponent(GithubEvent, 'query', ({props:{id}, state}) =>
  <ChunkedArrayRender
    array={(state || []).filter(filterEvents)}
    arrayKey={id}
    render={renderEvent}
  />
);
