import storage from '../helpers/storage';

export default {
  localGet:id=>JSON.parse(storage.getItem(`ticker:User:${id}`) || null),
  save:user=>
    new Promise((resolve, reject)=>
      new Firebase(`https://ticker-dev.firebaseio.com/users/${user.id}`)
        .set(user.toJSON(), (err)=>{
          if(err) return reject(err);
          storage.setItem(`ticker:User:${user.id}`, JSON.stringify(user));
          resolve(user);
        })
    ),
  get:id=>
    new Promise((resolve, reject)=>
      new Firebase(`https://ticker-dev.firebaseio.com/users/${id}`)
        .once('value', data=>{
          const val = data.val();
          if(!val) reject("Couldn't find User");
          storage.setItem(`ticker:User:${val.id}`, JSON.stringify(val));
          resolve(val);
        })
    )
};
