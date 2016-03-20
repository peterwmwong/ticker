import loadJSON from '../../helpers/load';

export default {
  query:({term})=>
    loadJSON(
      `https://api.github.com/search/users?q=${term}&per_page=5`
      // `src/helpers/mock_data/GithubUserQueryMOCK.json`
    ).then(d=>d.items)
};
