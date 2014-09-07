import Model from '../helpers/model/Model';
import EventStream from './EventStream';

class User extends Model {
  eventStreams(){
    // TODO(pwong): TEMPORARY! Will eventually hit a user/${user.id}/event-streams
    return EventStream.query();
  }
}

User.create($=>{
  $.attr('login', 'string');
  $.attr('name', 'string');
  $.hasMany('eventStreams','EventStream');
});

export default User;
