import GithubCommit from '../models/github/GithubCommit.js';

export default {
  params:['githubCommitURL'],
  attrs:{
    'appOverlayView':()=>'overlay-github-commit',
    'commit':({githubCommitURL})=>GithubCommit.get(githubCommitURL)
  }
};
