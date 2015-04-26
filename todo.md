- Create user avatar element
  - abstraction over repos (icon) and users (avatar img url)
  - leverages avatar size param (&s=30) for smaller downloads
- limit search results of users and repositories using `&per_page=10` param
- upgrade babel
- Create app icon
- save Last Login

### Basis

- Bug: Why doesn't mapperGet resolve the promise with the model?
- Bug/Feature: Must add basis AFTER the body.  You can't add it to <head> because
  the initialization creates the wormhole Array by adding an iframe to document.body.
  - Can we add the iframe to <head>?
  - Adding scripts in <head> is sooooo common, I think we should support this use
    case.
- Feature: Allow mapper to modify the model/array (like pre-basis)
