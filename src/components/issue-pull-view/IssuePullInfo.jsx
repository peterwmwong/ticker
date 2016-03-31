import '../common/Card.css';
import xvdom              from 'xvdom';
import GithubIssueComment from '../../models/github/GithubIssueComment';
import Actor              from './../common/Actor.jsx';
import Markup             from './../common/Markup.jsx';

const IssuePullInfo = ({repo, issue}, issueComments)=>
  <div>
    <div className='Card Card--fullBleed l-margin-b2'>
      <div className='Card-title'>
        <h1
          className='t-word-break-word l-margin-b0 l-margin-t2'
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

const onInit = ({repo, issue}, state, {loadIssueComments})=> {
  const id = `${repo}/${issue.number}`;
  GithubIssueComment.query({id}).then(loadIssueComments);
  return GithubIssueComment.localQuery({id}) || [];
};

IssuePullInfo.state = {
  onInit,
  onProps: onInit,
  loadIssueComments: (props, state, actions, issueComments)=> issueComments
};

export default IssuePullInfo;
