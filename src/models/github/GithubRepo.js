import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';

export default {
  get:id=>
    loadJSON(
      `https://api.github.com/repos/${id}`
      // `src/helpers/mock_data/GithubRepoMOCK.json`
    ).then(repo=>(
      storage.setItemObj(`ticker:GithubRepo:${id}`, repo),
      repo
    )),
  localGet:id=>storage.getItemObj(`ticker:GithubRepo:${id}`),
  localQuery:({user})=>storage.getItemObj(`ticker:GithubRepos:user:${user}`),
  query:({term, user})=>
      term ? loadJSON(`https://api.github.com/search/repositories?q=${term}&per_page=5`).then(d=>d.items)
    : user ? loadJSON(`https://api.github.com/users/${user}/repos`).then(items=>(
        storage.setItemObj(`ticker:GithubRepos:user:${user}`, items),
        items
      ))
    : null
};
