// import '../helpers/MOCK_FIREBASE.js';

import {StateChart, goto} from '../helpers/svengali.js';
import loggedInState      from './loggedInState.js';
import loggedOutState     from './loggedOutState.js';

const appState = new StateChart({
  attrs:{
    'firebaseRef':()=>new window.Firebase(window.TICKER_CONFIG.firebaseUrl)
  },
  enter(){
    // Firebase.onAuth(cb) Calls the cb synchronously, which messes up the
    // statechart trying to transition while in a transition...
    // TODO(pwong): The statechart should be able to handle transition requests
    //              while in a transition.
    setTimeout(()=>{
      this.attrs.firebaseRef.onAuth(authData=>{
        const github = authData && authData.github;
        if(github){
          this.fire('authSuccessful', github.id, github.username, {github:github.accessToken});
        }
        else{
          this.fire('authFailed');
        }
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
// if(!('__karma__' in window)) appState.goto();
appState.rootState.scState.trace = true;
appState.goto();

class SyncState {
  constructor(mapping){
    this.mapping = mapping;
  }

  attached(){
    for(let key in this.mapping){
      this[key] = appState.attrs[key];
    }
    this._boundOnAppStateChange = this._boundOnAppStateChange || function(attrName, value){
      if(attrName in this.mapping){
        this[attrName] = appState.attrs[attrName];
      }
    }.bind(this);
    appState.onAttrChange(this._boundOnAppStateChange);
  }

  detached(){
    appState.offAttrChange(this._boundOnAppStateChange);
  }
}

window.SyncState = SyncState;
window.appState = appState;

export default appState;
