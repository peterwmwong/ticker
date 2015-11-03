/*

Cross-session, Key-Value, LRU expunging storage.

*/

const REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
const registry = (()=>{
  let r;
  try{ r = JSON.parse(localStorage.getItem(REGISTRY_KEY)); }
  catch(e){} //eslint-disable-line

  if(!r) localStorage.setItem(REGISTRY_KEY, JSON.stringify(r = {}));
  return r;
})();

function removeLRUItem(){
  const lruKey = Object.keys(registry).sort((a, b)=>registry[b] - registry[a]).pop();
  if(lruKey){
    if(IS_DEV) console.warn(`[storage] ${lruKey} bumped`); //eslint-disable-line
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, null);
  }
}

function safeSetItem(key, value){
  let remainingTries = 10;
  while(remainingTries--){
    try{
      localStorage.setItem(key, value);
      return;
    }
    catch(e){ removeLRUItem(); }
  }
  throw new Error(`Unable to make room to store ${key}.`);
}

function updateRegistryKey(key, value){
  if(value) registry[key] = value;
  else delete registry[key];
  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
  return registry;
}

function updateLRUItem(key){ updateRegistryKey(key, Date.now()); }

export default {
  getItem(key){
    const value = localStorage.getItem(key);
    if(value) updateLRUItem(key);
    return value;
  },

  setItem(key, value){
    safeSetItem(key, value);
    updateLRUItem(key);
  }
};
