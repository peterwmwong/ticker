import Model             from '../../helpers/model/Model';
import GithubEventMapper from './GithubEventMapper';
import GithubUser        from './GithubUser';
import GithubRepo        from './GithubRepo';

class GithubEvent extends Model{}
GithubEvent.create($=>{
  $.mapper = GithubEventMapper;

  $.attr('type',    'string');
  $.attr('payload', 'identity');
  $.attr('createdAt', 'datetime');

  $.hasOne('actor', 'GithubUser');
  $.hasOne('repo',  'GithubRepo');
});

export default GithubEvent;
