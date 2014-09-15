import Model from '../../helpers/model/Model';
import GithubUserMapper from './GithubUserMapper';

class GithubUser extends Model{}
GithubUser.create($=>{
  $.mapper = GithubUserMapper;

  $.attr('avatarUrl',  'string');
  $.attr('gravatarId', 'string');
  $.attr('login',      'string');
  $.attr('url',        'string');
  $.attr('score',      'number');
});

export default GithubUser;
