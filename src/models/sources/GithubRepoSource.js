import GithubRepo from 'models/github/GithubRepo';
import GithubEvent from 'models/github/GithubEvent';
import Source from './Source';

class GithubRepoSource extends Source {
  static query({term}){
    return GithubRepo.query({term}).$promise.then(repos=>
      repos.map(repo=>new this({fullName:repo.fullName, details:repo}))
    )
  }

  constructor({fullName, details}){
    this.fullName = fullName;
    this._details = details;
  }

  get name(){return this.fullName}
  get details(){
    return this._details || (this._details = GithubRepo.get(this.fullName));
  }
  get events(){
    return this._events ||
    (this._events = GithubEvent.query({type:'repos', id:this.fullName}));
  }


  toJSON(){return {fullName:this.fullName}}
}

Source.registerSource(GithubRepoSource);

export default GithubRepoSource;
