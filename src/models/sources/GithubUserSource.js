import GithubUser from '../github/GithubUser.js';
import GithubEvent from '../github/GithubEvent.js';
import Source from './Source.js';

export default class GithubUserSource extends Source {
  static query({term}){
    return GithubUser.query({term}).$promise.then(users=>
      users.map(user=>new this({login:user.login, details:user}))
    );
  }

  static load(attrs){
    attrs.id = attrs.login;
    return Basis.Model.load.call(this, attrs);
  }

  get name(){ return this.id; }
  get details(){
    return this._details || (this._details = GithubUser.get(this.id));
  }
  get events(){
    return this._events ||
      (this._events = GithubEvent.query({type:'users', id:this.id}));
  }

  toJSON(){ return {login:this.login}; }
}

Source.registerSource(GithubUserSource);
