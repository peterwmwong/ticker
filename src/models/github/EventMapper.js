import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';
import MOCKDATA from './EventMapperMOCKDATA';

export default {
  query:(array,{user})=>{
    // return Promise.resolve(...);
    return new Promise(function(resolve){
      resolve(
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(MOCKDATA))))
    });
  }
};
