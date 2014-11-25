import loadJSON        from '../../helpers/load';
import {load, loadAll} from '../../helpers/MapperUtils';
import Model           from '../../helpers/model/Model';

class GithubUser extends Model{}
GithubUser.create($=>{
  $.attr('avatar_url', 'string');
  $.attr('login',      'string');
  $.attr('url',        'string');
  $.attr('score',      'number');

  $.mapper = {
    get: async (model)=>{
      var response = await loadJSON(`https://api.github.com/users/${model.id}`);
      response.id = model.id;
      return load(model, response);
    },

    query:(array, {term})=>
      (
        loadJSON(`https://api.github.com/search/users?q=${term}`)
        // Promise.resolve(QueryMOCKDATA)
      ).then(({items})=>loadAll(array, items))
  };
});

export default GithubUser;
