import model  from '../../helpers/model';

export default model({
  query: ({id}) => {
    const [owner, repo, pull] = id.split('/');
    return {
      url: `https://api.github.com/repos/${owner}/${repo}/pulls/${pull}/comments`
    };
  }
});
