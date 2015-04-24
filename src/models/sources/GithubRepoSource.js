import GithubEvent from '../github/GithubEvent.js';
import Model       from '../../helpers/bureau/model.js';

export default class GithubRepoSource extends Model {
  static get desc(){
    return {
      attr:{
        id:String
      }
    };
  }

  queryEvents(){
    return this._events ||
      (this._events = GithubEvent.query({type:'repos', id:this.id}));
  }

  // static query({term}){
  //   return GithubRepo.query({term}).$promise.then(repos=>
  //     repos.map(repo=>new this({full_name:repo.full_name, details:repo}))
  //   );
  // }

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
