import load         from './load';
import loadFirebase from './loaders/loadFirebase';
import User         from '../models/User';
import storage      from '../helpers/storage';

const FIREBASEURL = 'https://ticker-dev.firebaseio.com';
const LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
let currentUser = null;

const waitForFirebase = (props, state, actions)=>
  new Promise(resolve=>{
    const checkForFirebase = ()=>{
      if(window.Firebase) return resolve(new Firebase(FIREBASEURL));
      setTimeout(checkForFirebase, 32);
    };

    loadFirebase();
    checkForFirebase();
  });

const authWithFirebase = firebaseRef=>
  new Promise((resolve, reject)=>{
    firebaseRef.onAuth(authData=>{
      if(authData && authData.github) return resolve(authData.github);
      reject();
    });
  });

const getOrCreateUser = ({id, username, accessToken})=>{
  // Give load access tokens to use for any third-party API requests.
  // For right now, just Github.
  // TODO(pwong): Split out access tokens into a seperate module?
  load.setAccessToken(accessToken);

  // Get or create user information
  return User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(()=>new User({id, username, sources:[]}).save())
    .then(user=>{
      storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id);
      return currentUser = user;
    });
};

export const authWithOAuthPopup = ()=>
  new Promise((resolve, reject)=>{
    new Firebase(FIREBASEURL).authWithOAuthPopup('github', (error, github)=>{
      if(error) return reject()
      resolve(github);
    });
  })
  .then(authData=>getOrCreateUser(authData.github));

export const getCurrentUser = ()=>{
  if(currentUser) return Promise.resolve(currentUser);

  const lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  const lastUser   = lastUserId && User.localGet(lastUserId);
  if(lastUser){
    currentUser = lastUser;
    return Promise.resolve(currentUser);
  }

  return waitForFirebase()
    .then(authWithFirebase)
    .then(getOrCreateUser)
    .catch(e=>{
      // Auth failed
    });
};
