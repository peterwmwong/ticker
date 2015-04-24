function Polymorphic(types, typeFromJSON){
  this.types = types;
  this.typeFromJSON = typeFromJSON;
}
Polymorphic.prototype.loadJSON = function(json){
  return this.typeFromJSON(json).loadJSON(json);
};
Polymorphic.prototype.instanceOf = function(obj, polyType){
  for(let i = 0; i < polyType.types.length; ++i){
    if(obj.constructor === polyType.types[i]){ return true; }
  }
  return false;
};

export default Polymorphic;
