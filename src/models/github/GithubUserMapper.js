import AttrMunger from 'helpers/AttrMunger';
import loadJSON from 'helpers/load';
// import QueryMOCKDATA from './GithubUserMapperQueryMOCKDATA';

export default {
  query:(array,{q})=>
    (
      loadJSON(`https://api.github.com/search/users?q=${q}`)
      // Promise.resolve(QueryMOCKDATA)
    ).then(data=>
      (data && data.items) &&
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data.items))))
};
