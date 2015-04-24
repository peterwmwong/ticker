function Polymorphic(types, typeFromJSON){
  this.types = types;
  this.typeFromJSON = typeFromJSON;
}
Polymorphic.prototype.loadJSON = function(json){
  return this.typeFromJSON(json).loadJSON(json);
};
Polymorphic.prototype.instanceOf = function(obj, polyType){
  for(let type in polyType.types){
    if(obj.constructor === type){ return true; }
  }
  return false;
};

export default Polymorphic;
