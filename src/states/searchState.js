import {goto, reenter} from '../helpers/svengali.js';
import GithubUser      from '../models/github/GithubUser.js';
import GithubRepo      from '../models/github/GithubRepo.js';

let currentQuery = null;
function doDelayedSearch(searchTerm){
  if(currentQuery){
    currentQuery.term = searchTerm;
  }
  else{
    currentQuery = {
      term:searchTerm,
      promise: new Promise(resolve=>{
        setTimeout(()=>{
          const term = currentQuery.term;
          currentQuery = null;
          Promise.all([GithubUser.query({term}), GithubRepo.query({term})])
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
      attrs:{ 'appSearch':true },
      states:{
        // Purposely split out as a seperate state so it can be reentered without
        // flickering the 'appSearch' attribute.
        'search':{
          attrs:{ 'searchResults':({searchText:t})=>t ? doDelayedSearch(t) : [] },
          events:{ 'searchTextChanged':searchText=>reenter({searchText}) }
        }
      }
    }
  },
  events:{
    'appSearchClose':goto('off'),
    'appSearchOpen' :goto('on')
  }
};
