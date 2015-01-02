import loadJSON        from 'helpers/load.js';
import {load, loadAll} from 'helpers/MapperUtils.js';

export default {
  get: async (model)=>{
    var response = await loadJSON(`https://api.github.com/users/${model.id}`);
    response.id = model.id;
    return load(model, response);
  },

  query: async (array, {term})=>
    loadAll(array, (await loadJSON(`https://api.github.com/search/users?q=${term}`)).items)
};
