import {errorWrongType} from './errors.js';

const IS_PROD = false;
const ARRAY_PROTO = Array.prototype;
const ARRAY_FUNCTIONS = {
  splice: function(index, numToRemove, ...itemsToAdd){
    let spliceArgs = [index, numToRemove];
    let {type, inverse, instanceOf} = this._hasMany;
    itemsToAdd.filter(newItem=>{
      if(instanceOf(newItem, type)){
        // Reach inside the new association and set inverse association
        if(inverse){ newItem[inverse] = this; }
        spliceArgs.push(newItem);
      }
      else if(!IS_PROD){
        errorWrongType(type, newItem);
      }
    });

    let removedItems = ARRAY_PROTO.splice.apply(this, spliceArgs);

    // Reach inside the removed association and unset the inverse association
    if(inverse){
      for(let item in removedItems){ item[inverse] = null; }
    }

    return removedItems;
  },

  push: function(...items){
    this.splice.apply(this, [this.length, 0].concat(items));
    return this.length;
  },

  pop: function(){ return this.splice.apply(this, [this.length, 1])[0]; },

  unshift: function(...items){
    this.splice.apply(this, [0, 0].concat(items));
    return this.length;
  }
};

export default function hasManyArray(hasMany){
  let array = [];
  array._hasMany = hasMany;
  for(let method in ARRAY_FUNCTIONS){ array[method] = ARRAY_FUNCTIONS[method]; }
  return array;
}
