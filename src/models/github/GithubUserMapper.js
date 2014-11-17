import loadJSON        from 'helpers/load';
import {load, loadAll} from 'helpers/MapperUtils';
// import QueryMOCKDATA from './GithubUserMapperQueryMOCKDATA';

export default {
  get(model){
    return (
      loadJSON(`https://api.github.com/users/${model.id}`)
    ).then(data=>load(model, data));
  },
  query(array, {term}){
    return (
      loadJSON(`https://api.github.com/search/users?q=${term}`)
      // Promise.resolve(QueryMOCKDATA)
    ).then(data=>loadAll(array, data && data.items));
  }
};
