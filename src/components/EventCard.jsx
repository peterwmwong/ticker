import './common/Card.css';
import './EventCard.css';
import xvdom        from 'xvdom/src/index';
import Icon         from './common/Icon.jsx';
import SourceName   from './SourceName.jsx';
import Markup       from './common/Markup.jsx';
import Actor        from './common/Actor.jsx';

const issuePRIcon = ({pull_request}) =>
  `${pull_request ? 'git-pull-request' : 'issue-opened'}`;

const issuePRSubject = ({pull_request, issue}) =>
  (pull_request || issue).title;

const issuePRSubjectUrl = ({repo:{name}, payload:{number, issue, pull_request}}) =>
  issue
    ? `#github/${name}?issues/${number || issue.number}`
    : `#github/${name}?pulls/${number || pull_request.number}`;

const getSummary = event => {
  const {payload} = event;
  switch(event.type){
  case 'IssuesEvent':
  case 'PullRequestEvent':
    return {
      actorsAction: `${payload.action} this issue.`,
      subjectIcon: issuePRIcon(payload),
      subject: issuePRSubject(payload),
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
      subjectIcon: issuePRIcon(payload),
      subject: issuePRSubject(payload),
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
      actorsAction: `pushed ${payload.commits.length} commits…`,
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

const renderEventAction = event => {
  switch(event.type){
  case 'IssueCommentEvent':
  case 'PullRequestReviewCommentEvent':
  case 'CommitCommentEvent':
    return (
      <Markup
        className='Card-content'
        content={event.payload.comment.body}
      />
    );

  case 'PushEvent':
    return event.payload.commits.map(({sha, message}) =>
      <a
        className='Card-content layout horizontal center'
        href={`#github/${event.repo.name}?commits/${sha}`}
        key={sha}
      >
        <Icon className='l-padding-r2 icon-24' name='git-commit' />
        {message}
      </a>
    );
  }
};

export default ({event}) => {
  const {actorsAction, subject, subjectIcon, subjectUrl} = getSummary(event);
  return (
    <div className='Card EventCard'>
      <SourceName className='Card-title' displayName={event.repo.name} />
      {subject &&
        <a className='Card-content layout horizontal center' href={subjectUrl}>
          <Icon name={subjectIcon} />
          <div className='flex l-padding-l2 t-truncate t-normal' textContent={subject} />
        </a>
      }
      <Actor
        action={actorsAction}
        actionDate={event.created_at}
        className='Card-content'
        user={event.actor}
      />
      {renderEventAction(event)}
    </div>
  );
};
