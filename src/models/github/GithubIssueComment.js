import model  from '../../helpers/model';

export default model({
  query: ({id})=> {
    const [owner, repo, issueId] = id.split('/');
    return {
      cache: `ticker:GithubIssueComment:${owner}/${repo}/${issueId}`,
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}/comments`
    };
  }
});
