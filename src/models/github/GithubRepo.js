import model  from '../../helpers/model';

export default model({
  query: ({term, user})=>
    term != null ? {
      url: `https://api.github.com/search/repositories?q=${term}&per_page=5`,
      transform: (d)=> d.items
    }
    : user ? {
      cache: `ticker:GithubRepos:user:${user}`,
      url:   `https://api.github.com/users/${user}/repos`
    }
    : null
});
