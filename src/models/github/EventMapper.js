import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';
// import MOCKDATA from './EventMapperMOCKDATA';
import MOCKDATA from './EventMapperMOCKDATA2';

export default {
  query:(array,{type, [type]:typeRef})=>{
    // var promise = Promise.resolve(MOCKDATA);
    var promise = loadJSON(`https://api.github.com/${type}/${typeRef}/events`);

    promise.then(data=>
      array.$replace(
        array.$class.loadAll(
          AttrMunger.camelize(data.slice(6)))));
    return promise;
  }
};
