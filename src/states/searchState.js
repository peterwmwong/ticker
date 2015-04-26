import {goto, reenter} from '../helpers/svengali.js';
import GithubUser      from '../models/github/GithubUser.js';
import GithubRepo      from '../models/github/GithubRepo.js';

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
          const currentTerm = currentQuery.term;
          currentQuery = null;
          Promise.all([GithubUser.query({term:currentTerm}), GithubRepo.query({term:currentTerm})])
            .then(([users, repos])=>
              resolve(users.concat(repos).sort((a, b)=>b.score - a.score).slice(0, 10))
            );
        }, 500);
      })
    };
  }
  return currentQuery.promise;
}

export default {
  states:{
    'off':{},
    'on':{
      attrs:{
        'appSearch':true,
        'appSearchResults'({appSearchQueryText}){
          return appSearchQueryText ? delayedSourceQuery(appSearchQueryText) : [];
        }
      },
      events:{
        'appSearchTextCleared':reenter({appSearchQueryText:''}),
        'appSearchTextChanged':appSearchQueryText=>reenter({appSearchQueryText})
      }
    }
  },
  events:{
    'appSearchClose':goto('off'),
    'appSearchOpen' :goto('on')
  }
};
