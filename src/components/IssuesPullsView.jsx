import xvdom      from 'xvdom';
import List       from './common/List.jsx';
import compare    from '../helpers/compare';
import timeAgo    from '../helpers/timeAgo';

const compareCreatedAt = (a, b)=> compare(b.created_at, a.created_at)
const sortIssues = (issues)=> issues.sort(compareCreatedAt)

const item = ({base, number, title, created_at, user}, id)=> ({
  href: `#github/${id}?${base ? 'pulls' : 'issues'}/${number}`,
  avatarUrl: user.avatar_url,
  key:  number,
  text: title,
  secondaryText: `#${number} opened ${timeAgo(Date.parse(created_at))} ago by ${user.login}`
})

const IssuesPullsView = ({id}, issues)=>
  <List
    className='Card'
    context={id}
    list={issues}
    item={item}
    transform={sortIssues}
  />

IssuesPullsView.state = {
  onInit: ({id, modelClass}, state, {loadIssues})=> (
    modelClass.query(id).then(loadIssues),
    loadIssues(modelClass.localQuery(id) || [])
  ),
  loadIssues: (props, state, actions, issues)=> issues
}

export default IssuesPullsView;
