import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localGet: id=>storage.getItemObj(`ticker:GithubIssue:${id}`),
  get: id=>{
    const [owner, repo, issueid] = id.split('/');
    return loadJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueid}`
      // `src/helpers/mock_data/GithubIssuePullMOCK.json`
    ).then(issue=>(
      storage.setItemObj(`ticker:GithubIssue:${id}`, issue),
      issue
    ));
  }
};
