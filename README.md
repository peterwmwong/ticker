# xvdom experiments

Mad scientist experiments using xvdom.

```
> npm install
> npm run server
> open http://localhost:8080/
```

### TODOS

- Lazy loading highlightjs languages
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
