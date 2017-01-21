import model  from '../helpers/model';

export default model({
  get: () => ({
    // TODO: Figure out IndexDB as it may allow for ~50MB amount data
    // cache: `okDB`,
    url:   `../static/db.json`
  })
});
