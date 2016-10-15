import model from '../../helpers/model';

export default model({
  query: ({type, id}) => ({
    cache: `ticker:GithubEvent:${type}/${id}`,
    url:   `https://api.github.com/${type}/${id}/events`
  })
});
