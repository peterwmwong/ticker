import './common/Card.css';
import './common/EventCard.css';
import xvdom        from 'xvdom';
import GithubIcon   from './common/GithubIcon.jsx';
import SourceName   from './SourceName.jsx';
import EventSummary from './EventSummary.jsx';
import Markup from './common/Markup.jsx';

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
        <GithubIcon className='l-padding-r2 icon-24' name='git-commit' />
        {message}
      </a>
    );
  }
}

export default ({event})=>
  <div className='Card EventCard'>
    <div className='Card-title'>
      <SourceName displayName={event.repo.name} />
    </div>
    <div className='Card-content'>
      <EventSummary event={event} />
      {renderEventAction(event)}
    </div>
  </div>;
