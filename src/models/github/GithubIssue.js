import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localGet: (id)=> storage.getItemObj(`ticker:GithubIssue:${id}`),
  get: (id)=> {
    const [owner, repo, issueid] = id.split('/');
    return loadJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueid}`
      // `src/helpers/mock_data/GithubIssuePullMOCK.json`
    ).then((issue)=> storage.setItemObj(`ticker:GithubIssue:${id}`, issue));
  },

  localQuery: ({id})=> (storage.getItemObj(`ticker:GithubIssues${id}`) || []),
  query: ({id})=>
    loadJSON(
      `https://api.github.com/repos/${id}/issues`
    ).then((pulls)=> storage.setItemObj(`ticker:GithubIssues:${id}`, pulls))
};
