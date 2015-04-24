export function load(model, data){
  return data && model.$load(data);
}

export function loadAll(modelArray, data){
  return data && modelArray.$replace(modelArray.$class.loadAll(data));
}
