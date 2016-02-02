import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import timeAgo    from '../helpers/timeAgo';
import GithubIssue from '../models/github/GithubIssue';

const IssuesView = (props, issues)=>
  <div className='l-margin-t2 Card'>
    {issues.map(({id, number, title, created_at, user})=>
      <div key={id} className='List-item layout horizontal center'>
        <GithubIcon name='issue-opened' className='l-margin-r3' />
        <div className="t-normal">
          {title}
          <div className="t-light t-font-size-14 c-gray-dark">
            #{number} opened {timeAgo(Date.parse(created_at))} ago by {user.login}
          </div>
        </div>
      </div>
    )}
  </div>;

IssuesView.state = {
  onInit: ({id}, state, {loadIssues})=>(
    GithubIssue.query({id}).then(loadIssues),
    loadIssues(GithubIssue.localQuery({id}) || [])
  ),
  loadIssues: (props, state, actions, issues)=>
    issues.sort((a, b)=>compare(b.created_at, a.created_at))
}

export default IssuesView;
