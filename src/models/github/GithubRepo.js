import Model from '../../helpers/model/Model';
import GithubRepoMapper from './GithubRepoMapper';

class GithubRepo extends Model{}
GithubRepo.create($=>{
  $.mapper = GithubRepoMapper;

  $.attr('full_name', 'string');
  $.attr('name',      'string');
  $.attr('url',       'string');

  // TODO(pwong): GTFO. This only applies to the search API endpoint.
  //              We should move this out as a sub class, like GithubRepoSearch
  //              or make a GithubSearchResult that is composed of this.
  $.attr('score',    'number');
});

export default GithubRepo;
