import xvdom            from 'xvdom';
import List             from '../common/List.jsx';
import GithubPullCommit from '../../models/github/GithubPullCommit.js';
import compare          from '../../helpers/compare';
import timeAgo          from '../../helpers/timeAgo';

const sortCreatedAt = (a, b)=> compare(b.created_at, a.created_at);

const listMeta = ({sha, author, commit:{author:{name:authorName}, committer, message}}, repo)=> ({
  href: `#github/${repo}?commits/${sha}`,
  avatarUrl: (author && author.avatar_url),
  icon: 'person',
  key:  sha,
  text: message,
  secondaryText: `committed ${timeAgo(Date.parse(committer.date))} ago by ${author ? author.login : authorName}`
})

const PullCommitsView = ({id, repo}, commits)=>
  <List className='Card' context={repo} list={commits} meta={listMeta} />

PullCommitsView.state = {
  onInit: (props, state, {loadCommits})=> (
    GithubPullCommit.query(props).then(loadCommits),
    []
  ),
  loadCommits: (props, state, actions, commits)=> commits.sort(sortCreatedAt)
}

export default PullCommitsView;
