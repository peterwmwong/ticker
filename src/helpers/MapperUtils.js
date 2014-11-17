import AttrMunger from './AttrMunger';

export function load(model, data){
  return data && model.$load(AttrMunger.camelize(data));
}

export function loadAll(modelArray, data){
  return data && modelArray.$replace(
    modelArray.$class.loadAll(AttrMunger.camelize(data))
  );
}
