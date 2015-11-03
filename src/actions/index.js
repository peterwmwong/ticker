import {USER_LOADED} from './types';
import loadFirebase  from '../helpers/loaders/loadFirebase';
import load          from '../helpers/load';
import User          from '../models/User';

const appSetView = user=>({type:, user});
const userLoaded = user=>({type:USER_LOADED, user});

export const initializeApp = ()=>
  dispatch=>{
    // Wait for Firebase to load
    new Promise(resolve=>{
      const checkForFirebase = ()=>{
        if(window.Firebase){
          resolve(window.Firebase);
          return;
        }
        setTimeout(checkForFirebase, 32);
      };

      loadFirebase();
      checkForFirebase();
    })
    // Auth with Firebase
    .then(Firebase=>new Promise((resolve, reject)=>{
      new Firebase('https://ticker-dev.firebaseio.com').onAuth(authData=>{
        if(authData && authData.github) resolve(authData.github);
        else reject();
      });
    }))
    // Load the User
    .then(({id, username, accessToken})=>{
      // Give load access tokens to use for any third-party API requests.
      // For right now, just Github.
      // TODO(pwong): Split out access tokens into a seperate module?
      load.setAccessToken(accessToken);

      // Get or create user information
      return User.get(id)
        // Couldn't find existing user w/authId, so create a new User
        .catch(()=>new User({id, username, sources:[]}).save());
    })
    .then(user=>{
      dispatch(userLoaded(user));
      dispatch(userLoaded(user));
    });
  };
