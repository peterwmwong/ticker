import loadJSON from '../../helpers/load';

export default {
  get:id=>loadJSON(`https://api.github.com/repos/${id}`),
  query:({term})=>
    loadJSON(
      `https://api.github.com/search/repositories?q=${term}&per_page=5`
      // `src/helpers/mock_data/GithubRepoQueryMOCK.json`
    ).then(({items})=>items)
};
