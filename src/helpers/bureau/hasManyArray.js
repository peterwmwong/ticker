import {errorWrongType} from './errors.js';

const EMPTY_ARRAY = [];
const ARRAY_PROTO = Array.prototype;
const ARRAY_FUNCTIONS = {
  splice(index, numToRemove, ...itemsToAdd){
    return this._splice(index, numToRemove, itemsToAdd);
  },

  _splice(index, numToRemove, itemsToAdd){
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
    this._splice(this.length, 0, items);
    return this.length;
  },

  pop(){ return this._splice(this.length - 1, 1, EMPTY_ARRAY)[0]; },

  unshift(...items){
    this._splice(0, 0, items);
    return this.length;
  }
};

export default function hasManyArray(hasMany, array){
  if(hasMany.inverse){
    const inverse = hasMany.inverse;
    array.forEach(item=>item[inverse] = item);
  }
  array._hasMany = hasMany;
  for(let method in ARRAY_FUNCTIONS){ array[method] = ARRAY_FUNCTIONS[method]; }
  return array;
}
