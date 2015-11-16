import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localQuery:({id})=>{
    const local = storage.getItem(`ticker:GithubIssueComment:${id}`);
    return local ? JSON.parse(local) : [];
  },
  query:({id})=>{
    const [owner, repo, issueId] = id.split('/');
    return loadJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}/comments`
      // `src/helpers/mock_data/GithubIssueCommentsMOCK.json`
    ).then(comments=>(
      storage.setItem(`ticker:GithubIssueComment:${id}`, JSON.stringify(comments)),
      comments
    ));
  }
};
