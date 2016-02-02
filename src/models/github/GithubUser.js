import storage  from '../../helpers/storage';
import loadJSON from '../../helpers/load';

export default {
  get:id=>
    loadJSON(
      `https://api.github.com/users/${id}`
      // `src/helpers/mock_data/GithubUserMOCK.json`
    ).then(user=>(
      storage.setItemObj(`ticker:GithubUser:${id}`, user),
      user
    )),
  localGet:id=>storage.getItemObj(`ticker:GithubUser:${id}`),
  query:({term})=>
    loadJSON(
      `https://api.github.com/search/users?q=${term}&per_page=5`
      // `src/helpers/mock_data/GithubUserQueryMOCK.json`
    ).then(d=>d.items)
};
