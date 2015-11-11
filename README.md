# xvdom experiments

Mad scientist experiments using xvdom.

```
> npm install
> npm run server
> open http://localhost:8080/
```

### TODOS

- Refactor: common backdrop for App (App level element below AppSearch and AppDrawer)
- Refactor: App.state.{drawerEnabled/searchEnabled} -> App.state.overlay
- Feature: AppSearch should provide results from favorited sources
  - Possible Heuristic:
    - Simple contains
    - Simple contains w/Limit
