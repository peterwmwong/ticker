import xvdom               from 'xvdom/src/index';
import List                from './common/List.jsx';
import compare             from '../helpers/compare';
import modelStateComponent from '../helpers/modelStateComponent';
import timeAgo             from '../helpers/timeAgo';

const compareCreatedAt = (a, b)=> compare(b.created_at, a.created_at)
const sortIssues = (issues)=> issues.sort(compareCreatedAt)
const item = ({base, number, title, created_at, user}, id)=> ({
  href: `#github/${id}?${base ? 'pulls' : 'issues'}/${number}`,
  avatarUrl: user.avatar_url,
  key:  number,
  text: title,
  secondaryText: `#${number} opened ${timeAgo(Date.parse(created_at))} ago by ${user.login}`
})

export default modelStateComponent(
  ({modelClass})=> modelClass,
  'query',
  ({props:{repo}, state})=>
    <List
      className='Card'
      context={repo}
      item={item}
      list={state}
      transform={sortIssues}
    />
)
