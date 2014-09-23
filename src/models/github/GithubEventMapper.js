import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';


// !!! <MOCKDATA> !!!
  // import MOCKDATA from './GithubEventMapperMOCKDATA';
  // import MOCKDATA2 from './GithubEventMapperMOCKDATA2';
  // import MOCKDATA from './GithubEventMapperMOCKDATA-allEvents';
// !!! </MOCKDATA> !!!

export default {
  query:(array,{type, [type]:typeRef})=>
    (
      loadJSON(`https://api.github.com/${type}/${typeRef}/events`)
      // loadJSON(`https://api.github.com/users/peterwmwong/received_events`)
      // Promise.resolve([MOCKDATA, MOCKDATA2][(window.mocki = ((window.mocki || 0)+1)%2)])
    ).then(data=>
        array.$replace(
          array.$class.loadAll(
            AttrMunger.camelize(data))))
};
