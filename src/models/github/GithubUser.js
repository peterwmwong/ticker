import loadJSON    from '../../helpers/load';
import Model       from '../../helpers/bureau/model';

export default class GithubUser extends Model{
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
            `https://api.github.com/search/users?q=${term}&per_page=10`
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
  get tickerUrl(){ return `/github/${this.login}`; }
}
