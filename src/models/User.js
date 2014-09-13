import Model from '../helpers/model/Model';
import EventStream from './EventStream';

class User extends Model {}

User.create($=>{
  $.mapper = {
    create: (user)=>
      new Promise((resolve, reject)=>
        new Firebase(`https://ticker-test.firebaseio.com/users/${user.id}`)
          .set(
            {
              id: user.id,
              eventStreams: user.eventStreams.map(es=>es.$attrs())
            },
            (error)=>{
              if(error) reject(error);
              else resolve(user);
            }
          )
      ),
    get: (user)=>
      new Promise((resolve, reject)=>
        new Firebase(`https://ticker-test.firebaseio.com/users/${user.id}`).
          once('value', (data)=>{
            var val = data.val();
            if(val) resolve(user.$load(val));
            else reject("Couldn't find User");
          })
      )
  };
  $.hasMany('eventStreams','EventStream');
});

export default User;
