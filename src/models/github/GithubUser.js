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

    query: async (array, {term})=>
      loadAll(array, (await loadJSON(`https://api.github.com/search/users?q=${term}`)).items)
  };
});

export default GithubUser;
