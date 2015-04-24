import loadJSON from '../../helpers/load.js';

export default {
  get: model=>
    loadJSON(`https://api.github.com/repos/${model.id}`).then(response=>{
      response.id = model.id;
      return response;
    }),

  query: (array, {term})=>
    loadJSON(`https://api.github.com/search/repositories?q=${term}`).then(({items})=>
      items
    )
};
