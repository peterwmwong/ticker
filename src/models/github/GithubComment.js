import Model from '../../helpers/model/Model';
import GithubUser  from './GithubUser';

class GithubComment extends Model{}
Github.create($=>{
  $.attr('body',      'datetime');
  $.attr('commitId',  'string');
  $.attr('createdAt', 'datetime');
  $.attr('html_url',  'string');
  $.attr('line',      'number');
  $.attr('path',      'string');
  $.attr('position',  'number');
  $.attr('updatedAt', 'datetime');
  $.attr('url',       'string');

  $.hasOne('user', 'GithubUser');
});

export default GithubComment;
