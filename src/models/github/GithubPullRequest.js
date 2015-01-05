import loadJSON          from '../../helpers/load.js';
import {loadAll}         from '../../helpers/MapperUtils.js';
import Model             from '../../helpers/model/Model.js';
import GithubEventMapper from './GithubEventMapper.js';
import GithubIssue       from './GithubIssue.js';
import GithubUser        from './GithubUser.js';

class GithubPullRequest extends Model{
  getComments(){throw 'NOT IMPLEMENTED'}
}
GithubPullRequest.create($=>{
  $.mapper = {
    query: async (array, {repo})=>
      loadAll(array, await loadJSON(`https://api.github.com/repos/${repo}/pulls`))
  };

  $.attr('created_at',  'datetime');
  $.attr('title',  'string');
  $.attr('body',   'string');
  $.attr('number', 'number');
  $.attr('state',  'string');

  $.hasOne('user', 'GithubUser');
});

export default GithubPullRequest;
