import './IssueView.css';
import GithubIssue        from '../models/github/GithubIssue';
import GithubIssueComment from '../models/github/GithubIssueComment';
import timeAgo            from '../helpers/timeAgo';
import Avatar             from './common/Avatar.jsx';
import SourceName         from './SourceName.jsx';
import Toolbar            from './Toolbar.jsx';

const CommentCard = ({comment})=>
  <div className="Card App__placeholderCard">
    <div className="Card-action ticker-event-summary">
      <a className="layout horizontal center" href={`#github/${comment.user.login}`}>
        <Avatar avatarUrl={comment.user.avatar_url} className="l-margin-r2" />
        <span className="ticker-event-summary__actor">{comment.user.login}</span>
      </a>
    </div>
    <div className="ticker-event__action">
      <div className="ticker-event__action__text">
        {comment.body}
      </div>
    </div>
  </div>;

const ISSUE_PLACEHOLDER_OBJ = {
  user: {login:'', avatar_url:''},
  created_at: Date.now(),
  body: ''
};

const IssueView = (
  {repo, issueId, onRequestDrawer, onRequestSearch},
  {issue, issueComments},
  {actions}
)=>
  // TODO: Figure out a way to not set the scrollTop on initial render
  <div className="fit scroll">
    <div className="App__content c-bg-white l-padding-h4 l-padding-b6">
      <div className="IssueView-main l-padding-t6">
        <SourceName displayName={repo} />
        <h2 className="l-margin-t0 l-margin-b4">
          #{issueId}: {issue.title}
        </h2>
        <div className="layout horizontal center l-padding-b2">
          <Avatar avatarUrl={issue.user.avatar_url} className="l-margin-r2" />
          <div>
            <div className="t-normal">
              {issue.user.login}
            </div>
            <div className="c-gray-dark t-font-size-11">
              {timeAgo(issue.created_at)}
            </div>
          </div>
        </div>
        {issue.body}
      </div>
    </div>
    {issueComments.map(comment=>
      <CommentCard key={comment.id} comment={comment} />
    )}
    <Toolbar
      className="fixed fixed--top"
      title={`#${issueId}: ${issue.title}`}
      onRequestDrawer={onRequestDrawer}
      onRequestSearch={onRequestSearch}
    />
  </div>;


IssueView.state = {
  onInit: ({repo, issueId}, state, {loadIssue, loadIssueComments})=>{
    GithubIssue.get(`${repo}/${issueId}`).then(loadIssue);
    GithubIssueComment.query({issueId:`${repo}/${issueId}`})
      .then(loadIssueComments);
    return {
      issue: (GithubIssue.localGet(`${repo}/${issueId}`) || ISSUE_PLACEHOLDER_OBJ),
      issueComments: GithubIssueComment.localQuery({issueId:`${repo}/${issueId}`})
    };
  },
  onProps: (props, state, actions)=>actions.onInit(),
  loadIssue: (props, state, actions, issue)=>({...state, issue}),
  loadIssueComments: (props, state, actions, issueComments)=>({...state, issueComments})
};

export default IssueView;