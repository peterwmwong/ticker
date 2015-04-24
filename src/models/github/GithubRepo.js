import GithubRepoMapper from './GithubRepoMapper.js';

export default Basis.Model.extend('GithubRepo', function(){
  this.mapper = GithubRepoMapper;

  this.attr('full_name', 'string');
  this.attr('name',      'string');
  this.attr('url',       'string');

  // TODO(pwong): GTFO. This only applies to the search API endpoint.
  //              We should move this out as a sub class, like GithubRepoSearch
  //              or make a GithubSearchResult that is composed of this.
  this.attr('score',    'number');
});
