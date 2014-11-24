export default function limitArray(array, size){
  return array && array.slice(0,size);
}

PolymerExpressions.prototype.limitArray = limitArray;
