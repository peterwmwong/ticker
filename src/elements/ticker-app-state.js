// !!! <MOCKDATA> !!!
  // import MOCK_FIREBASE from '../helpers/MOCK_FIREBASE';
// !!! <MOCKDATA> !!!

import {StateChart, goto, reenter} from '../helpers/svengali';
import User                        from '../models/User';
import EventStream                 from '../models/EventStream';

var appstate = new StateChart({
  attrs:{
    'firebaseRef':()=>new Firebase("https://ticker-test.firebaseio.com")
  },
  enter(){
    // Firebase.onAuth(cb) Calls the cb synchronously, which messes up the
    // statechart trying to transition while in a transition...
    // TODO(pwong): The statechart should be able to handle transition requests
    //              while in a transition.
    setTimeout(()=>{
      this.attrs.firebaseRef.onAuth(authData=>{
        var github = authData && authData.github;
        if(github){
          this.fire('authSuccessful', github.id, github.username,{github:github.accessToken});
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
        'accessTokens':({accessTokens})=>accessTokens
      },
      events:{
        'selectSearch':goto('./search')
      },
      parallelStates:{
        'appDrawer':{
          attrs:{'appDrawerExpanded':({appDrawerExpanded})=>!!appDrawerExpanded},
          events:{
            'selectStream':()=>reenter({appDrawerExpanded:false}),
            'toggleAppDrawer'(){
              return reenter({appDrawerExpanded:!this.attrs.appDrawerExpanded})
            }
          }
        },
        'appView':{
          states:{
            'stream':{
              params:['stream'],
              attrs:{
                'mainView':'stream',
                'stream'({stream}){return stream || this.attrs.user.eventStreams[0]},
                'isStreamFavorited'(){
                  return this.attrs.user.eventStreams.indexOf(this.attrs.stream) !== -1;
                },
              },
              events:{
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
                'selectStream':stream=>goto('../stream', {stream})
              }
            }
          }
        }
      }
    }
  }
});

// TODO(pwong): Only add this in dev
window.appstate = appstate.attrs;

//FIXME: Tests should be able to stop state bootstrapping... or something
if(!('__karma__' in window)) appstate.goto();

export default appstate;
