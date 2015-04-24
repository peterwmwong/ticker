import loadJSON  from '../../helpers/load.js';

Basis.Model.extend('GithubCommitFile', function(){
  this.attr('filename',     'string');
  this.attr('status',       'string');
  this.attr('additions',    'number');
  this.attr('deletions',    'number');
  this.attr('linesChanged', 'number');
  this.attr('patch',        'string');
});

export default Basis.Model.extend('GithubCommit', function(){
  this.attr('created_at',  'datetime');
  this.attr('message',     'string');
  this.attr('sha',         'string');
  this.attr('stats',       'identity');

  this.hasOne('author',    'GithubUser');
  this.hasOne('committer', 'GithubUser');

  this.hasMany('files',    'GithubCommitFile');

  this.mapper = {
    get: ({id})=>
      loadJSON(id).then(json=>{
        json.id = id;
        json.message = json.commit.message;

        // Map JSON to GithubCommitFile Model
        //  - sha -> id
        //  - changes -> linesChanged (`changes` is already taken to track model changes)
        for(let file of json.files){
          file.id = file.sha;
          file.linesChanged = file.changes;
          delete file.changes;
        }
        return json;
      })
  };
});
