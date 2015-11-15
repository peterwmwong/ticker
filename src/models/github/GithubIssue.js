import Model      from '../../helpers/bureau/model';
import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';
import GithubUser from './GithubUser';

export default class GithubIssue extends Model{
  static get desc(){
    return {
      attr:{
        number:Number,
        title:String,
        body:String,
        state:String,
        created_at:Date
      },
      hasOne:{
        user: {type:GithubUser}
      },

      mapper:{
        localGet: id=>
          JSON.parse(storage.getItem(`ticker:GithubIssue:${id}`) || null),

        get: id=>{
          const [owner, repo, issueid] = id.split('/');
          return loadJSON(
            `https://api.github.com/repos/${owner}/${repo}/issues/${issueid}`
            // https://api.github.com/repos/facebook/react/issues/${id}
            // `src/helpers/mock_data/GithubIssuePullMOCK.json`
          ).then(issue=>(
            storage.setItem(`ticker:GithubIssue:${id}`, JSON.stringify(issue)),
            issue
          ));
        }
      }
    };
  }
}
