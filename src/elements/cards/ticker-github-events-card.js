var REF_TYPE_TO_TYPE = {
  'branch':     'BRANCH',
  'repository': 'REPO'
}

Polymer('ticker-github-events-card', {
  // Defaults
  type: 'OTHER',
  icon: 'github:octoface',

  dataChanged(_, {type,payload:{action,refType,pullRequest}}={}){
    this.type =
        (type === 'PullRequestEvent')  ? 'PR'
      : (type === 'IssuesEvent')       ? 'ISSUE'
      : (type === 'IssueCommentEvent') ? (pullRequest ? 'PR' : 'ISSUE')
      : (type === 'CreateEvent' || type === 'DeleteEvent') ? REF_TYPE_TO_TYPE[refType]
      : this.type; // Use default

    this.icon =
        (this.type === 'PR')     ? 'github:git-pull-request'
      : (this.type === 'ISSUE')  ?
            (action === 'opened')  ?  'github:issue-opened'
          : (action === 'closed')  ?  'github:issue-closed'
          : (type === 'IssueCommentEvent') && 'github:comment'
      : (this.type === 'BRANCH') ? 'github:git-branch'
      : (this.type === 'REPO')   ? 'github:repo'
      : (type === 'WatchEvent')  ? 'github:star'
      : (type === 'ForkEvent')   ? 'github:repo-forked'
      : this.icon; // Use default
  }
})
