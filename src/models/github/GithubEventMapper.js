import loadJSON from 'helpers/load';
import {loadAll} from 'helpers/MapperUtils';

export default {
  query: async (array, {type, id})=>
    loadAll(array, await loadJSON(`https://api.github.com/${type}/${id}/events`))
};
