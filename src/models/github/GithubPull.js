import model  from '../../helpers/model';

export default model({
  query: (id)=> ({
    cache: `GithubPulls:${id}`,
    url: `https://api.github.com/repos/${id}/pulls`
  })
});
