import {StateChart, goto, reenter} from '../helpers/svengali';
import User                        from '../models/User';
import EventStream                 from '../models/EventStream';

var appState = new StateChart({
  attrs:{
    'firebaseRef':()=>new Firebase("https://ticker-test.firebaseio.com")
  },
  enter(){
    setTimeout(()=>{
      this.attrs.firebaseRef.onAuth(authData=>{
        var github = authData && authData.github;
        if(github)
          this.fire('authSuccessful', github.id, {github:github.accessToken});
        else
          this.fire('needAuth');
      });
    })
  },
  events:{
    'needAuth':goto('./auth')
  },
  states:{
    'determineAuth':{
      events:{
        'authSuccessful':(authId, accessTokens)=>
          goto('../retrieveUser', {authId, accessTokens})
      }
    },
    'auth':{
      events:{
        'authWithGithub'(){this.attrs.firebaseRef.authWithOAuthPopup("github",()=>{})},
        'authSuccessful':(authId, accessTokens)=>
          goto('../retrieveUser', {authId, accessTokens})
      }
    },
    'retrieveUser':{
      enter({authId, accessTokens}){
        User.get(authId).$promise.
          // If user does not exist yet, create user with no streams.
          catch(e=>new User({id:authId, eventStreams:[]}).$save().$promise).
          then(user=>appState.fire('userRetrieved', user, accessTokens))
      },
      events:{
        'userRetrieved':(user, accessTokens)=>
          goto('../loggedIn', {user, accessTokens})
      }
    },
    'loggedIn':{
      attrs:{
        'user':({user})=>user,
        'accessTokens':({accessTokens})=>accessTokens
      },
      events:{
        'selectSearch':'./search'
      },
      states:{
        'stream':{
          params:['stream'],
          attrs:{
            'mainView':'stream',
            'stream'({stream}){return stream || this.attrs.user.eventStreams[0]}
          },
          events:{
            'selectStream':stream=>reenter({stream})
          }
        },
        'search':{
          attrs:{'mainView':'search'},
          events:{
            'selectStream':stream=>goto('../stream', {stream})
          }
        }
      }
    }
  }
});

//FIXME: Tests should be able to stop state bootstrapping... or something
if(!('__karma__' in window))
  appState.goto();

export default appState;
