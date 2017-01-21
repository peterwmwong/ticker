import model from '../helpers/model';

export default model({
  query: () => ({
    cache: `okCombos`,
    url:   `/static/outfits.json`
  })
});
