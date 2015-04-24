import GithubEventMapper from './GithubEventMapper.js';
import './GithubUser.js';
import './GithubRepo.js';

export default Basis.Model.extend('GithubEvent', function(){
  this.mapper = GithubEventMapper;

  this.attr('type',       'string');
  this.attr('payload',    'identity');
  this.attr('created_at', 'datetime');

  this.hasOne('actor', 'GithubUser');
  this.hasOne('repo',  'GithubRepo');
});
