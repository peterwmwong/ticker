import Avatar from './common/Avatar.jsx';
import GithubIcon from './common/GithubIcon.jsx';

const createDeleteAction = event=>
  `${event.type === 'CreateEvent' ? 'created' : 'deleted'} a ${event.payload.ref_type}`;

const createDeleteIcon = event=> `git-branch`;

const createDeleteSubject = ({payload:{ref, ref_type}, repo})=>
  ref_type === 'branch' ? ref : repo.name;

const pushAction = event=>`pushed ${event.payload.commits.length} commits to`;

const pushSubject = event=> event.payload.ref.replace(/.*\//, '');

const issuePRIcon = event=>
  `${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;

const issuePRSubject = ({payload})=>
  payload.pull_request ? payload.pull_request.title : payload.issue.title;

const releaseSubject = ({payload:{release}})=> release.name || release.tag_name;

const issuePRSubjectUrl = ({repo, payload})=>
  `#github/${repo.displayName}/issues/${payload.number || (payload.issue ? payload.issue.number: payload.pull_request.number)}`;

const getSummary = event=>{
  switch(event.type){
  case 'IssuesEvent':
  case 'PullRequestEvent':
    return {
      actorsAction: `${event.payload.action} this issue`,
      subjectIcon: issuePRIcon(event),
      subject: issuePRSubject(event),
      subjectUrl: issuePRSubjectUrl(event)
    };

  case 'ReleaseEvent':
    return {
      actorsAction: 'published',
      subjectIcon: 'versions',
      subject: releaseSubject(event)
    };

  case 'CreateEvent':
  case 'DeleteEvent':
    return {
      actorsAction: createDeleteAction(event),
      subjectIcon: createDeleteIcon(event),
      subject: createDeleteSubject(event)
    };


  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
    return {
      actorsAction: 'commented...',
      subjectIcon: issuePRIcon(event),
      subject: issuePRSubject(event),
      subjectUrl: issuePRSubjectUrl(event)
    };

  case 'CommitCommentEvent':
    return {
      actorsAction: 'commented...',
      subjectIcon: 'git-commit',
      subject: event.payload.comment.commit_id
    };

  case 'PushEvent':
    return {
      actorsAction: pushAction(event),
      subjectIcon: 'git-branch',
      subject: pushSubject(event)
    };

  default: return {};
  }
};

export default ({event})=>{
  const {avatar_url, login} = event.actor;
  const {actorsAction, subject, subjectIcon, subjectUrl} = getSummary(event);
  return (
    <div className="Card-action ticker-event-summary">
      <a className="layout horizontal center l-padding-b4" href={subjectUrl}>
        <GithubIcon name={subjectIcon} className="l-padding-r2" />
        <div className="ticker-event-summary__subject">{subject}</div>
      </a>
      <a className="layout horizontal center l-padding-l4" href={`#github/${login}`}>
        <Avatar avatarUrl={avatar_url} className="l-margin-r2" />
        <span className="ticker-event-summary__actor">{login}</span>
        <span className="t-nowrap">{actorsAction}</span>
      </a>
    </div>
  );
}
