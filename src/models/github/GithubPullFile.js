import model  from '../../helpers/model';

export default model({
  query: ({repo, id}) => {
    return {
      url: `https://api.github.com/repos/${repo}/pulls/${id}/files`
    };
  }
});
