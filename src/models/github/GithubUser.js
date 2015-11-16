import loadJSON from '../../helpers/load';

export default {
  get:id=>loadJSON(`https://api.github.com/users/${id}`),
  query:({term})=>
    loadJSON(
      `https://api.github.com/search/users?q=${term}&per_page=5`
      // `src/helpers/mock_data/GithubUserQueryMOCK.json`
    ).then(({items})=>items)
};
