// import GithubRepo        from '../github/GithubRepo.js';
// import GithubIssue       from '../github/GithubIssue.js';
// import GithubEvent       from '../github/GithubEvent.js';
// import GithubPullRequest from '../github/GithubPullRequest.js';
import Source            from './Source.js';

export default class GithubRepoSource extends Source {
  // static query({term}){
  //   return GithubRepo.query({term}).$promise.then(repos=>
  //     repos.map(repo=>new this({full_name:repo.full_name, details:repo}))
  //   );
  // }

  // get events(){
  //   return this._events ||
  //     (this._events = GithubEvent.query({type:'repos', id:this.id}));
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

  toJSON(){ return {full_name:this.full_name}; }
}

Source.registerSource(GithubRepoSource);
