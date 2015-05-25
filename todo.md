- make production build (actually replace IS_DEV)
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

```sh
node_modules/.bin/vulcanize --inline-scripts --inline-css --abspath '/Users/peter.wong/projects/ticker' /app.html > app-built.html; \
vulcanize -strip -output app-built2.html app-built.html; \
rm app-built.html; \
node_modules/.bin/crisper --source app-built2.html --html index.html --js index.js; \
rm app-built2.html; \
sed -i -- 's/<script src="index.js"><\/script>/<script>requestAnimationFrame\(function\(\){var s=document.createElement\("script"\);s.src="\/index.js";document.body.appendChild\(s\);}\)<\/script>/' index.html; \
sed -i -- 's/<link rel="stylesheet" href="\/\/fonts.googleapis.com\/css\?family=Roboto:400,300,300italic,400italic,500,500italic,700,700italic">//' index.html
```

### Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
