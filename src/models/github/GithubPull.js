import model  from '../../helpers/model';

export default model({
  query: ({repo}) => ({
    url: `https://api.github.com/repos/${repo}/pulls`
  })
});
