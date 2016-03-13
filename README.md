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

### Proposed strategy

{AppURL}?{ViewURL}

AppURL
  {github|bitbucket}/{user}
  {github|bitbucket}/{user}/{repo?}

ViewURL
  ({path}/{id?})+

UserViewURL extends ViewURL
  {Resource:news|repos}

RepoViewURL extends ViewURL
  {Resource:readme|news|code|pulls|issues}/{SubResourcePath}

SubResourcePath
  ({path}/{id?})+

{github|bitbucket}/{user}?{view url}
  - UserView

{github|bitbucket}/{user}/{repo?}?{view url}
  - RepoView

github/facebook/react?readme

github/facebook/react?issues
github/facebook/react?issues/12345

github/facebook/react?code
github/facebook/react?code/{sha}/
github/facebook/react?code/{sha}/{path}

github/facebook/react?code/{sha}/{path}

### TODOS

- Feature: Repo Files Tab
  - File navigator
- Retain scroll position on back
  - Anchor tag has each top event item?
- Feature: Repo and User Header
  - Repo: Description, Readme, # PRs, # Recent commits
  - User: # Recent... Pushes, Comments, PRs, Issues
- Perf: Lazy loading highlightjs languages
  - Goal: Lazy load highlightjs 1) core package 2) needed languages
  - Map file extensions to languages
    - https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
  - Build core
    - `node tools/build.js -n -t browser javascript`
    - `cat build/highlight.pack.js | sed "/hljs.registerLanguage(/q" | sed '$d'`
  - Build each language
    - for each language
      - `node tools/build.js -n -t browser javascript`
      - `node tools/build.js -n -t browser javascript; cat build/highlight.pack.js | grep -a100000000 "hljs.registerLanguage"`
- Feature: AppSearch should provide results from favorited sources
  - Possible Heuristic:
    - Simple contains
    - Simple contains w/Limit
- Try babel-preset-es2015-loose
