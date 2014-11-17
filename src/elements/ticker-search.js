import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-search', {
  state:appState,

  // Filters
  // =======

  onSearchTextChanged:{
    toDOM:searchText=>searchText,
    toModel(searchText){
      this.job('ticker-search',()=>{
        this.stateEvent('searchTextChanged', searchText);
      }, 500);
      return this.state.searchText;
    }
  }

});
