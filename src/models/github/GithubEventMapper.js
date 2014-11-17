import AttrMunger from 'helpers/AttrMunger';
import loadJSON from 'helpers/load';

// !!! <MOCKDATA> !!!
  // import MOCKDATA from './GithubEventMapperMOCKDATA';
  // import MOCKDATA2 from './GithubEventMapperMOCKDATA2';
  // import MOCKDATA from './GithubEventMapperMOCKDATA-allEvents';
// !!! </MOCKDATA> !!!

export default {
  query:(array, {type, id})=>
    (
      loadJSON(`https://api.github.com/${type}/${id}/events`)
      // !!! <MOCKDATA> !!!
        // Promise.resolve(MOCKDATA)
        // Promise.resolve([])
        // Promise.resolve([MOCKDATA, MOCKDATA2][(window.mocki = ((window.mocki || 0)+1)%2)])
      // !!! <MOCKDATA> !!!
    ).then(data=>array.$replace(array.$class.loadAll(AttrMunger.camelize(data))))
};
