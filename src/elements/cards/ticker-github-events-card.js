import GithubIssue from '../../models/github/GithubIssue';

Polymer('ticker-github-events-card', {
  onOpenIssueDetails(event){
    var {payload,repo} = event.target.templateInstance.model;
    GithubIssue.get(undefined, {
      issueNumber: payload.issue.number,
      repo:        repo.name
    }).$promise.then(issue=>this.issue=issue);
  }
})
