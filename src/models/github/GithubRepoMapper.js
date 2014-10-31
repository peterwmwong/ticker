import AttrMunger from 'helpers/AttrMunger';
import loadJSON from 'helpers/load';

export default {
  query:(array,{q})=>
    (
      loadJSON(`https://api.github.com/search/repositories?q=${q}`)
      // Promise.resolve(QueryMOCKDATA)
    ).then(data=>
      (data && data.items) &&
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data.items))))
};
