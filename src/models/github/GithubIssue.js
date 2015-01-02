import loadJSON  from '../../helpers/load.js';
import {loadAll} from '../../helpers/MapperUtils.js';
import Model     from '../../helpers/model/Model.js';

class GithubIssue extends Model{}
GithubIssue.create($=>{
  $.attr('created_at',  'datetime');
  $.attr('title',  'string');
  $.attr('body',   'string');
  $.attr('number', 'number');
  $.attr('state',  'string');

  $.hasOne('user', 'GithubUser');

  $.mapper = {
    query: async (array, {repo})=>
      loadAll(array, await loadJSON(`https://api.github.com/repos/${repo}/issues`))
  };
});

export default GithubIssue;
