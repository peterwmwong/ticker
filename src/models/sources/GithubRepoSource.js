import GithubRepo from 'models/github/GithubRepo';
import Source from './Source';

class GithubUserSource extends Source {
  static query({term}){
    return GithubRepo.query({term}).$promise.then(repos=>
      repos.map(repo=>new this({fullName:repo.full_name, details:repo}))
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

  toJSON(){return {fullName:this.fullName}}
}

Source.registerSource(GithubUserSource);

export default GithubUserSource;
