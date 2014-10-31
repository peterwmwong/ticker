import Model from '../helpers/model/Model';
import EventStream from './EventStream';

class User extends Model {}
function updateCreate(user){
  return new Promise((resolve, reject)=>
    new Firebase(`https://ticker-test.firebaseio.com/users/${user.id}`).set({
      id: user.id,
      githubUsername: user.githubUsername,
      eventStreams: user.eventStreams.map(es=>es.$attrs())
    },(error)=>error ? reject(error) : resolve(user))
  );
}
User.create($=>{
  $.attr('githubUsername', 'string');
  $.hasMany('eventStreams','EventStream');

  $.mapper = {
    create: updateCreate,
    update: updateCreate,
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
});

export default User;
