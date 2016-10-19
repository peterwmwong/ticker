/*

Cross-session, Key-Value, LRU expunging storage.

*/

const REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
let registry;
try{ registry = JSON.parse(localStorage.getItem(REGISTRY_KEY)) }
catch(e){} // eslint-disable-line no-empty

if(!registry) localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry = []));

const removeLRUItem = () => {
  const lruKey = registry.pop();
  if(lruKey){
    if(process.env.NODE_ENV === 'development'){
      console.warn(`[storage] ${lruKey} bumped`); // eslint-disable-line no-console
    }
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, false); // eslint-disable-line no-use-before-define
  }
};

const safeSetItem = (key, value) => {
  let remainingTries = registry.length;
  while(remainingTries--){
    try{
      localStorage.setItem(key, value);
      return;
    }
    catch(e){ removeLRUItem() }
  }
  if(process.env.NODE_ENV === 'development'){
    console.warn(`Unable to make room to store ${key}.`); // eslint-disable-line no-console
  }
};

const updateRegistryKey = (key, isAdd) => {
  const keyIndex = registry.indexOf(key);
  if(keyIndex >= 0) registry.splice(keyIndex, 1);
  if(isAdd) registry.unshift(key);

  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
};

const updateLRUItem = key => {updateRegistryKey(key, true)};

export default {
  getItem(key){
    const value = localStorage.getItem(key);
    if(value) updateLRUItem(key);
    return value;
  },

  setItem(key, value){
    safeSetItem(key, value);
    updateLRUItem(key);
    return value;
  },

  getItemObj(key){
    if(process.env.NODE_ENV === 'development') performance.mark(`getItemObj.start(${key})`);

    const valueString = this.getItem(key);

    if(process.env.NODE_ENV === 'development') performance.mark(`getItemObj.JSON.start(${key})`);

    const value = valueString && JSON.parse(valueString);

    if(process.env.NODE_ENV === 'development'){
      performance.mark(`getItemObj.JSON.end(${key})`);
      performance.measure(`getItemObj(${key}).JSON`, `getItemObj.JSON.start(${key})`, `getItemObj.JSON.end(${key})`);

      performance.mark(`getItemObj.end(${key})`);
      performance.measure(`getItemObj(${key})`, `getItemObj.start(${key})`, `getItemObj.end(${key})`);
    }

    return value;
  },
  setItemObj(key, value){
    if(process.env.NODE_ENV === 'development') performance.mark(`setItemObj.start(${key})`);

    this.setItem(key, JSON.stringify(value));

    if(process.env.NODE_ENV === 'development'){
      performance.mark(`setItemObj.end(${key})`);
      performance.measure(`setItemObj(${key})`, `setItemObj.start(${key})`, `setItemObj.end(${key})`);
    }
    return value;
  }
};
