import {goto}           from '../helpers/svengali.js';
import User             from '../models/User.js';

function createUserWithDefaults({id, githubUsername}){
  return new User({
    githubUsername,
    id,
    sources:[]
  }).save();
}

export default {
  attrs:{
    'isLoggedIn': false
  },
  states:{
    'determineAuth':{
      events:{
        'authFailed':goto('../auth'),
        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../retrieveUser', {authId, githubUsername, accessTokens})
      }
    },
    'auth':{
      events:{
        'authWithGithub'(){
          this.attrs.firebaseRef.authWithOAuthPopup('github', _=>_);
        },

        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../retrieveUser', {authId, githubUsername, accessTokens})
      }
    },
    'retrieveUser':{
      enter({authId, githubUsername, accessTokens}){
        return User.get(authId)
          .catch(()=>createUserWithDefaults({id:authId, githubUsername}))
          .then(user=>{
            this.fire('userLoggedIn', user, accessTokens);
          });
      }
    }
  }
};
