import GithubRepo from 'models/github/GithubRepo';
import GithubEvent from 'models/github/GithubEvent';
import Source from './Source';

class GithubRepoSource extends Source {
  static query({term}){
    return GithubRepo.query({term}).$promise.then(repos=>
      repos.map(repo=>new this({full_name:repo.full_name, details:repo}))
    )
  }

  constructor({full_name, details}){
    this.full_name = full_name;
    this._details = details;
  }

  get name(){return this.full_name}
  get details(){
    return this._details || (this._details = GithubRepo.get(this.full_name));
  }
  get events(){
    return this._events ||
    (this._events = GithubEvent.query({type:'repos', id:this.full_name}));
  }


  toJSON(){return {full_name:this.full_name}}
}

Source.registerSource(GithubRepoSource);

export default GithubRepoSource;
