import {goto, reenter} from '../helpers/svengali';
import User            from '../models/User';
import EventStream     from '../models/EventStream';

export default {
  states:{
    'determineAuth':{
      events:{
        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../retrieveUser', {authId, githubUsername, accessTokens})
      }
    },
    'auth':{
      events:{
        'authWithGithub':()=>
          this.attrs.firebaseRef.authWithOAuthPopup("github", _=>_),

        'authSuccessful':(authId, githubUsername, accessTokens)=>
          goto('../retrieveUser', {authId, githubUsername, accessTokens})
      }
    },
    'retrieveUser':{
      async enter({authId, githubUsername, accessTokens}){
        var user = User.get(authId);
        try{
          await user.$promise
        }catch(e){
          // If the user does not exist yet, create the user with atleast one
          // stream.
          user = await createUserWithDefaults({id:authId, githubUsername});
        }
        this.fire('userRetrieved', user, accessTokens);
      }
    }
  }
};

function createUserWithDefaults({id, githubUsername}){
  return new User({
    githubUsername,
    id,
    eventStreams:[
      EventStream.load({
        type:'github',
        id:'users:2159051',
        config:{
          type:'users',
          users:'Polymer'
        }
      })
    ]
  }).$save().$promise;
}
