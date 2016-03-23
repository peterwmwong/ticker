# Ticker

Stay up-to-date with the GitHub repositories and users.

## Developing

```
> npm install
> npm run server
> open http://localhost:8080/#github/peterwmwong/ticker
```

## URL strategy

### Current strategy

{"github" | "bitbucket"}/{org or user}/{repo}/{repo resource "issues" | "commits"}/{resource id}
{"github" | "bitbucket"}/{org or user}/{repo}?tab={rep}

### Problems

- Mixed top level views
- top level views don't match model hierarchy
  - Repo/{repo resource}/{sub repo resource}


### TODOS

- Retain scroll position on back
  - Anchor tag has each top event item?
- Feature: Repo and User Header
  - Repo: Description, Readme, # PRs, # Recent commits
  - User: # Recent... Pushes, Comments, PRs, Issues
- Feature: AppSearch should provide results and shortcuts...
  - favorited sources
  - previously searched terms
