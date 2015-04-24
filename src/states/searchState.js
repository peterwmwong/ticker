import {reenter} from '../helpers/svengali.js';
import Source from '../models/sources/Source.js';
import '../models/sources/GithubRepoSource.js';

let currentQuery = null;
function delayedSourceQuery(term){
  if(currentQuery){
    currentQuery.term = term;
  }
  else{
    currentQuery = {
      term,
      promise: new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(
            Source.query({term:currentQuery.term}).then(results=>{
              currentQuery = null;
              return results;
            })
          );
        }, 300);
      })
    };
  }
  return currentQuery.promise;
}

export default {
  attrs:{
    'appView':'search',
    'searchText':({searchText})=>searchText || '',
    'searchResults'(){
      return this.attrs.searchText ? delayedSourceQuery(this.attrs.searchText) : [];
    }
  },
  events:{
    'clearSearchText':reenter({searchText:''}),
    'searchTextChanged':searchText=>reenter({searchText})
  }
};
