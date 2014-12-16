## `<ticker-github-events-card>` remove `template#Comment`

## [svengali debugging]: Attr where?

```js
appState.$.attrs.myAttr
//> root/child declares `myAttr`

appState.$.states.root.child()
//> states (parallel):
//>   grandChild1 (default)
//>   grandChild2
//> events:
//>   onClick      => *
//>   onTextChange => reenter
```

## [svengali] Problem: Events are used for too many communication patterns

1. View -> State
1. Child State -> Parent State
1. State -> State

Would it be better (clearer) to have seperate mechanisms for some/each of the
above?  Or is it enough


## [svengali] Problem: Fragile imported states

Imported states can have fragile/hidden dependencies on parent states.

Example...

```js
// ChildState.js
export default {
  attrs:{
    'num2'(){return this.attrs.num1 + 100}
  }
}

// ParentState.js
import ChildState from './ChildState';
export default {
  attrs:{
    'num1': 777
  },
  states:{
    'child': ChildState
  }
}
```

`ChildState` has a dependency on a `attrs.num1`.  This dependency is buried in
the attr initializer for `num2`.

### Possible Solution: `substate(mySubstate).transfer('attr1','attr2')`

!!! - We cannot transfer as params otherwise reentering would need to resend the
      param, which means it would have to store that param as an attr.

```js
// ChildState.js
export default {
  attrs:{
    'num2'(){return this.attrs.num1 + 100}
  }
}

// ParentState.js
import ChildState from './ChildState';
export default {
  attrs:{
    'num1': 777
  },
  states:{
    'child': substate(ChildState).transfer('num1')
  }
}
```

#### Concerns

- [ ] Boilerplate: Try converting appState, logoutState, and loginState

## [svengali] Make writing parameterized states easier

## [Design] Github Entity Page

- Collapsable Header
  - Title: User/Repo
  - [Repo] URL
  - [Repo] Description
  - Num Followers
  - Num Favorited
- Hideable 2nd Header Bar (Tabs)
  - Nav: Info
    - Readme
    - Stats
      - Activity (Line Graph)
        - Commits
        - PR
        - Issues
  - Nav: Code
  - Nav: Updates (stream)

### Currently...

```js
// states/appState.js
  ...
  'appDrawer':{
    attrs:{'appDrawerOpened':({appDrawerOpened})=>!!appDrawerOpened},
    events:{
      'toggleAppDrawer'(){
        return reenter({appDrawerOpened:!this.attrs.appDrawerOpened})
      }
    }
  },
  ...
```

```js
// elements/ticker-app-state.js
  ...
  openedToSelected:{
    toDOM:drawerOpened=>drawerOpened ? 'drawer' : 'main',
    toModel(selected){
      if(this.state.appDrawerOpened != (selected === 'drawer'))
        this.stateEvent('toggleAppDrawer');
      return this.state.appDrawerOpened;
    }
  }
  ...

```


### Proposal: Parameterized State

```js
// states/appState.js
  ...
  'appDrawer':{
    parameters:{
      'appDrawerOpened':({appDrawerOpened})=>!!appDrawerOpened
    }
    // If you wanted to listen for a parameter changing
    // parametersChanged:{
    //   'appDrawerOpened':(isOpened)=>reenter({appDrawerOpened:isOpened})
    // }
  },
  ...
```

```js
state.appDrawerOpened = !state.appDrawerOpened;
// What happens...
//   1. `set appDrawerOpened()`{ this.fire('appDrawerOpened') }
//   2. event appDrawerOpened:(appDrawerOpened)=>reenter({appDrawerOpened})
```


## [Feature] Deep linking

## Card Details

### Example Github API Issue JSON

