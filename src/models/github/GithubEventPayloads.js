import './GithubComment.js';
import './GithubRepo.js';
import './GithubUser.js';

Basis.Model.extend('CommitCommentEvent', ($=this)=>{
  $.hasOne('comment',    'GithubComment');
  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});

Basis.Model.extend('CreateEvent', ($=this)=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});

Basis.Model.extend('DeleteEvent', ($=this)=>{
  $.attr('description',  'string');
  $.attr('masterBranch', 'string');
  $.attr('pusherType',   'string');
  $.attr('ref',          'string');
  $.attr('refType',      'string');

  $.hasOne('repository', 'GithubRepo');
  $.hasOne('sender',     'GithubUser');
});
