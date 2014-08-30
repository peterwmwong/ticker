import Repo from '../models/github/Repo';
import User from '../models/github/User';

Polymer('ticker-search',{
  searchText: '',
  userResults: [],
  repoResults: [],

  search(){
    this.job('search',()=>{
      var term = this.searchText;
      this.repoResults = Repo.query({term});
      this.userResults = User.query({term});
    });
  },

  searchTextChanged(_, searchText){
    if(searchText){
      this.onSearch();
    }
  },

  onSearch(){
    this.job('search',()=>{
      this.query = {type:'users',users:this.searchText};
      this.onSearch();
    },100);
  }
});
