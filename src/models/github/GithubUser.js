import loadJSON        from '../../helpers/load.js';

export default Basis.Model.extend('GithubUser', function(){
  this.attr('avatar_url', 'string');
  this.attr('login',      'string');
  this.attr('url',        'string');
  this.attr('score',      'number');

  this.mapper = {
    get: model=>
      loadJSON(`https://api.github.com/users/${model.id}`).then(response=>{
        response.id = model.id;
        return response;
      }),

    query: (array, {term})=>
      loadJSON(`https://api.github.com/search/users?q=${term}`).then(({items})=>
        items
      )
  };
});
