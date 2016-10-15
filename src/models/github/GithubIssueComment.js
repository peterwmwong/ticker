import model  from '../../helpers/model';

export default model({
  query: ({repo, issue}) => {
    return {
      url: `https://api.github.com/repos/${repo}/issues/${issue.number}/comments`
    };
  }
});
