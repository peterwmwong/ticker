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
      <div className="ticker-event__action" textContent={event.payload.comment.body} />
    );

  case 'PushEvent':
    return event.payload.commits.map(commit=>
      <a
        key={commit.sha}
        className="ticker-event__action layout horizontal center"
        href={`#github/${event.repo.name}/commits/${commit.sha}`}
      >
        <GithubIcon name="git-commit" className="l-padding-r2 icon-24" />
        <span className="flex" textContent={commit.message} />
      </a>
    );
  }
}

export default ({event})=>
  <div className="Card">
    <div className="Card-title">
      <SourceName className="flex" displayName={event.repo.name} />
      <span className="c-gray-dark t-font-size-11" textContent={timeAgo(Date.parse(event.created_at))} />
    </div>
    <EventSummary event={event} />
    {renderEventAction(event)}
  </div>;
