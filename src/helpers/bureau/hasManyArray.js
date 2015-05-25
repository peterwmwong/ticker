import {errorWrongType} from './errors.js';

const ARRAY_PROTO = Array.prototype;
const ARRAY_FUNCTIONS = {
  splice(index, numToRemove, ...itemsToAdd){
    const spliceArgs = [index, numToRemove];
    const {type, inverse, instanceOf} = this._hasMany;
    itemsToAdd.filter(newItem=>{
      if(instanceOf(newItem, type)){
        // Reach inside the new association and set inverse association
        if(inverse){ newItem[inverse] = this; }
        spliceArgs.push(newItem);
      }
      else if(IS_DEV){
        errorWrongType(type, newItem);
      }
    });

    const removedItems = ARRAY_PROTO.splice.apply(this, spliceArgs);

    // Reach inside the removed association and unset the inverse association
    if(inverse){
      for(let item in removedItems){ item[inverse] = null; }
    }

    return removedItems;
  },

  push(...items){
    this.splice.apply(this, [this.length, 0].concat(items));
    return this.length;
  },

  pop(){ return this.splice.apply(this, [this.length, 1])[0]; },

  unshift(...items){
    this.splice.apply(this, [0, 0].concat(items));
    return this.length;
  }
};

export default function hasManyArray(hasMany){
  const array = [];
  array._hasMany = hasMany;
  for(let method in ARRAY_FUNCTIONS){ array[method] = ARRAY_FUNCTIONS[method]; }
  return array;
}
