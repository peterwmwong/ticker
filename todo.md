- update babel >5.3 for perf optimizations
- Fix blinking after selecting a new source
- refactor: rename `<ticker-user-view>` to something else (`<ticker-source-page>`?)
- store/retrieve previous events in localStorage
- Search icon button disappears w/large windows
- consider using x-autobind to replace ticker-app
- Utility classes should leverage PostCSS variables
- unify utility class prefix to "u-"
- sweep utility classes and remove overlap with iron-(flex)-layout
- Create app icon
- save Last Login

### Build

#### Update link to `all.css` in `ticker-app.html`

__vulcanize bug: currently does not include regular linked stylesheets__

```html
<link rel='stylesheet' type='text/css' href='../all.css'>
```

to...

```html
<link rel='import' type='css' href='../all.css'>
```

#### Run the following

```sh
node_modules/.bin/vulcanize --inline-scripts --inline-css --abspath '/Users/peter.wong/projects/ticker' /app.html > app-built.html; vulcanize --strip -output index.html app-built.html; rm app-built.html
```

### Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
