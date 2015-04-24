import loadJSON          from '../../helpers/load.js';
import {loadAll}         from '../../helpers/MapperUtils.js';
import './GithubEventMapper.js';
import './GithubIssue.js';
import './GithubUser.js';

export default Basis.Model.extend('GithubPullRequest', function(){
  this.mapper = {
    query: (array, {repo})=>
      new Promise(resolve=>
        loadJSON(`https://api.github.com/repos/${repo}/pulls`).then(result=>
          resolve(loadAll(array, result))
        )
      )
  };

  this.attr('created_at',  'datetime');
  this.attr('title',  'string');
  this.attr('body',   'string');
  this.attr('number', 'number');
  this.attr('state',  'string');

  this.hasOne('user', 'GithubUser');
});
