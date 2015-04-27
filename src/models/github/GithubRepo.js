import loadJSON from '../../helpers/load.js';
import Model    from '../../helpers/bureau/model.js';
import GithubEvent from './GithubEvent.js';

export default class GithubRepo extends Model {
  static get desc(){
    return {
      attr:{
        description:String,
        full_name:String,
        last_updated:Date,
        name:String,
        // Only populated when loaded from the query endpoint
        score:Number
      },

      mapper:{
        get:id=>loadJSON(`https://api.github.com/repos/${id}`),
        query:({term})=>
          loadJSON(
            `https://api.github.com/search/repositories?q=${term}&per_page=10`
          ).then(({items})=>
            items.map(u=>{
              u.id = u.full_name;
              return u;
            })
          )
      }
    };
  }

  get displayName(){ return this.full_name; }

  queryEvents(){
    return this._events ||
      (this._events = GithubEvent.query({type:'repos', id:this.full_name}));
  }
}
