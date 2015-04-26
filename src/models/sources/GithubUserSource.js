import GithubEvent from '../github/GithubEvent.js';
import GithubUser  from '../github/GithubUser.js';
import Model       from '../../helpers/bureau/model.js';

export default class GithubUserSource extends Model {
  static get desc(){
    return {
      attr:{
        login:String,
        type:String,
        avatar_url:String
      },
      mapper:{
        query:({searchText})=>GithubUser.desc.mapper.query({term:searchText})
      }
    };
  }

  get displayName(){ return this.login; }

  queryEvents(){
    return this._events ||
      (this._events = GithubEvent.query({type:'users', id:this.login}));
  }
}
