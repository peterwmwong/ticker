import loadJSON  from '../../helpers/load';
import {loadAll} from '../../helpers/MapperUtils';
import Model     from '../../helpers/model/Model';

function idToCommitURL(id){
  var [owner, repo, sha] = id.split('/');
  return `https://api.github.com/${owner}/${repo}/commits/${sha}`;
}

class GithubCommitFile extends Model {}
GithubCommitFile.create($=>{
  $.attr('filename',  'string');
  $.attr('status',    'string');
  $.attr('additions', 'number');
  $.attr('deletions', 'number');
  $.attr('changes',   'number');
  $.attr('patch',     'string');
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
      var json = await loadJSON(idToCommitURL(model.id));
      json.id = model.id;
      json.message = model.commit.message;
      return loadAll(array, json);
    }
  };
});

export default GithubCommit;
