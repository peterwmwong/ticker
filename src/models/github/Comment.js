import Model from '../../helpers/model/Model';
import User  from './User';

class Comment extends Model{}
Comment.create($=>{
  $.attr('body',      'datetime');
  $.attr('commitId',  'string');
  $.attr('createdAt', 'datetime');
  $.attr('html_url',  'string');
  $.attr('line',      'number');
  $.attr('path',      'string');
  $.attr('position',  'number');
  $.attr('updatedAt', 'datetime');
  $.attr('url',       'string');

  $.hasOne('user',   'User');
});

export default Comment;
