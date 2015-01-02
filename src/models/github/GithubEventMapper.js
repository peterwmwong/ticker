import loadJSON from 'helpers/load.js';
import {loadAll} from 'helpers/MapperUtils.js';

export default {
  query: async (array, {type, id})=>
    loadAll(array, await loadJSON(`https://api.github.com/${type}/${id}/events`))
};
