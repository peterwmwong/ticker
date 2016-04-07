import storage from '../helpers/storage';

const fb = (id)=> new Firebase(`https://ticker-dev.firebaseio.com/users/${id}`);
const store = (user)=> storage.setItemObj(`ticker:User:${user.id}`, user);

export default {
  localGet:(id)=> storage.getItemObj(`ticker:User:${id}`),
  save:(user)=>
    new Promise((resolve, reject)=> {
      fb(user.id).set(user, (err)=> {
        if(err) return reject(err);
        resolve(store({...user}));
      })
    }),
  get:(id)=>
    new Promise((resolve, reject)=> {
      fb(id).once('value', (data)=> {
        const val = data.val();
        if(!val) return reject("Couldn't find User");
        resolve(store(val));
      })
    })
};
