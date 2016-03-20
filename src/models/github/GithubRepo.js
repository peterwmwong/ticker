import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';

export default {
  localQuery:({user})=>storage.getItemObj(`ticker:GithubRepos:user:${user}`),
  query:({term, user})=>
      term ? loadJSON(
        `https://api.github.com/search/repositories?q=${term}&per_page=5`
        // `src/helpers/mock_data/GithubUserQueryMOCK.json`
      ).then(d=>d.items)
    : user ? loadJSON(
        `https://api.github.com/users/${user}/repos`
      ).then(items=>
        storage.setItemObj(`ticker:GithubRepos:user:${user}`, items)
      )
    : null
};
