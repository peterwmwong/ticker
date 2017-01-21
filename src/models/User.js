import storage from '../helpers/storage';

const LAST_LOGIN_ID_STORAGE_KEY = 'ok:lastLoggedInUserId';
const fb = id => firebase.database().ref('users/' + id);
const store = user => storage.setItemObj(`ok:${user.id}`, user);

export default {
  current(){
    const lastLoginId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
    if(!lastLoginId) return;
    return this.localGet(lastLoginId);
  },
  setCurrent: id => storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id),
  unsetCurrent(){
    const user = this.current();
    if(!user) return;
    storage.setItemObj(`ok:${user.id}`, '');
    storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, '');
  },
  localGet: id => storage.getItemObj(`ok:${id}`),
  save: user =>
    new Promise((resolve, reject) => {
      fb(user.id).set(user, err => {
        if(err) return reject(err);
        resolve(store({ ...user }));
      })
    }),
  get: id =>
    new Promise((resolve, reject) => {
      fb(id).once('value', data => {
        const val = data.val();
        if(!val) return reject("Couldn't find User");
        resolve(store(val));
      })
    })
};
