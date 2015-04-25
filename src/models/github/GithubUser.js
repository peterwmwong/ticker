import loadJSON from '../../helpers/load.js';
import Model    from '../../helpers/bureau/model.js';

export default class GithubUser extends Model {
  static get desc(){
    return {
      attr:{
        avatar_url:String,
        login:String,
        url:String,
        score:Number,
      },
      mapper: {
        get: model=>
          loadJSON(`https://api.github.com/users/${model.id}`).then(response=>{
            response.id = model.id;
            return response;
          }),

        query: (array, {term})=>
          loadJSON(`https://api.github.com/search/users?q=${term}`).then(({items})=>
            items
          )
      }
    };
  }
}
