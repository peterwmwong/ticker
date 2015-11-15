import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';
import Model      from '../../helpers/bureau/model';
import GithubUser from './GithubUser';

export default class GithubIssueComment extends Model{
  static get desc(){
    return {
      attr:{
        id:Number,
        body:String
      },
      hasOne:{
        user: {type:GithubUser}
      },

      mapper:{
        localQuery:({issueId})=>{
          const local = storage.getItem(`ticker:GithubIssueComment:${issueId}`);
          return local ? JSON.parse(local) : [];
        },
        query:({issueId})=>{
          const [owner, repo, id] = issueId.split('/');
          return loadJSON(
            `https://api.github.com/repos/${owner}/${repo}/issues/${id}/comments`
            // https://api.github.com/repos/facebook/react/issues/123/comments
            // https://api.github.com/repos/facebook/react/issues/5462/comments
            // `src/helpers/mock_data/GithubIssueCommentsMOCK.json`
          );
        }
      }
    };
  }
}
