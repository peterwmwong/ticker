import GithubEvent from '../github/GithubEvent.js';
import Model       from '../../helpers/bureau/model.js';

export default class GithubRepoSource extends Model {
  static get desc(){
    return {
      attr:{
        full_name:String,
        type:String
      }
    };
  }

  get displayName(){ return this.full_name; }

  queryEvents(){
    return this._events ||
      (this._events = GithubEvent.query({type:'repos', id:this.id}));
  }

  // get details(){
  //   return this._details || (this._details = GithubRepo.get(this.full_name));
  // }
  //
  // get issues(){
  //   return this._issues ||
  //     (this._issues = GithubIssue.query({repo:this.full_name}));
  // }
  //
  // get pullRequests(){
  //   return this._pullRequests ||
  //     (this._pullRequests = GithubPullRequest.query({repo:this.full_name}));
  // }

  // toJSON(){ return {full_name:this.full_name}; }
}
