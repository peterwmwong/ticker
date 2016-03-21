import xvdom      from 'xvdom';
import Actor      from './common/Actor.jsx';
import GithubIcon from './common/GithubIcon.jsx';

const issuePRIcon = (event)=>
  `${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;

const issuePRSubject = ({payload})=>
  payload.pull_request ? payload.pull_request.title : payload.issue.title;

const issuePRSubjectUrl = ({repo, payload})=>
  `#github/${repo.name}?issues/${payload.number || (payload.issue ? payload.issue.number: payload.pull_request.number)}`;

const getSummary = (event)=> {
  const payload = event.payload;
  switch(event.type){
  case 'IssuesEvent':
  case 'PullRequestEvent':
    return {
      actorsAction: `${event.payload.action} this issue.`,
      subjectIcon: issuePRIcon(event),
      subject: issuePRSubject(event),
      subjectUrl: issuePRSubjectUrl(event)
    };

  case 'ReleaseEvent':
    return {
      actorsAction: 'published this release.',
      subjectIcon: 'versions',
      subject: payload.release.name || payload.release.tag_name
    };

  case 'CreateEvent':
  case 'DeleteEvent':
    return {
      actorsAction: `${event.type === 'CreateEvent' ? 'created' : 'deleted'} this ${payload.ref_type}.`,
      subjectIcon: 'git-branch',
      subject: payload.ref_type === 'branch' ? payload.ref : event.repo.name
    };

  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
    return {
      actorsAction: 'commented…',
      subjectIcon: issuePRIcon(event),
      subject: issuePRSubject(event),
      subjectUrl: issuePRSubjectUrl(event)
    };

  case 'CommitCommentEvent':
    return {
      actorsAction: 'commented…',
      subjectIcon: 'git-commit',
      subject: payload.comment.commit_id,
      subjectUrl: `#github/${event.repo.name}?commits/${payload.comment.commit_id}`
    };

  case 'PushEvent':
    return {
      actorsAction: `pushed ${payload.commits.length} commits...`,
      subjectIcon: 'git-branch',
      subject: payload.ref.replace(/.*\//, '')
    };

  case 'TeamAddEvent':
    return {
      actorsAction: `added the ${payload.team.name} team.`,
      subjectIcon: 'git-branch'
    };

  case 'ForkEvent':
    return { actorsAction: 'forked this repository.' };

  default: return {};
  }
};

export default ({event})=> {
  const {actorsAction, subject, subjectIcon, subjectUrl} = getSummary(event);
  return (
    <div>
      {subject &&
        <a className='layout horizontal center l-padding-b4' href={subjectUrl}>
          <GithubIcon name={subjectIcon} />
          <div className='flex l-padding-l2 t-truncate t-normal' textContent={subject} />
        </a>
      }
      <Actor
        action={actorsAction}
        actionDate={event.created_at}
        className='l-padding-l4'
        user={event.actor}
      />
    </div>
  );
}
