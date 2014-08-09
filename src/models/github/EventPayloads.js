import Model   from '../../helpers/model/Model';
import Comment from './Comment';
import Repo    from './Repo';
import User    from './User';

export class CommitCommentEvent extends Model{}
CommitCommentEvent.create($=>{
  $.hasOne('comment',    'Comment');
  $.hasOne('repository', 'Repo');
  $.hasOne('sender',     'User');
});


export class CreateEvent extends Model{}
CreateEvent.create($=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'Repo');
  $.hasOne('sender',     'User');
});


export class DeleteEvent extends Model{}
DeleteEvent.create($=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'Repo');
  $.hasOne('sender',     'User');
});
