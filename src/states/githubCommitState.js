import GithubCommit from '../models/github/GithubCommit.js';

export default {
  // params:['githubCommitID'],
  attrs:{
    'appView':()=>'github-commit',
    // 'commit':({githubCommitID})=>GithubCommit.get(githubCommitID || 'Polymer/polymer/889aa2f4352976bbe84b80afc41648da4fab2636')
    'commit':({githubCommitID})=>GithubCommit.get(githubCommitID || 'Polymer/polymer/71d561b7c3e6103755c73069de8baec7a99dbd12')
    // 'commit':()=>new GithubCommit({
    //   message: 'yolo'
    // })
  }
};
