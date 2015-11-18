import GithubIcon   from './common/GithubIcon.jsx';
import SourceName   from './SourceName.jsx';
import EventSummary from './EventSummary.jsx';
import timeAgo      from '../helpers/timeAgo';

const renderEventAction = event=>{
  switch(event.type){
  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
  case 'CommitCommentEvent':
    return (
      <div className="ticker-event__action">
        {event.payload.comment.body}
      </div>
    );

  case 'PushEvent':
    return event.payload.commits.map(commit=>
      <div key={commit.sha} className="ticker-event__action layout horizontal center">
        <GithubIcon name="git-commit" className="l-padding-r2 icon-24" />
        <span className="flex">{commit.message}</span>
      </div>
    );
  }
}

export default ({event})=>
  <div className="Card App__placeholderCard">
    <div className="Card-title">
      <SourceName className="flex" displayName={event.repo.name} />
      <span className='c-gray-dark t-font-size-11'>
        {timeAgo(Date.parse(event.created_at))}
      </span>
    </div>
    <EventSummary event={event} />
    {renderEventAction(event)}
  </div>;
