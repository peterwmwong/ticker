import {goto}           from '../helpers/svengali.js';
import User             from '../models/User.js';
import GithubUserSource from '../models/sources/GithubUserSource.js';

function createUserWithDefaults({id, githubUsername}){
  return new User({
    githubUsername,
    id,
    sources:[
      new GithubUserSource({login:`Polymer`}),
      new GithubUserSource({login:`web-animations`})
    ]
  }).save();
}

export default {
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
