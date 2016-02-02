import './common/Card.css';
import xvdom              from 'xvdom';
import AppToolbar         from './AppToolbar.jsx';
import GithubIssue        from '../models/github/GithubIssue';
import GithubIssueComment from '../models/github/GithubIssueComment';
import Actor              from './common/Actor.jsx';

const ISSUE_PLACEHOLDER_OBJ = {
  user: {login:'', avatar_url:''},
  created_at: 0,
  title: '',
  body: '',
  pull_request: false
};

const IssueView = ({repo, issueId}, {issue, issueComments})=>
  <div className="l-padding-t6">
    <AppToolbar title={`${issue.pull_request ? 'Pull Request' : 'Issue'} #${issueId}`} />
    <div className="Card Card--fullBleed l-margin-t4 l-padding-t6">
      <div className="Card-title">
        <h1
          className="l-padding-b2 t-word-break-word"
          textContent={issue.title}
        />
      </div>
      <Actor
        actionDate={issue.created_at}
        className="Card-content"
        user={issue.user}
      />
      <div className="Card-content" textContent={issue.body} />
    </div>
    {issueComments.map(({id, user, body, created_at})=>
      <div id={id} className="Card">
        <Actor actionDate={created_at} className="Card-content" user={user} />
        <div className="Card-content t-word-break-word" textContent={body} />
      </div>
    )}
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
  loadIssue: (props, state, actions, issue)=>({
    ...state,
    issue
  }),
  loadIssueComments: (props, state, actions, issueComments)=>({
    ...state,
    issueComments
  })
};

export default IssueView;
