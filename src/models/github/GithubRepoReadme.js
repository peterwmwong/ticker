import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';
import atob from '../../helpers/atob';

export default {
  get:id=>
    loadJSON(
      `https://api.github.com/repos/${id}/readme`
    ).then(({content})=>
      storage.setItemObj(`ticker:GithubRepoReadme:${id}`, atob(content))
    ),
  localGet:id=>storage.getItemObj(`ticker:GithubRepoReadme:${id}`)
};
