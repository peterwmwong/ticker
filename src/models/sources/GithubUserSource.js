import GithubUser from 'models/github/GithubUser.js';
import GithubEvent from 'models/github/GithubEvent.js';
import Source from './Source.js';

class GithubUserSource extends Source {
  static query({term}){
    return GithubUser.query({term}).$promise.then(users=>
      users.map(user=>new this({login:user.login, details:user}))
    )
  }

  constructor({login, details}){
    this.login = login;
    this._details = details;
  }

  get name(){return this.login}
  get details(){
    return this._details || (this._details = GithubUser.get(this.login));
  }
  get events(){
    return this._events ||
      (this._events = GithubEvent.query({type:'users', id:this.login}));
  }

  toJSON(){return {login:this.login}}
}

Source.registerSource(GithubUserSource);

export default GithubUserSource;
