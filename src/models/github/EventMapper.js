import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';
// import MOCKDATA from './EventMapperMOCKDATA';
// import MOCKDATA from './EventMapperMOCKDATA2';
// import MOCKDATA from './EventMapperMOCKDATA-allEvents';

export default {
  query:(array,{type, [type]:typeRef})=>
    (
      loadJSON(`https://api.github.com/${type}/${typeRef}/events`)
      // Promise.resolve(MOCKDATA)
    ).then(data=>
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data))))
};
