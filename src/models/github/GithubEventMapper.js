import loadJSON from '../../helpers/load.js';

export default {
  query: ({type, id})=>
    loadJSON(`https://api.github.com/${type}/${id}/events`)
};
