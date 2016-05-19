import xvdom               from 'xvdom';
import List                from '../common/List.jsx';
import GithubPullCommit    from '../../models/github/GithubPullCommit.js';
import modelStateComponent from '../../helpers/modelStateComponent';
import compare             from '../../helpers/compare';
import timeAgo             from '../../helpers/timeAgo';

const sortCreatedAt = (a, b)=> compare(b.created_at, a.created_at);
const sort = (commits)=> commits.sort(sortCreatedAt)

const item = (
  {
    sha,
    author,
    commit: {
      author: {name},
      committer,
      message
    }
  },
  repo
)=> ({
  href: `#github/${repo}?commits/${sha}`,
  avatarUrl: (author && author.avatar_url),
  icon: 'person',
  key:  sha,
  text: message,
  secondaryText: `committed ${timeAgo(Date.parse(committer.date))} ago by ${author ? author.login : name}`
})

export default modelStateComponent(GithubPullCommit, 'query', ({props: {repo}, state: commits})=>
  <List
    className='Card'
    context={repo}
    item={item}
    list={commits}
    transform={sort}
  />
);
