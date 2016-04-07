/*

Cross-session, Key-Value, LRU expunging storage.

*/

const REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
let registry;
try{ registry = JSON.parse(localStorage.getItem(REGISTRY_KEY)) }
catch(e){} //eslint-disable-line

if(!registry) localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry = []));

const removeLRUItem = ()=> {
  const lruKey = registry.pop();
  if(lruKey){
    if(process.env.NODE_ENV === 'development'){
      console.warn(`[storage] ${lruKey} bumped`); //eslint-disable-line
    }
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, false);
  }
};

const safeSetItem = (key, value)=> {
  let remainingTries = registry.length;
  while(remainingTries--){
    try{
      localStorage.setItem(key, value);
      return;
    }
    catch(e){ removeLRUItem() }
  }
  if(process.env.NODE_ENV === 'development'){
    console.warn(`Unable to make room to store ${key}.`); //eslint-disable-line
  }
};

const updateRegistryKey = (key, isAdd)=> {
  const keyIndex = registry.indexOf(key);
  if(keyIndex >= 0) registry.splice(keyIndex, 1);
  if(isAdd) registry.unshift(key);

  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
};

const updateLRUItem = (key)=> {updateRegistryKey(key, true)};

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

  getItemObj(key){ return JSON.parse(this.getItem(key) || null) },
  setItemObj(key, value){
    this.setItem(key, JSON.stringify(value));
    return value;
  }
};
