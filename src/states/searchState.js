import {reenter} from '../helpers/svengali.js';
import GithubUser from '../models/github/GithubUser.js';
import GithubRepo from '../models/github/GithubRepo.js';

let currentQuery = null;
function delayedSourceQuery(term){
  if(currentQuery){
    currentQuery.term = term;
  }
  else{
    currentQuery = {
      term,
      promise: new Promise(resolve=>{
        setTimeout(()=>{
          currentQuery = null;
          Promise.all([GithubUser.query({term}), GithubRepo.query({term})])
            .then(([users, repos])=>
              resolve(users.concat(repos).sort((a, b)=>b.score - a.score).slice(0, 10))
            );
        }, 300);
      })
    };
  }
  return currentQuery.promise;
}

export default {
  attrs:{
    'appSearch':true,
    'appSearchResults'({appSearchQueryText}){
      appSearchQueryText = 'TESTING REMOVE ME';
      return appSearchQueryText ? delayedSourceQuery(appSearchQueryText) : [];
    }
  },
  events:{
    'appSearchTextCleared':reenter({appSearchQueryText:''}),
    'appSearchTextChanged':appSearchQueryText=>reenter({appSearchQueryText})
  }
};
