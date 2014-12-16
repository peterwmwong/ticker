import loadJSON          from '../../helpers/load';
import {load, loadAll}   from '../../helpers/MapperUtils';
import Model             from '../../helpers/model/Model';
import GithubEventMapper from './GithubEventMapper';
import GithubIssue       from './GithubIssue';
import GithubUser        from './GithubUser';

class GithubPullRequest extends Model{
  getComments(){throw 'NOT IMPLEMENTED'}
}
GithubPullRequest.create($=>{
  $.mapper = {
    query: async (array, {repo})=>
      loadAll(array, await loadJSON(`https://api.github.com/repos/${repo}/pulls`))
  };

  $.attr('title',  'string');
  $.attr('body',   'string');
  $.attr('number', 'number');
  $.attr('state',  'string');
  $.attr('locked', 'boolean');

  $.hasOne('issue', 'GithubIssue');
  $.hasOne('user', 'GithubUser');
});

export default GithubPullRequest;
