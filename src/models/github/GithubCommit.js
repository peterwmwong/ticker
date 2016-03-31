import model  from '../../helpers/model';

export default model({
  get: (id)=> {
    const [owner, repo, commitid] = id.split('/');
    return {
      cache: `ticker:GithubCommit:${owner}:${repo}:${commitid}`,
      url: `https://api.github.com/repos/${owner}/${repo}/commits/${commitid}`
    };
  }
});
