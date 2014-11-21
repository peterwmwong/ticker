import loadJSON        from 'helpers/load';
import {load, loadAll} from 'helpers/MapperUtils';

export default {
  get: async (model)=>
    load(model, await loadJSON(`https://api.github.com/users/${model.id}`)),

  query: async (array, {term})=>
    loadAll(array, (await loadJSON(`https://api.github.com/search/users?q=${term}`)).items)
};
