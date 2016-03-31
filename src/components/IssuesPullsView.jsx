import xvdom      from 'xvdom';
import Avatar     from './common/Avatar.jsx';
import compare    from '../helpers/compare';
import timeAgo    from '../helpers/timeAgo';

const compareCreatedAt = (a, b)=> compare(b.created_at, a.created_at)

const IssuesPullsView = ({id:modelId, icon}, issues)=>
  <div className='l-margin-t2 Card' hidden={!issues.length} >
    {issues.map(({base, number, title, created_at, user})=>
      <div className='List-item layout horizontal center' key={number}>
        <Avatar avatarUrl={user.avatar_url} />
        <a
          className='t-normal l-margin-l3'
          href={`#github/${modelId}?${base ? 'pulls' : 'issues'}/${number}`}
        >
          {title}
          <div
            className='t-light t-font-size-14 c-gray-dark'
            textContent={`#${number} opened ${timeAgo(Date.parse(created_at))} ago by ${user.login}`}
          />
        </a>
      </div>
    )}
  </div>;

IssuesPullsView.state = {
  onInit: ({id, modelClass}, state, {loadIssues})=> (
    modelClass.query(id).then(loadIssues),
    loadIssues(modelClass.localQuery(id) || [])
  ),
  loadIssues: (props, state, actions, issues)=> issues.sort(compareCreatedAt)
}

export default IssuesPullsView;
