import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';

export default {
  get:id=>
    loadJSON(
      `https://api.github.com/repos/${id}/readme`
    ).then(({content})=>{
      const decodedContent = atob(content);
      storage.setItemObj(`ticker:GithubRepoReadme:${id}`, decodedContent);
      return decodedContent;
    }),
  localGet:id=>storage.getItemObj(`ticker:GithubRepoReadme:${id}`)
};
