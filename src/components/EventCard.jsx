import SourceName   from './SourceName.jsx';
import EventSummary from './EventSummary.jsx';

const renderEventAction = event=>{
  switch(event.type){
  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
  case 'CommitCommentEvent':
    return (
      <div className="ticker-event__action">
        <span className="ticker-event__action__text">{event.payload.comment.body}</span>
      </div>
    );

  case 'PushEvent':
    return event.payload.commits.map(commit=>
      <div key={commit.sha} className="ticker-event__action">
        <span className="ticker-event__action__text">{commit.message}</span>
      </div>
    );
  }
}

export default ({event})=>
  <div className="Card App__placeholderCard">
    <div className="Card-title">
      <SourceName className="flex" displayName={event.repo.displayName} />
      <span className='c-gray-dark t-font-size-11'>{event.timeAgo}</span>
    </div>
    <EventSummary event={event}/>
    {renderEventAction(event)}
  </div>;
