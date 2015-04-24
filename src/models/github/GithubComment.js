export default Basis.Model.extend('GithubCommitFile', ()=>{
  let $ = this;
  $.attr('url',        'string');
  $.attr('body',       'string');

  // Comment on source
  $.attr('commit_id',  'string');
  $.attr('line',       'number');
  $.attr('path',       'string');
  $.attr('position',   'number');

  $.attr('created_at', 'datetime');
  $.attr('updated_at', 'datetime');

  $.hasOne('user',     'GithubUser');
});
