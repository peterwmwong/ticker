import './common/Card.css';
import xvdom              from 'xvdom';
import AppToolbar         from './AppToolbar.jsx';
import GithubIssue        from '../models/github/GithubIssue';
import GithubIssueComment from '../models/github/GithubIssueComment';
import Actor              from './common/Actor.jsx';
import Markup             from './common/Markup.jsx';

const ISSUE_PLACEHOLDER_OBJ = {
  user: {login:'', avatar_url:''},
  created_at: 0,
  title: '',
  body: '',
  pull_request: false
};

const IssuePullInfo = ({repo, issueId, showToolbar}, {issue, issueComments})=>
  <div className={showToolbar ? 'l-padding-t6' : ''}>
    {showToolbar &&
      <AppToolbar
        title={`${issue.pull_request ? 'Pull Request' : 'Issue'} #${issueId}`}
      />
    }
    <div className='Card Card--fullBleed'>
      <div className='Card-title'>
        <h1
          className={
            `t-word-break-word l-margin-b0 ${
              showToolbar ? 'l-padding-t2' : 'l-margin-t2'
            }`
          }
          textContent={issue.title}
        />
      </div>
      <Actor
        actionDate={issue.created_at}
        className='Card-content'
        user={issue.user}
      />
      <Markup className='Card-content' content={issue.body} />
    </div>
    {issueComments.map(({id, user, body, created_at})=>
      <div className='Card' id={id} key={id}>
        <Actor actionDate={created_at} className='Card-content' user={user} />
        <Markup className='Card-content' content={body} />
      </div>
    )}
  </div>;

const onInit = ({repo, issueId}, state, {loadIssue, loadIssueComments})=> {
  const id = `${repo}/${issueId}`;
  GithubIssue.get(id).then(loadIssue);
  GithubIssueComment.query({id}).then(loadIssueComments);
  return {
    issue: (GithubIssue.localGet(id) || ISSUE_PLACEHOLDER_OBJ),
    issueComments: GithubIssueComment.localQuery({id})
  };
};

IssuePullInfo.state = {
  onInit: onInit,
  onProps: onInit,
  loadIssue: (props, state, actions, issue)=> ({
    ...state,
    issue
  }),
  loadIssueComments: (props, state, actions, issueComments)=> ({
    ...state,
    issueComments
  })
};

export default IssuePullInfo;
