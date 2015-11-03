const handleCombinedAction = (obj, action, props, state, ...args)=>{
  const r = {};
  let prev;
  for(let key in obj){
    prev = state && state[key];
    r[key] = obj[key][action] ? obj[key][action](props, prev, ...args) : prev;
  }
  return r;
}

export default obj=>{
  const result = {};
  for(let key in obj){
    for(let action in obj[key]){
      result[action] = result[action] ||
        ((...args)=>handleCombinedAction(obj, action, ...args));
    }
  }
  return result;
}
