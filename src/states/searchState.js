import {reenter} from '../helpers/svengali';
import Source    from '../models/sources/Source';

var currentQuery = null;
function delayedSourceQuery(term){
  currentQuery = currentQuery || {
    term,
    promise: new Promise(function(resolve){
      setTimeout(()=>{
        resolve(
          Source.query({term}).then(function(results){
            currentQuery = null;
            return results;
          })
        )
      }, 300);
    })
  };
  return currentQuery.promise;
}

export default {
  attrs:{
    'appView':'search',
    'searchText':({searchText})=>searchText || '',
    'searchResults'(){return this.attrs.searchText ? delayedSourceQuery(this.attrs.searchText) : []}
  },
  events:{
    'clearSearchText':reenter({searchText:''}),
    'searchTextChanged':searchText=>reenter({searchText})
  }
};
