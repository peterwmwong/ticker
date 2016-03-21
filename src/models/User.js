import storage from '../helpers/storage';

export default {
  localGet:(id)=> storage.getItemObj(`ticker:User:${id}`),
  save:(user)=>
    new Promise((resolve, reject)=>
      new Firebase(`https://ticker-dev.firebaseio.com/users/${user.id}`)
        .set(user.toJSON(), (err)=> {
          if(err) return reject(err);
          resolve(storage.setItemObj(`ticker:User:${user.id}`, user));
        })
    ),
  get:(id)=>
    new Promise((resolve, reject)=>
      new Firebase(`https://ticker-dev.firebaseio.com/users/${id}`)
        .once('value', (data)=> {
          const val = data.val();
          if(!val) reject("Couldn't find User");
          resolve(storage.setItemObj(`ticker:User:${val.id}`, val));
        })
    )
};
