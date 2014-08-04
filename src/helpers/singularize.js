// TODO(pwong): more robust singularize
export default function singularize(word){
  return word.replace(/s$/,'');
}
