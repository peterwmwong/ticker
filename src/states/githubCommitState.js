import GithubCommit from '../models/github/GithubCommit';

export default {
  // params:['githubCommitID'],
  attrs:{
    'appView':()=>'github-commit',
    // 'commit':({githubCommitID})=>GithubCommit.get(githubCommitID)
    'commit':()=>new GithubCommit({
      message: 'yolo'
    })
  }
};
