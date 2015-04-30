/*

  Statechart for the authenticating and managing the user's information.

*/
import {goto} from '../helpers/svengali.js';
import load   from '../helpers/load.js';
import User   from '../models/User.js';

export default {
  attrs:{
    'firebaseRef':()=>new window.Firebase(window.TICKER_CONFIG.firebaseUrl),
  },
  states:{
    'determineAuth':{
      enter(){
        // Firebase.onAuth(cb) Calls the cb synchronously, which messes up the
        // statechart trying to transition while in a transition...
        // TODO(pwong): The statechart should be able to handle transition requests
        //              while in a transition.
        setTimeout(()=>
          this.attrs.firebaseRef.onAuth(authData=>{
            const github = authData && authData.github;
            if(github){
              this.fire('authSuccessful', github.id, github.username, {github:github.accessToken});
            }
            else{
              this.fire('authFailed');
            }
          })
        );
      },
      events:{
        'authFailed':goto('../waitingToAuth'),
        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../getOrCreateUser', {authId, githubUsername, accessTokens})
      }
    },
    'waitingToAuth':{
      events:{
        'authWithGithub'(){
          this.attrs.firebaseRef.authWithOAuthPopup('github', _=>_);
        },
        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../getOrCreateUser', {authId, githubUsername, accessTokens})
      }
    },
    'getOrCreateUser':{
      enter({authId, githubUsername, accessTokens}){
        // Give load access tokens to use for any third-party API requests.
        // For right now, just Github.
        // TODO(pwong): Split out access tokens into a seperate module?
        load.accessToken = accessTokens.github;

        // Get or create user information
        User.get(authId)
          // Couldn't find existing user w/authId, so create a new User
          .catch(()=>new User({id:authId, githubUsername, sources:[]}).save())
          .then(user=>this.fire('userRetrieved', user));
      },
      events:{
        'userRetrieved':user=>goto('../ready', {user})
      }
    },
    'ready':{
      params:['user'],
      attrs:{
        user:({user})=>user
      },
      enter(){ this.fire('userReady', this.attrs.user); }
    }
  }
};
