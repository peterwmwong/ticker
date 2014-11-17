import loadJSON        from '../../helpers/load';
import {load, loadAll} from '../../helpers/MapperUtils';
import Model           from '../../helpers/model/Model';

class GithubUser extends Model{}
GithubUser.create($=>{
  $.attr('avatarUrl',  'string');
  $.attr('gravatarId', 'string');
  $.attr('login',      'string');
  $.attr('url',        'string');
  $.attr('score',      'number');

  $.mapper = {
    get:model=>
      loadJSON(`https://api.github.com/users/${model.id}`)
        .then(data=>load(model, data)),

    query:(array, {term})=>
      (
        loadJSON(`https://api.github.com/search/users?q=${term}`)
        // Promise.resolve(QueryMOCKDATA)
      ).then(({items})=>loadAll(array, items))
  };
});

export default GithubUser;
