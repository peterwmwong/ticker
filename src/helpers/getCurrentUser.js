import load       from './load';
import loadScript from './loaders/loadScript';
import User       from '../models/User';
import storage    from '../helpers/storage';

const FIREBASEURL = 'https://ticker-dev.firebaseio.com';
const LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
let currentUser = null;

const loadFirebase = ()=>
  new Promise((resolve)=> {
    setTimeout(()=> {
      loadScript('../vendor/firebase/firebase.js')
        .then(resolve);
    }, 500)
  })

const authWithFirebase = ()=>
  new Promise((resolve, reject)=> {
    new Firebase(FIREBASEURL).onAuth((authData)=> {
      if(authData && authData.github) resolve(authData);
      else reject('Firebase auth failed');
    });
  });

const getOrCreateUser = ({github: {id, username, accessToken}})=> (
  // Give load access tokens to use for any third-party API requests.
  // For right now, just Github.
  // TODO(pwong): Split out access tokens into a seperate module?
  load.setAccessToken(accessToken),

  // Get or create user information
  User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(()=> User.save({id, username, sources:[]}))
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
  .then(getOrCreateUser);

export const getPreviousUser = ()=> {
  const lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  if(lastUserId) return User.localGet(lastUserId);
}

let userListener = ()=> { };
const toggleSource = (type, id)=> {
  if(!currentUser) return;
  const {sources:{github, github:{[type]:list}}} = currentUser;
  const index = list.map((s)=> s.id).indexOf(id);
  if(index > -1){
    list.splice(index, 1);
    github[type] = [...list];
  }
  else{
    github[type] = list.concat({id});
  }

  User.save(currentUser).then((user)=> {
    currentUser = user;
    userListener(currentUser);
  });
}

export const toggleUserSource = toggleSource.bind(null, 'users');
export const toggleRepoSource = toggleSource.bind(null, 'repos');

export const getCurrentUser = (cb=()=> {})=> {
  userListener = cb;
  if(currentUser) return currentUser;

  loadFirebase()
    .then(authWithFirebase)
    .then(getOrCreateUser)
    .catch(()=> null)
    .then(userListener);

  const prevUser = getPreviousUser();
  if(prevUser) return prevUser;
};
