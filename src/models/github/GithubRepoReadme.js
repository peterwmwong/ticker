import atob from '../../helpers/atob';
import model  from '../../helpers/model';

export default model({
  get: ({id}) => ({
    url: `https://api.github.com/repos/${id}/readme`,
    transform: ({content}) => atob(content)
  })
});
