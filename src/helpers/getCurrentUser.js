import load         from './load';
import loadFirebase from './loaders/loadFirebase';
import User         from '../models/User';
import storage      from '../helpers/storage';

const FIREBASEURL = 'https://ticker-dev.firebaseio.com';
const LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
let currentUser = null;

const waitForFirebase = ()=>
  new Promise((resolve)=> {
    const checkForFirebase = ()=> {
      if(window.Firebase) resolve(new Firebase(FIREBASEURL));
      else setTimeout(checkForFirebase, 32);
    };

    setTimeout(()=> {
      loadFirebase();
      setTimeout(checkForFirebase, 100);
    }, 500); // Add Firebase in a way that doesn't block first paint
  });

const authWithFirebase = (firebaseRef)=>
  new Promise((resolve, reject)=> {
    firebaseRef.onAuth((authData)=> {
      if(authData && authData.github) resolve(authData.github);
      else reject('Firebase auth failed');
    });
  });

const getOrCreateUser = ({id, username, accessToken})=> (
  // Give load access tokens to use for any third-party API requests.
  // For right now, just Github.
  // TODO(pwong): Split out access tokens into a seperate module?
  load.setAccessToken(accessToken),

  // Get or create user information
  User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(()=> new User({id, username, sources:[]}).save())
    .then((user)=> (
      storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id),
      (currentUser = user)
    ))
);

export const authWithOAuthPopup = ()=>
  new Promise((resolve, reject)=> {
    new Firebase(FIREBASEURL).authWithOAuthPopup('github', (error, github)=> {
      if(error) reject();
      else resolve(github);
    });
  })
  .then((authData)=> getOrCreateUser(authData.github));

export const getPreviousUser = ()=> {
  const lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  if(lastUserId) return User.localGet(lastUserId);
}

export const getCurrentUser = ()=>
  currentUser ? Promise.resolve(currentUser)
    : waitForFirebase()
        .then(authWithFirebase)
        .then(getOrCreateUser);
