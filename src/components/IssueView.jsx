import './common/Card.css';
import GithubIssue        from '../models/github/GithubIssue';
import GithubIssueComment from '../models/github/GithubIssueComment';
import Actor              from './common/Actor.jsx';
import SourceName         from './SourceName.jsx';
import Toolbar            from './Toolbar.jsx';

const ISSUE_PLACEHOLDER_OBJ = {
  user: {login:'', avatar_url:''},
  created_at: 0,
  title: '',
  body: ''
};

const renderCommentCard = ({id, user, body, created_at})=>
  <div id={id} className="Card">
    <Actor actionDate={created_at} className="Card-content" user={user} />
    <div className="Card-content t-word-wrap-break-word" textContent={body} />
  </div>;

const IssueView = (
  {repo, issueId, onRequestDrawer, onRequestSearch},
  {issue, issueComments},
  {actions}
)=>
  <div>
    <div className="App__content Card Card--fullBleed">
      <div className="Card-title">
        <SourceName displayName={repo} />
        <h1
          className="l-margin-t1 t-word-wrap-break-word"
          textContent={`#${issueId}: ${issue.title}`}
        />
      </div>
      <Actor
        actionDate={issue.created_at}
        className="Card-content"
        user={issue.user}
      />
      <div className="Card-content" textContent={issue.body} />
    </div>
    {issueComments.map(renderCommentCard)}
    <Toolbar
      className="fixed fixed--top"
      title={`#${issueId}: ${issue.title}`}
      onRequestDrawer={onRequestDrawer}
      onRequestSearch={onRequestSearch}
    />
  </div>;

const onInit = ({repo, issueId}, state, {loadIssue, loadIssueComments})=>{
  const id = `${repo}/${issueId}`;
  GithubIssue.get(id).then(loadIssue);
  GithubIssueComment.query({id}).then(loadIssueComments);
  return {
    issue: (GithubIssue.localGet(id) || ISSUE_PLACEHOLDER_OBJ),
    issueComments: GithubIssueComment.localQuery({id})
  };
};

IssueView.state = {
  onInit: onInit,
  onProps: onInit,
  loadIssue: (props, state, actions, issue)=>({...state, issue}),
  loadIssueComments: (props, state, actions, issueComments)=>({...state, issueComments})
};

export default IssueView;
