import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localGet: id=>
    JSON.parse(storage.getItem(`ticker:GithubIssue:${id}`) || null),

  get: id=>{
    const [owner, repo, issueid] = id.split('/');
    return loadJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueid}`
      // `src/helpers/mock_data/GithubIssuePullMOCK.json`
    ).then(issue=>(
      storage.setItem(`ticker:GithubIssue:${id}`, JSON.stringify(issue)),
      issue
    ));
  }
};