```js
{
  "url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
  "html_url": "https://github.com/octocat/Hello-World/issues/1347",
  "number": 1347,
  "state": "open",
  "title": "Found a bug",
  "body": "I'm having a problem with this.",
  "user": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "gravatar_id": "somehexcode",
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "followers_url": "https://api.github.com/users/octocat/followers",
    "following_url": "https://api.github.com/users/octocat/following{/other_user}",
    "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
    "organizations_url": "https://api.github.com/users/octocat/orgs",
    "repos_url": "https://api.github.com/users/octocat/repos",
    "events_url": "https://api.github.com/users/octocat/events{/privacy}",
    "received_events_url": "https://api.github.com/users/octocat/received_events",
    "type": "User",
    "site_admin": false
  },
  "labels": [
    {
      "url": "https://api.github.com/repos/octocat/Hello-World/labels/bug",
      "name": "bug",
      "color": "f29513"
    }
  ],
  "assignee": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "gravatar_id": "somehexcode",
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "followers_url": "https://api.github.com/users/octocat/followers",
    "following_url": "https://api.github.com/users/octocat/following{/other_user}",
    "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
    "organizations_url": "https://api.github.com/users/octocat/orgs",
    "repos_url": "https://api.github.com/users/octocat/repos",
    "events_url": "https://api.github.com/users/octocat/events{/privacy}",
    "received_events_url": "https://api.github.com/users/octocat/received_events",
    "type": "User",
    "site_admin": false
  },
  "milestone": {
    "url": "https://api.github.com/repos/octocat/Hello-World/milestones/1",
    "number": 1,
    "state": "open",
    "title": "v1.0",
    "description": "",
    "creator": {
      "login": "octocat",
      "id": 1,
      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
      "gravatar_id": "somehexcode",
      "url": "https://api.github.com/users/octocat",
      "html_url": "https://github.com/octocat",
      "followers_url": "https://api.github.com/users/octocat/followers",
      "following_url": "https://api.github.com/users/octocat/following{/other_user}",
      "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
      "organizations_url": "https://api.github.com/users/octocat/orgs",
      "repos_url": "https://api.github.com/users/octocat/repos",
      "events_url": "https://api.github.com/users/octocat/events{/privacy}",
      "received_events_url": "https://api.github.com/users/octocat/received_events",
      "type": "User",
      "site_admin": false
    },
    "open_issues": 4,
    "closed_issues": 8,
    "created_at": "2011-04-10T20:09:31Z",
    "updated_at": "2014-03-03T18:58:10Z",
    "due_on": null
  },
  "comments": 0,
  "pull_request": {
    "url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347",
    "html_url": "https://github.com/octocat/Hello-World/pull/1347",
    "diff_url": "https://github.com/octocat/Hello-World/pull/1347.diff",
    "patch_url": "https://github.com/octocat/Hello-World/pull/1347.patch"
  },
  "closed_at": null,
  "created_at": "2011-04-22T13:33:48Z",
  "updated_at": "2011-04-22T13:33:48Z",
  "closed_by": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "gravatar_id": "somehexcode",
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "followers_url": "https://api.github.com/users/octocat/followers",
    "following_url": "https://api.github.com/users/octocat/following{/other_user}",
    "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
    "organizations_url": "https://api.github.com/users/octocat/orgs",
    "repos_url": "https://api.github.com/users/octocat/repos",
    "events_url": "https://api.github.com/users/octocat/events{/privacy}",
    "received_events_url": "https://api.github.com/users/octocat/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

### Issue Detailed View


- Collapsable Header
  - Back Button
  - Title: "#${Issue Num}: #{Description}"
  - Collapseable Content:
    - [Repo] URL
    - [Repo] Description
    - Num Watchers
- Content
  - Author
  - Description
  - Comments
    - Author icon
    - Author name
    - Date
    - Body

- Header
  - back button
  - Issue Name
  - Issue Number
  - Age
  - Repo

- Content
  - Author
  - Description
  - Comments
    - Author icon
    - Author name
    - Date
    - Body

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


## [Perf] Are `<templates>` lighter/faster than polymer elements?

`<ticker-github-events-card>` uses a referenced template for rendering a
card title, time, and each event... is this better than just defining a polymer
element for each of these?

## [Style] Consider splitting up `_layouts.scss` (margin, padding, width, height)


## [Feature, Data] Github/Events/PushEvent

Need associated PullRequest for the branch being pushed to


## [API Design] Data Source

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

## [svengali] Should params block transition?

So far it seems like param requirements are hard to use as a blocked transition
are hard to rectify.  What to do I do now?  How can I tell the transition was
blocked?
