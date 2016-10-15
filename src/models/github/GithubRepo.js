import model  from '../../helpers/model';

export default model({
  query: ({term, id}) =>
    term != null ? {
      url: `https://api.github.com/search/repositories?q=${term}&per_page=5`,
      transform: d => d.items
    }
    : id ? {url: `https://api.github.com/users/${id}/repos`}
    : null
});
