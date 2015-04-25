import loadJSON from '../../helpers/load.js';
import Model    from '../../helpers/bureau/model.js';

export default class GithubRepo extends Model {
  static get desc(){
    return {
      attr:{
        full_name:String,
        name:String,
        url:String,

        // TODO(pwong): GTFO. This only applies to the search API endpoint.
        //              We should move this out as a sub class, like GithubRepoSearch
        //              or make a GithubSearchResult that is composed of this.
        score:Number
      },
      mapper:{
        get: model=>
          loadJSON(`https://api.github.com/repos/${model.id}`).then(response=>{
            response.id = model.id;
            return response;
          }),

        query: (array, {term})=>
          loadJSON(`https://api.github.com/search/repositories?q=${term}`).then(({items})=>
            items
          )
      }
    };
  }
}
