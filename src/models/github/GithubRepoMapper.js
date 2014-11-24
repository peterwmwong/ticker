import loadJSON        from 'helpers/load';
import {load, loadAll} from 'helpers/MapperUtils';

export default {
  get: async (model)=>{
    var response = await loadJSON(`https://api.github.com/repos/${model.id}`);
    response.id = model.id;
    return load(model, response);
  },

  query: async (array, {term})=>
  loadAll(array, (await loadJSON(`https://api.github.com/search/repositories?q=${term}`)).items)
};
