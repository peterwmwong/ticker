import {StateChart, goto} from '../helpers/svengali';
import loggedInState      from './loggedInState';
import loggedOutState     from './loggedOutState';

var appState = new StateChart({
  attrs:{'firebaseRef':()=>new window.Firebase(CONFIG.firebaseUrl)},
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

if(window.CONFIG.statechartTrace){
  appState.rootState.scState.trace = true;
  window.appState = appState;
}

export default appState;
