import xvdom            from 'xvdom';
import GithubIcon       from '../common/GithubIcon.jsx';
import GithubPullCommit from '../../models/github/GithubPullCommit.js';
import compare          from '../../helpers/compare';
import timeAgo          from '../../helpers/timeAgo';

const PullCommitsView = ({id, repo}, commits)=>
  <div className='l-margin-t2 Card' hidden={!commits.length} >
    {commits.map(({sha, author, commit:{committer, message}})=>
      <div className='List-item layout horizontal center' key={sha}>
        <GithubIcon className='l-margin-r3' name='git-commit' />
        <a className='t-normal' href={`#github/${repo}?commits/${sha}`}>
          {message}
          <div
            className='t-light t-font-size-14 c-gray-dark'
            textContent={`committed ${timeAgo(Date.parse(committer.date))} ago by ${author.login}`}
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
  loadCommits: (props, state, actions, commits)=>
    commits.sort((a, b)=> compare(b.created_at, a.created_at))
}

export default PullCommitsView;
