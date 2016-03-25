import model  from '../../helpers/model';

export default model({
  get: (id)=> {
    const [owner, repo, commitid] = id.split('/');
    return {
      // url: 'src/helpers/mock_data/GithubCommitMOCK.json'//,
      url: `https://api.github.com/repos/${owner}/${repo}/commits/${commitid}`
    };
  }
});
