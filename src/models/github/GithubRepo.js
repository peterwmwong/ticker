import Model from '../../helpers/model/Model';
import GithubRepoMapper from './GithubRepoMapper';

class GithubRepo extends Model{}
GithubRepo.create($=>{
  $.mapper = GithubRepoMapper;
  
  $.attr('fullName', 'string');
  $.attr('name',     'string');
  $.attr('url',      'string');
  $.attr('score',    'number');
});

export default GithubRepo;
