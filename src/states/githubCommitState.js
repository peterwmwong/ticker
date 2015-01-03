import GithubCommit from '../models/github/GithubCommit.js';

export default {
  // params:['githubCommitID'],
  attrs:{
    'appView':()=>'github-commit',
    'commit':({githubCommitID})=>GithubCommit.get(githubCommitID)
  }
};
