import loadJSON   from '../../helpers/load.js';
import Model      from '../../helpers/bureau/model.js';
// import GithubUser from './GithubUser.js';
// import GithubRepo from './GithubRepo.js';

export default class GithubEvent extends Model {
  static get desc(){
    return {
      mapper:{
        query:({type, id})=>
          loadJSON(`https://api.github.com/${type}/${id}/events`)
      },
      attr:{
        type: String,
        payload: Object,
        created_at: Date
      }//,
      // hasOne:{
      //   actor: {type:GithubUser},
      //   repo: {type:GithubRepo}
      // }
    };
  }
}
