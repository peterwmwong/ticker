import model from '../helpers/model';

export default model({
  query: () => ({
    cache: `okItems`,
    url:   `/static/items.json`
  })
});
