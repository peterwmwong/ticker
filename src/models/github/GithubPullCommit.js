import model  from '../../helpers/model';

export default model({
  query: ({repo, id})=> ({
    cache: `ticker:GithubPullCommits:${repo}:${id}`,
    url: `https://api.github.com/repos/${repo}/pulls/${id}/commits`
  })
});
