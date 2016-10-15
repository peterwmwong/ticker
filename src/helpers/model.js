import loadJSON from './load';
import storage  from './storage';

const identity  = o => o;
const fromCache = cacheKey => storage.getItemObj(cacheKey);
const load      = ({url, cache, transform=identity}) =>
  loadJSON(url)
    .then(transform)
    .then(!cache ? identity : obj => storage.setItemObj(cache, obj));

export default ({get:g, query:q}) => ({
  localGet:   options => fromCache(g(options).cache),
  get:        options => load(g(options)),
  localQuery: options => fromCache(q(options).cache),
  query:      options => load(q(options))
});
