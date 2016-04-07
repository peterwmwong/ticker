import model  from '../../helpers/model';

export default model({
  get: (id)=> {
    const [owner, repo, issueId] = id.split('/');
    return {
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}`
    };
  },
  query: (id)=> ({
    url: `https://api.github.com/repos/${id}/issues`
  })
});
