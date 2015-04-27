- upgrade babel
- Create app icon
- save Last Login

### Build

### Update dom5 (dom5 bug?)

```js

function remove(node) {
  var parent = node.parentNode;
  if (parent) {
    var idx = parent.childNodes.indexOf(node);
    parent.childNodes.splice(idx, 1);
  }
  node.parentNode = null;
}

function insertBefore(parent, oldNode, newNode) {
  if(newNode){
    remove(newNode);
    var idx = parent.childNodes.indexOf(oldNode);
    parent.childNodes.splice(idx, 0, newNode);
    newNode.parentNode = parent;
  } else {
    parent.childNodes.push(oldNode);
  }
}
```

#### Update paper-item.html and paper-icon-item.html (vulcanize bug?)

```html
<link rel="import" type="css" href="/Users/peter.wong/projects/ticker/components/paper-item/paper-item-shared.css">
```

#### minify

```bash
node_modules/.bin/vulcanize --inline-scripts --inline-css app.html > index-all.html;
vulcanize --strip --inline -output index-with-comments.html index-all.html;
minimize --output index.html index-with-comments.html;
rm index-all.html index-with-comments.html
```

### Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
