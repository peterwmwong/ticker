import model  from '../../helpers/model';

export default model({
  get: ({repo, commitId}) => ({
    url: `https://api.github.com/repos/${repo}/commits/${commitId}`
  })
});
