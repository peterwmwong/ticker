import loadJSON from '../../helpers/load.js';
import Model    from '../../helpers/bureau/model.js';

export default class GithubRepo extends Model {
  static get desc(){
    return {
      attr:{
        full_name:String,
        description:String,
        name:String,
        url:String,
        score:Number
      },
      mapper:{
        get:model=>
          loadJSON(`https://api.github.com/repos/${model.id}`).then(response=>{
            response.id = model.id;
            return response;
          }),

        query:({term})=>
          loadJSON(
            `https://api.github.com/search/repositories?q=${term}`
          ).then(({items})=>items)
      }
    };
  }
}
