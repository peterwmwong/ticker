import load       from './load';
import loadScript from './loaders/loadScript';
import User       from '../models/User';
import storage    from '../helpers/storage';

const FIREBASEURL = 'https://ticker-dev.firebaseio.com';
const LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
let currentUser = null;

const loadFirebase = () =>
  new Promise(resolve => {
    setTimeout(() => {
      loadScript('../vendor/firebase/firebase.js')
        .then(resolve);
    }, 500)
  })

const authWithFirebase = () =>
  new Promise((resolve, reject) => {
    new Firebase(FIREBASEURL).onAuth(authData => {
      if(authData && authData.github) resolve(authData);
      else reject('Firebase auth failed');
    });
  });

const getOrCreateUser = ({github: {id, username, accessToken}}) => (
  // Give load access tokens to use for any third-party API requests.
  // For right now, just Github.
  // TODO(pwong): Split out access tokens into a seperate module?
  load.setAccessToken(accessToken),

  // Get or create user information
  User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(() => User.save({id, username, sources:[]}))
    .then(user => (
      storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id),
      (currentUser = user)
    ))
);

export const authWithOAuthPopup = () =>
  new Promise((resolve, reject) => {
    new Firebase(FIREBASEURL).authWithOAuthPopup('github', (error, github) => {
      if(error) reject();
      else resolve(github);
    });
  })
  .then(getOrCreateUser);

export const getPreviousUser = () => {
  const lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  if(lastUserId) return User.localGet(lastUserId);
}

let userListener = () => { };
const toggleSource = (type, id) => {
  if(!currentUser) return;
  const {sources:{github, github:{[type]:l}}} = currentUser;
  const index = l.map(s => s.id).indexOf(id);
  github[type] = index > -1 ? (l.splice(index, 1), [...l]) : l.concat({id});

  User.save(currentUser).then(user => {
    currentUser = user;
    userListener(currentUser);
  });
}

export const toggleUserSource = id => toggleSource('users', id);
export const toggleRepoSource = id => toggleSource('repos', id);

export const getCurrentUser = cb => {
  if(currentUser) return currentUser;

  loadFirebase()
    .then(authWithFirebase)
    .then(getOrCreateUser)
    .catch(() => {})
    .then(userListener = cb || userListener);

  return getPreviousUser();
};
