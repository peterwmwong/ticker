var REF_TYPE_TO_TYPE = {
  'branch': 'BRANCH',
  'repository': 'REPO'
}

Polymer('ticker-github-events-card', {
  EVENT_TYPE_TO_ICON: {
    'PullRequestEvent': 'github:git-pull-request'
  },

  dataChanged(_, data){
    this.type =
      (data.type === 'PullRequestEvent') ? 'PR'
        : (data.type === 'IssuesEvent') ? 'ISSUE'
          : (data.type === 'IssueCommentEvent') ? (data.payload.pullRequest ? 'PR' : 'ISSUE')
            : (data.type === 'CreateEvent' || data.type === 'DeleteEvent') && REF_TYPE_TO_TYPE[data.payload.refType];

    switch(this.type){
      case 'PR':
        this.icon = 'github:git-pull-request';
        break;
      case 'ISSUE':
        this.icon =
          (data.payload.action === 'opened') ? 'github:issue-opened'
            : (data.payload.action === 'closed') ? 'github:issue-closed'
              : (data.type === 'IssueCommentEvent') && 'github:comment';
        break;
      case 'BRANCH':
        this.icon = 'github:git-branch';
        break;
      case 'REPO':
        this.icon = 'github:repo';
        break;

      default:
        if(data.type === 'WatchEvent') this.icon = 'github:star';
        else if(data.type === 'ForkEvent') this.icon = 'github:repo-forked';
    }
  }
})
