import './common/Card.css';
import './EventCard.css';
import xvdom        from 'xvdom/src/index';
import Icon         from './common/Icon.jsx';
import SourceName   from './SourceName.jsx';
import EventSummary from './EventSummary.jsx';
import Markup       from './common/Markup.jsx';

const renderEventAction = (event)=> {
  switch(event.type){
  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
  case 'CommitCommentEvent':
    return (
      <Markup
        className='l-padding-l4 l-padding-t4'
        content={event.payload.comment.body}
      />
    );

  case 'PushEvent':
    return event.payload.commits.map(({sha, message})=>
      <a
        className='layout horizontal center l-padding-l4 l-padding-t4'
        href={`#github/${event.repo.name}?commits/${sha}`}
        key={sha}
      >
        <Icon className='l-padding-r2 icon-24' name='git-commit' />
        {message}
      </a>
    );
  }
}

export default ({event})=>
  <div className='Card EventCard'>
    <SourceName className='Card-title' displayName={event.repo.name} />
    <div className='Card-content'>
      <EventSummary event={event} />
      {renderEventAction(event)}
    </div>
  </div>;
