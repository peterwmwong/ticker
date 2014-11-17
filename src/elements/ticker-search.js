import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-search', {
  state:appState,

  // Filters
  // =======

  onSearchTextChanged:{
    toDOM:searchText=>searchText,
    toModel(searchText){
      this.stateEvent('searchTextChanged', searchText);
      return this.state.searchText;
    }
  }

});
