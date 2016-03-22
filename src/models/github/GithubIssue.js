import model  from '../../helpers/model';

export default model({
  get: (id)=> {
    const [owner, repo, issueId] = id.split('/');
    return {
      cache: `ticker:GithubIssue:${id}`,
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}`
    };
  },
  query: (id)=> ({
    cache: `GithubIssues:${id}`,
    url: `https://api.github.com/repos/${id}/issues`
  })
});
