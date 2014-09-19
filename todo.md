## Deep linking

## Card Details

### Detailed Views
- Pull Request
  * Info
    - Name
    - Author
    - Description
    - CI
  * Comments
  * Diff
- Issue
  * Info
    - Name
    - Author
    - Description
  * Comments
- Repo  
  * Info
    - Name
    - Owner
    - Description
  * Files
- Commit
  * Diff


### Event to Detail mapping

- Commit
  - CommitCommentEvent
  - PushEvent
- PR
  - PullRequestEvent
  - PullRequestReviewCommentEvent
- Issue
  - IssueCommentEvent
  - IssuesEvent
- Repo

  - GollumEvent

  - WatchEvent
  - ForkEvent
  - CreateOrDeleteEvent
  - ReleaseEvent
  - TeamAddEvent


## [Style] Consider splitting up `_layouts.scss` (margin, padding, width, height)


## [Data] Github/Events/PushEvent

Need associated PullRequest for the branch being pushed to


## [Design] Data Source

Provides Data that can be Rendered as a card.

```js
interface IDataSource {
  query({}):Data[]
}
```

```js
class Github /* implements IDataSource */ {
  query({}):Data[] {
    return
  }
}
```


## [Model Framework] Model polymer-elements

```jade
script.
  System.import('../models');
```

```jade
+import('../models/models.html')
model-query(type="Event" options="[[ {type:'user', user:'polymer'} ]]" models="{{githubEvents}}")
model-get(type="Event" id="GUID_IDENTIFIER" model="{{githubEvent}}")
model-create(type="Event" model="{{githubEvent}}")
```


## [Model Framework] Model's with the same name?

I think this requirement was born out of overcoming limitations with specifying associations.

```js
$.hasMany(
  'items',
  'Item' /* Why not a reference to the actual model object? */
);
```


## [Model Framework] Less boilerplate for Model/Mapper

```js
class JsonRestMapper {
  get(model, id, options){
    var options = copy(options);
    options.id = id;
    loadJSON(this.getURL(options)).then((result)=>
      model.$class.load(
        AttrMunger.camelize(result)))
    )
  }

  query(array, options){
    loadJSON(this.getURL(options)).then((result)=>
      array.$replace(
        array.$class.loadAll(
          AttrMunger.camelize(result)))
    )
  }

  create(model, options){/*...*/}
  update(model, options){/*...*/}
  delete(model, options){/*...*/}
}

export default class Event extends Model.init({
  mapper: new JsonRestMapper({url: '/api/events/:id'})
});
```


## [Model Framework] Better Model initialization API

```js
// BEFORE
class GithubUserEvent extends Model{}
GithubUserEvent.create($=>{
  $.mapper = GithubUserEventMapper;
  $.attr('type', 'string');
  $.attr('actor', 'identity');
  $.attr('repo', 'identity');
  $.attr('payload', 'identity');
});
export default GithubUserEvent;

// AFTER
export default class GithubUserEvent extends Model.init({
  mapper:  GithubUserEventMapper,
  type:    'string',
  actor:   'identity',
  repo:    'identity',
  payload: 'identity'
}){
  get exampleGetProperty(){

  }
};
```
