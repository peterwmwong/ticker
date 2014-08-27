import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';
// import MOCKDATA from './EventMapperMOCKDATA';
import MOCKDATA from './EventMapperMOCKDATA2';

export default {
  query:(array,{type, [type]:typeRef})=>
    // Promise.resolve(MOCKDATA)
    loadJSON(`https://api.github.com/${type}/${typeRef}/events`)
      .then(data=>
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data))))
};
