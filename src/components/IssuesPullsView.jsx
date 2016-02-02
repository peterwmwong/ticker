import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import timeAgo    from '../helpers/timeAgo';

const IssuesPullsView = ({icon}, issues)=>
  <div className='l-margin-t2 Card'>
    {issues.map(({id, number, title, created_at, user})=>
      <div key={id} className='List-item layout horizontal center'>
        <GithubIcon name={icon} className='l-margin-r3' />
        <div className="t-normal">
          {title}
          <div
            className="t-light t-font-size-14 c-gray-dark"
            textContent={`#${number} opened ${timeAgo(Date.parse(created_at))} ago by ${user.login}`}
          />
        </div>
      </div>
    )}
  </div>;

IssuesPullsView.state = {
  onInit: ({id, modelClass}, state, {loadIssues})=>(
    modelClass.query({id}).then(loadIssues),
    loadIssues(modelClass.localQuery({id}) || [])
  ),
  loadIssues: (props, state, actions, issues)=>
    issues.sort((a, b)=>compare(b.created_at, a.created_at))
}

export default IssuesPullsView;
