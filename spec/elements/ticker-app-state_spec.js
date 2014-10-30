// import {StateChart, attrValue, goto} from 'base/build/helpers/svengali';
// // import appState from 'base/build/elements/ticker-app-state';
//
// describe('elements/ticker-app-state', ()=>{
//
//   it('yolo', done=>{
//     var sc = new StateChart({
//       attrs:{
//         'firebaseRef':()=>({onAuth(cb){ Promise.resolve().then(cb) }})
//       },
//       enter(){
//         this.attrs.firebaseRef.onAuth(authData=>{
//           var github = authData && authData.github;
//           if(github)
//             this.fire('authSuccessful', github.id, {github:github.accessToken});
//           else
//             this.fire('needAuth');
//         });
//       },
//       events:{
//         'needAuth':goto('./auth')
//       },
//       states:{
//         'determineAuth':{
//           events:{
//             'authSuccessful':(authId, accessTokens)=>
//               goto('./retrieveUser', {authId, accessTokens})
//           }
//         },
//         'auth':{
//           events:{
//             'attemptAuth'(){this.attrs.firebaseRef.authWithOAuthPopup("github")},
//             'authSuccessful':(authId, accessTokens)=>
//               goto('./retrieveUser', {authId, accessTokens})
//           }
//         }
//       }
//     });
//     // var sc = new StateChart({
//     //   states:{
//     //     'determineAuth':{},
//     //     'auth':{}
//     //   }
//     // })
//     sc.goto();
//   });
//
// });
