import loadJSON    from '../../helpers/load.js';
import Model       from '../../helpers/bureau/model.js';
import GithubEvent from './GithubEvent.js';

export default class GithubUser extends Model {
  static get desc(){
    return {
      attr:{
        avatar_url:String,
        last_updated:Date,
        login:String,
        score:Number,
        type:String,
        url:String
      },

      mapper:{
        get:id=>loadJSON(`https://api.github.com/users/${id}`),
        query:({term})=>
          loadJSON(
            `https://api.github.com/search/users?q=${term}`
          ).then(({items})=>
            items.map(u=>{
              u.id = u.login;
              return u;
            })
          )
      }
    };
  }

  get displayName(){ return this.login; }

  queryEvents(){
    return this._events ||
      (this._events = GithubEvent.query({type:'users', id:this.login}));
  }
}
