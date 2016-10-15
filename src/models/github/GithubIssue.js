import model  from '../../helpers/model';

export default model({
  get: ({repo, id}) => ({
    cache: `ticker:GithubIssue:${repo}${id}`,
    url: `https://api.github.com/repos/${repo}/issues/${id}`
  }),
  query: ({repo}) => ({
    url: `https://api.github.com/repos/${repo}/issues`
  })
});
