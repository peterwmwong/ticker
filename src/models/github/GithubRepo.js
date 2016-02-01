import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';

export default {
  get:id=>
    loadJSON(
      // `https://api.github.com/repos/${id}`
      `src/helpers/mock_data/GithubRepoMOCK.json`
    ).then(repo=>(
      storage.setItemObj(`ticker:GithubRepo:${id}`, repo),
      repo
    )),
  localGet:id=>storage.getItemObj(`ticker:GithubRepo:${id}`),
  query:({term})=>
    loadJSON(
      `https://api.github.com/search/repositories?q=${term}&per_page=5`
      // `src/helpers/mock_data/GithubRepoQueryMOCK.json`
    ).then(d=>d.items)
};
