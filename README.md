# Ticker

Stay up-to-date with the GitHub repositories and users.

## Developing

```
> npm install
> npm run server
> open http://localhost:8080/#github/peterwmwong/ticker
```

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
