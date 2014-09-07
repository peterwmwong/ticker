import Model from '../../helpers/model/Model';
import UserMapper from './UserMapper';

class User extends Model{}
User.create($=>{
  $.mapper = UserMapper;

  $.attr('avatarUrl',  'string');
  $.attr('gravatarId', 'string');
  $.attr('login',       'string');
  $.attr('url',         'string');
});

export default User;
