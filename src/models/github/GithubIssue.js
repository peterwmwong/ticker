import loadJSON  from '../../helpers/load.js';

export default Basis.Model.extend('GithubIssued', function(){
  this.attr('created_at',  'datetime');
  this.attr('title',  'string');
  this.attr('body',   'string');
  this.attr('number', 'number');
  this.attr('state',  'string');

  this.hasOne('user', 'GithubUser');

  this.mapper = {
    query: (array, {repo})=>
      loadJSON(`https://api.github.com/repos/${repo}/issues`)
  };
});
