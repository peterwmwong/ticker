import '../common/Card.css';
import xvdom              from 'xvdom';
import GithubIssueComment from '../../models/github/GithubIssueComment';
import Actor              from './../common/Actor.jsx';
import Markup             from './../common/Markup.jsx';
import modelStateComponent         from '../../helpers/modelStateComponent';

export default modelStateComponent(GithubIssueComment, 'query', ({props: {issue}, state:issueComments})=>
  <div>
    <div className='Card Card--fullBleed'>
      <div className='Card-title'>
        <h1
          className='t-word-break-word l-margin-v0'
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
    {issueComments && issueComments.map(({id, user, body, created_at})=>
      <div className='Card' id={id} key={id}>
        <Actor actionDate={created_at} className='Card-content' user={user} />
        <Markup className='Card-content' content={body} />
      </div>
    )}
  </div>
)
