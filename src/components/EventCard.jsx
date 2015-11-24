import './common/Card.css';
import GithubIcon   from './common/GithubIcon.jsx';
import SourceName   from './SourceName.jsx';
import EventSummary from './EventSummary.jsx';

const renderEventAction = event=>{
  switch(event.type){
  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
  case 'CommitCommentEvent':
    return (
      <div className="l-padding-l4 l-padding-t4" textContent={event.payload.comment.body} />
    );

  case 'PushEvent':
    return event.payload.commits.map(commit=>
      <a
        key={commit.sha}
        className="layout horizontal center l-padding-l4 l-padding-t4"
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
      <SourceName displayName={event.repo.name} />
    </div>
    <div className="Card-content">
      <EventSummary event={event} />
      {renderEventAction(event)}
    </div>
  </div>;
