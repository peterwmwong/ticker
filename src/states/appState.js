// !!! <MOCKDATA> !!!
  // import MOCK_FIREBASE from '../helpers/MOCK_FIREBASE';
// !!! <MOCKDATA> !!!

import {StateChart, goto, reenter} from '../helpers/svengali';
import load                        from '../helpers/load';
import User                        from '../models/User';
import EventStream                 from '../models/EventStream';

var appState;
export default appState = new StateChart({
  attrs:{'firebaseRef':()=>new Firebase("https://ticker-test.firebaseio.com")},
  enter(){
    // Firebase.onAuth(cb) Calls the cb synchronously, which messes up the
    // statechart trying to transition while in a transition...
    // TODO(pwong): The statechart should be able to handle transition requests
    //              while in a transition.
    setTimeout(()=>{
      this.attrs.firebaseRef.onAuth(authData=>{
        var github = authData && authData.github;
        if(github){
          this.fire('authSuccessful', github.id, github.username, {github:github.accessToken});
        }else
          this.fire('needAuth');
      });
    })
  },
  events:{
    'needAuth':goto('./loggedOut/auth')
  },
  states:{
    'loggedOut':{
      states:{
        'determineAuth':{
          events:{
            'authSuccessful':(authId, githubUsername, accessTokens)=>
              goto('../retrieveUser', {authId, githubUsername, accessTokens})
          }
        },
        'auth':{
          events:{
            'authWithGithub'(){this.attrs.firebaseRef.authWithOAuthPopup("github",()=>{})},
            'authSuccessful':(authId, githubUsername, accessTokens)=>
              goto('../retrieveUser', {authId, githubUsername, accessTokens})
          }
        },
        'retrieveUser':{
          async enter({authId, githubUsername, accessTokens}){
            var user = User.get(authId);
            try{await user.$promise}
            // If the user does not exist yet, create the user with atleast one
            // stream.
            catch(e){
              user = await new User({
                githubUsername,
                id:authId,
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
            this.fire('userRetrieved', user, accessTokens);
          },
          events:{
            'userRetrieved':(user, accessTokens)=>
              goto('../../loggedIn', {user, accessTokens})
          }
        }
      }
    },
    'loggedIn':{
      attrs:{
        'user':({user})=>user,
        'accessTokens':({accessTokens})=>{
          // TODO: This is to break a cycle between:
          //         *appState* ->
          //         EventStrea ->
          //         GithubEvent ->
          //         GithubEventMapper ->
          //         load ->
          //         *appState*
          load.accessToken = accessTokens.github;
          return accessTokens;
        }
      },
      parallelStates:{
        'appDrawer':{
          attrs:{'appDrawerOpened':({appDrawerOpened})=>!!appDrawerOpened},
          events:{
            'selectSearch, selectStream':reenter({appDrawerOpened:false}),
            'toggleAppDrawer'(){
              return reenter({appDrawerOpened:!this.attrs.appDrawerOpened})
            }
          }
        },
        'appView':{
          states:{
            'stream':{
              attrs:{
                'isStreamFavorited'(){
                  return this.attrs.user.eventStreams.indexOf(this.attrs.stream) !== -1;
                },
                'mainView':'stream',
                'stream'({stream}){return stream || this.attrs.user.eventStreams[0]},
                'streamEvents'(){return this.attrs.stream.events().$promise}
              },
              events:{
                'selectSearch':goto('../search'),
                'selectStream':stream=>reenter({stream}),
                'toggleFavoriteStream'(){
                  var {user, stream} = this.attrs;
                  user[`${this.attrs.isStreamFavorited ? 'remove': 'add'}EventStreams`](stream)
                  user.$save();
                  return reenter({stream});
                }
              }
            },
            'search':{
              attrs:{'mainView':'search'},
              events:{
                'selectStream':(stream)=>goto('../stream', {stream})
              }
            }
          }
        }
      }
    }
  }
});

// TODO(pwong): Only add this in dev
window.appState = appState;

//FIXME: Tests should be able to stop state bootstrapping... or something
if(!('__karma__' in window)) appState.goto();
