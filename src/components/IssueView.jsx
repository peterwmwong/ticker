import './common/Card.css';
import GithubIssue        from '../models/github/GithubIssue';
import GithubIssueComment from '../models/github/GithubIssueComment';
import Actor              from './common/Actor.jsx';
import SourceName         from './SourceName.jsx';

const ISSUE_PLACEHOLDER_OBJ = {
  user: {login:'', avatar_url:''},
  created_at: 0,
  title: '',
  body: ''
};

const IssueView = ({repo, issueId}, {issue, issueComments})=>
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
    {issueComments.map(({id, user, body, created_at})=>
      <div id={id} className="Card">
        <Actor actionDate={created_at} className="Card-content" user={user} />
        <div className="Card-content t-word-wrap-break-word" textContent={body} />
      </div>
    )}
  </div>;

const onInit = ({repo, issueId}, state, {loadIssue, loadIssueComments})=>{
  const id = `${repo}/${issueId}`;
  GithubIssue.get(id).then(loadIssue);
  GithubIssueComment.query({id}).then(loadIssueComments);
  return {
    ...loadIssue((GithubIssue.localGet(id) || ISSUE_PLACEHOLDER_OBJ)),
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
