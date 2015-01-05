import {StateChart, goto} from '../helpers/svengali.js';
import loggedInState      from './loggedInState.js';
import loggedOutState     from './loggedOutState.js';

var appState = new StateChart({
  attrs:{
    'firebaseRef':()=>new window.Firebase(CONFIG.firebaseUrl),
    'DRAWER_SWIPE_DISABLED': !/Chrome/.test(window.navigator.userAgent) &&
      /AppleWebKit.*Mobile.*Safari/.test(window.navigator.userAgent)
  },
  enter(){
    // Firebase.onAuth(cb) Calls the cb synchronously, which messes up the
    // statechart trying to transition while in a transition...
    // TODO(pwong): The statechart should be able to handle transition requests
    //              while in a transition.
    setTimeout(()=>{
      this.attrs.firebaseRef.onAuth(authData=>{
        var github = authData && authData.github;
        if(github)
          this.fire('authSuccessful', github.id, github.username, {github:github.accessToken});
        else
          this.fire('authFailed');
      });
    });
  },
  events:{
    'userLoggedIn':(user, accessTokens)=>goto('loggedIn', {user, accessTokens})
  },
  states:{
    'loggedOut':loggedOutState,
    'loggedIn' :loggedInState
  }
});


//FIXME: Tests should be able to stop state bootstrapping... or something
if(!('__karma__' in window)) appState.goto();

if(window.CONFIG && window.CONFIG.statechartTrace){
  appState.rootState.scState.trace = true;
  window.appState = appState;
}

export default appState;
