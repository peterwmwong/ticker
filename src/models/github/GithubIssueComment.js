import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localQuery:({id})=>(storage.getItemObj(`ticker:GithubIssueComment:${id}`) || []),
  query:({id})=>{
    const [owner, repo, issueId] = id.split('/');
    return loadJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}/comments`
      // `src/helpers/mock_data/GithubIssueCommentsMOCK.json`
    ).then(comments=>(
      storage.setItemObj(`ticker:GithubIssueComment:${id}`, comments),
      comments
    ));
  }
};
