import Model         from '../../helpers/model/Model.js';
import GithubComment from './GithubComment.js';
import GithubRepo    from './GithubRepo.js';
import GithubUser    from './GithubUser.js';

export class CommitCommentEvent extends Model{}
CommitCommentEvent.create($=>{
  $.hasOne('comment',    'GithubComment');
  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});


export class CreateEvent extends Model{}
CreateEvent.create($=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});


export class DeleteEvent extends Model{}
DeleteEvent.create($=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});
