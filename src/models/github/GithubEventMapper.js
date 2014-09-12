import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';
import MOCKDATA from './GithubEventMapperMOCKDATA';
// import MOCKDATA2 from './GithubEventMapperMOCKDATA2';
// import MOCKDATA from './GithubEventMapperMOCKDATA-allEvents';
// var MOCKDATA = [];
// window.mockWat = true;

export default {
  query:(array,{type, [type]:typeRef})=>
    (
      // loadJSON(`https://api.github.com/${type}/${typeRef}/events`)
      // loadJSON(`https://api.github.com/users/peterwmwong/received_events`)
      Promise.resolve(MOCKDATA)
    ).then(data=>
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data))))
};
