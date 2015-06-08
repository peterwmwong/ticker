## Features/Fixes

- store/retrieve previous events in localStorage
- Indicate source events are "loading" when switching sources
  -       1st time: show "loading"
  - After 1st time: show previously loaded events and small loading indicator (also last loaded)
- Show source display name in toolbar
- Create app icon

## Development

- unify utility class prefix to "u-"
- refactor: rename `<ticker-user-view>` to something else (`<ticker-source-page>`?)
- Move `helper/load*` into an `initializers/` directory
- try re-enabling liveCSS
- sweep utility classes and remove overlap with iron-(flex)-layout
- move ticker-icons to `iconsets/`

## Statechart

#### Problems

- Reentering a state doesn't feel right
  - Often times the idea of "updating" state seems conceptually closer than reentering
  - Can we think of state functionally as more of a React.setState?
    - Can states be described as pure functions?

####

#### Ideas

## Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
