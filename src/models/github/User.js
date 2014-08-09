import Model from '../../helpers/model/Model';

class User extends Model{}
User.create($=>{
  $.attr('avatar_url',  'string');
  $.attr('gravatar_id', 'string');
  $.attr('login',       'string');
  $.attr('url',         'string');
});

export default User;
