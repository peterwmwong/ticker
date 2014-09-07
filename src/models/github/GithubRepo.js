import Model from '../../helpers/model/Model';

class GithubRepo extends Model{}
GithubRepo.create($=>{
  $.attr('name', 'string');
  $.attr('url', 'string');
});

export default GithubRepo;
