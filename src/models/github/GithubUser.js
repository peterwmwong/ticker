import model  from '../../helpers/model';

export default model({
  query: ({term}) => ({
    url: `https://api.github.com/search/users?q=${term}&per_page=5`,
    transform: d => d.items
  })
});
