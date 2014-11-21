import {goto}           from '../helpers/svengali';
import User             from '../models/User';
import Source           from '../models/sources/Source';
import GithubUserSource from '../models/sources/GithubUserSource';

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
          this.attrs.firebaseRef.authWithOAuthPopup("github", _=>_)
        },

        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../retrieveUser', {authId, githubUsername, accessTokens})
      }
    },
    'retrieveUser':{
      async enter({authId, githubUsername, accessTokens}){
        var user = User.get(authId);
        try{
          await user.$promise;
        }catch(e){
          // If the user does not exist yet, create the user with atleast one
          // stream.
          user = await createUserWithDefaults({id:authId, githubUsername});
        }
        this.fire('userLoggedIn', user, accessTokens);
      }
    }
  }
};

function createUserWithDefaults({id, githubUsername}){
  return new User({
    githubUsername,
    id,
    sources:[
      new GithubUserSource({login:`Polymer`}),
      new GithubUserSource({login:`web-animations`})
    ]
  }).$save().$promise;
}
