import Model from '../../helpers/bureau/model.js';

export default class GithubUserSource extends Model {
  static get desc(){
    return {
      attr:{
        id:String
      }
    };
  }
  // static query({term}){
  //   return GithubUser.query({term}).$promise.then(users=>
  //     users.map(user=>new this({login:user.login, details:user}))
  //   );
  // }
  //
  // static load(attrs){
  //   attrs.id = attrs.login;
  //   return Basis.Model.load.call(this, attrs);
  // }
  //
  // get name(){ return this.id; }
  // get details(){
  //   return this._details || (this._details = GithubUser.get(this.id));
  // }
  // get events(){
  //   return this._events ||
  //     (this._events = GithubEvent.query({type:'users', id:this.id}));
  // }
  //
  // toJSON(){ return {login:this.login}; }
}
