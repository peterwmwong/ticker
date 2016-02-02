import loadJSON from '../../helpers/load';
import storage  from '../../helpers/storage';

export default {
  localQuery: ({id})=>(storage.getItemObj(`ticker:GithubPulls:${id}`) || []),
  query: ({id})=>{
    return loadJSON(
      `https://api.github.com/repos/${id}/pulls`
    ).then(pulls=>(
      storage.setItemObj(`ticker:GithubPulls:${id}`, pulls),
      pulls
    ));
  }
};
