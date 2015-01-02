import Model             from '../../helpers/model/Model.js';
import GithubEventMapper from './GithubEventMapper.js';
import GithubUser        from './GithubUser.js';
import GithubRepo        from './GithubRepo.js';
import GithubIssue       from './GithubIssue.js';

class GithubEvent extends Model{
  fetchDetails(){
    GithubIssue.get();
  }
}
GithubEvent.create($=>{
  $.mapper = GithubEventMapper;

  $.attr('type',       'string');
  $.attr('payload',    'identity');
  $.attr('created_at', 'datetime');

  $.hasOne('actor', 'GithubUser');
  $.hasOne('repo',  'GithubRepo');
});

export default GithubEvent;
