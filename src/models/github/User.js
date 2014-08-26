import Model from '../../helpers/model/Model';

class User extends Model{}
User.create($=>{
  $.attr('avatarUrl',  'string');
  $.attr('gravatarId', 'string');
  $.attr('login',       'string');
  $.attr('url',         'string');
});

export default User;
