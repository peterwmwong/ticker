### enter vs attr init call order

#### attr after examples

```js
enter(){
  this.fbRef = new Firebase('https://ticker-test.firebaseio.com');
  this.fbUserPromise = new Promise((resolve, reject)=>{
    this.fbRef.authWithOAuthRedirect('github', (error, authData)=>{
      if(error) reject(error);
      else resolve(authData.user);
    });
  })
},
attrs:{
  user(){
    return this.fbUserPromise.then(fbUser=>{
      // Load user data
      User.get(fbUser.id).$promise.
        // If user does not exist yet...
        catch(error=>
          // Create user with no streams
          new User({
            id:fbUser.id,
            eventStreams:[]
          }).$save().$promise
        ).
        then(user=>this.user = user)
    });
  }
}
```


### Passing context

- Params for `enter`s?
- How does this relate to routing params?
- How does this relate to attrs?


### Exit fn for init attr functions

Example

```js
attrs:{
  myService:{
    init(){return new MyService()},
    deinit(myService){myService.unload()}
  }
}
```
