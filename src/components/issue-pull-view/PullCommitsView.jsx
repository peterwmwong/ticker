import xvdom            from 'xvdom';
import Icon             from '../common/Icon.jsx';
import Avatar           from '../common/Avatar.jsx';
import GithubPullCommit from '../../models/github/GithubPullCommit.js';
import compare          from '../../helpers/compare';
import timeAgo          from '../../helpers/timeAgo';

const sortCreatedAt = (a, b)=> compare(b.created_at, a.created_at);

const PullCommitsView = ({id, repo}, commits)=>
  <div className='l-margin-t2 Card' hidden={!commits.length} >
    {commits.map(({sha, author, commit:{author:{name:authorName}, committer, message}})=>
      <div className='List-item layout horizontal center' key={sha}>
        {author
          ? <Avatar avatarUrl={author.avatar_url} />
          : <Icon name='person' />
        }
        <a className='l-margin-l3 t-normal' href={`#github/${repo}?commits/${sha}`}>
          {message}
          <div
            className='t-light t-font-size-14 c-gray-dark'
            textContent={`committed ${timeAgo(Date.parse(committer.date))} ago by ${author ? author.login : authorName}`}
          />
        </a>
      </div>
    )}
  </div>;

PullCommitsView.state = {
  onInit: (props, state, {loadCommits})=> (
    GithubPullCommit.query(props).then(loadCommits),
    []
  ),
  loadCommits: (props, state, actions, commits)=> commits.sort(sortCreatedAt)
}

export default PullCommitsView;
