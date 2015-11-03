import load from '../helpers/load.js';

export function attemptLoginOnLoad(){
  return dispatch=>{
    const checkForFirebase = ()=>{
      if(window.Firebase){
        dispatch(determineAuthOnLoad);
        return;
      }
      setTimeout(checkForFirebase, 100);
    };
    checkForFirebase();
  };
}

export function determineAuthOnLoad(){
  return dispatch=>{
    const fb = new window.Firebase('https://ticker-dev.firebaseio.com');
    fb.onAuth(authData=>{
      const github = authData && authData.github;
      if(github){
        this.fire('authSuccessful', github.id, github.username, {github:github.accessToken});
      }
      else{
        this.fire('authFailed');
      }
    })
  };
}

export function getOrCreateUser(){
  return dispatch=>{
    // Give load access tokens to use for any third-party API requests.
    // For right now, just Github.
    // TODO(pwong): Split out access tokens into a seperate module?
    load.setAccessToken(accessTokens.github);

    // Get or create user information
    User.get(authId)
      // Couldn't find existing user w/authId, so create a new User
      .catch(()=>new User({id:authId, githubUsername, sources:[]}).save())
      .then(user=>this.fire('userRetrieved', user));
  };
}
