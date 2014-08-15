# Events

## Github Events

- PR
  - Open (PullRequestEvent payload.action == 'open')
    - Repo
    - User
    - PR Name
    - Description
  - Merged (PullRequestEvent payload.action == 'closed' && payload.merged)
    - Repo
    - User (PR creator)
    - PR Name
    - Description
  - Closed (PullRequestEvent payload.action == 'closed' && !payload.merged)
    - Repo
    - User
    - PR Name
    - Description
    - Associated comment?
  - Comment (IssueCommentEvent payload.pull_request)
    - Repo
    - PR Name
    - Author
    - Associated comment?
  - Push (!!! CANNOT BE DETERMINED FROM EVENT DATA)
- Issues
  - Open (IssueEvent payload.action == 'open')
  - Closed (IssueEvent payload.action == 'closed')
  - Comment (IssueCommentEvent !payload.pull_request)
- Branch
  - Create (CreateEvent payload.ref_type == 'branch')
  - Delete (DeleteEvent payload.ref_type == 'branch')
  - Commit (PushEvent payload.ref)
- Repo
  - Create (CreateEvent action.ref_type == 'repository')

## Icons

```
PR
  + (open)
  x (closed)
  ✓ (merged)
```
