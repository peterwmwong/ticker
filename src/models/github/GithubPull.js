import model  from '../../helpers/model';

export default model({
  query: (id)=> ({
    url: `https://api.github.com/repos/${id}/pulls`
  })
});
