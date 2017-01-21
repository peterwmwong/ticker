const outfits = require('./outfits-old.json');
const result = {};
outfits.forEach(o => {
  result[o.id] = o;
});
outfits.forEach(o => {
  delete o.id;
});
console.log(JSON.stringify(result));