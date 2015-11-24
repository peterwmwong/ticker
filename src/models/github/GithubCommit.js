import loadJSON from '../../helpers/load';

export default {
  get: id=>{
    const [owner, repo, commitid] = id.split('/');
    return loadJSON(
      // `https://api.github.com/repos/${owner}/${repo}/commits/${commitid}`
      `src/helpers/mock_data/GithubCommitMOCK.json`
    );
  }
};
