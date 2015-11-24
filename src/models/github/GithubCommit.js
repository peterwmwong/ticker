import loadJSON from '../../helpers/load';

export default {
  get: id=>{
    const [owner, repo, commitid] = id.split('/');
    return loadJSON(
      // `src/helpers/mock_data/GithubCommitMOCK.json`
      `https://api.github.com/repos/${owner}/${repo}/commits/${commitid}`
    );
  }
};
