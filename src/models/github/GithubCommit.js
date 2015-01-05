import loadJSON  from '../../helpers/load.js';
import {load} from '../../helpers/MapperUtils.js';
import Model     from '../../helpers/model/Model.js';

class GithubCommitFile extends Model {}
GithubCommitFile.create($=>{
  $.attr('filename',     'string');
  $.attr('status',       'string');
  $.attr('additions',    'number');
  $.attr('deletions',    'number');
  $.attr('linesChanged', 'number');
  $.attr('patch',        'string');
});

class GithubCommit extends Model{}
GithubCommit.create($=>{
  $.attr('created_at',  'datetime');
  $.attr('message',     'string');
  $.attr('sha',         'string');
  $.attr('stats',       'identity');

  $.hasOne('author',    'GithubUser');
  $.hasOne('committer', 'GithubUser');

  $.hasMany('files',    'GithubCommitFile');

  $.mapper = {
    get: async (model)=>{
      let json = await loadJSON(model.id);
      json.id = model.id;
      json.message = json.commit.message;

      // Map JSON to GithubCommitFile Model
      //  - sha -> id
      //  - changes -> linesChanged (`changes` is already taken to track model changes)
      for(let file of json.files){
        file.id = file.sha;
        file.linesChanged = file.changes;
        delete file.changes;
      }
      return load(model, json);
    }
  };
});

export default GithubCommit;
