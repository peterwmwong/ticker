import Model from '../../helpers/model/Model';

class Actor extends Model{}
Actor.create($=>{
  $.attr('login',       'string');
  $.attr('gravatar_id', 'string');
  $.attr('url',         'string');
  $.attr('avatar_url',  'string');
});

export default Actor;
