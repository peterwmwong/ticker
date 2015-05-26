- try re-enabling liveCSS
- save Last Login
- perf: investigate asynchronous font loading for roboto font
- Fix blinking after selecting a new source
- refactor: rename `<ticker-user-view>` to something else (`<ticker-source-page>`?)
- store/retrieve previous events in localStorage
- Search icon button disappears w/large windows
- consider using x-autobind to replace ticker-app
- unify utility class prefix to "u-"
- sweep utility classes and remove overlap with iron-(flex)-layout
- Create app icon
- move ticker-icons to `iconsets/`
- [statechart bug] routing to a state that yields the same states are forcibly reentered

### Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
