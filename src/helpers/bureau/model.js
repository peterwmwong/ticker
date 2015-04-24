import Polymorphic from './polymorphic.js';
import hasManyArray from './hasManyArray.js';
import {errorWrongType} from './errors.js';

// TODO(pwong): Should be inserted by a build step. gulp-replace or something.
const IS_PROD = false;

function instanceOfType(obj, type){ return obj.constructor === type; }

function UNIMPLEMENTED_MAPPER_METHOD(){
  return new Promise((resolve, reject)=>
    reject('A mapper or mapper method was not implemented'));
}

function mergeAttrPropertiesDescriptor(attr, propsDescriptor){
  if(!attr){ return; }
  for(let name in attr){
    propsDescriptor[name] = {
      get(){ return this._rawModelData[name]; },
      set(value){ this._rawModelData[name] = value; }
    };
  }
}

function mergeHasManyPropertiesDescriptor(hasMany, propsDescriptor){
  if(!hasMany){ return; }
  for(let name in hasMany){
    let assoc = hasMany[name];
    assoc.instanceOf =
      instanceOfType(assoc.type, Polymorphic) ? assoc.type.instanceOf : instanceOfType;
    propsDescriptor[name] = {
      get(){
        if(!(name in this._associations)){
          this._associations[name] = hasManyArray(assoc);
        }
        return this._associations[name];
      }
    };
  }
}

function mergeHasOnePropertiesDescriptor(hasOne, propsDescriptor){
  if(!hasOne){ return; }
  for(let name in hasOne){
    let {type, inverse} = hasOne[name];
    let instanceOf =
      instanceOfType(type, Polymorphic) ? type.instanceOf : instanceOfType;
    propsDescriptor[name] = {
      get(){ return this._associations[name]; },
      set(newValue){
        if(instanceOf(newValue, type)){
          this._associations[name] = newValue;

          // Reach inside the new association and set inverse association
          if(inverse){ newValue[inverse] = this; }
        }
        else if(IS_PROD){
          errorWrongType(type, newValue);
        }
      }
    };
  }
}

function getNormalizedMapper(mapper){
  mapper = mapper || {};
  return {
    create: mapper.create || UNIMPLEMENTED_MAPPER_METHOD,
    update: mapper.update || UNIMPLEMENTED_MAPPER_METHOD,
    get   : mapper.get    || UNIMPLEMENTED_MAPPER_METHOD,
    query : mapper.query  || UNIMPLEMENTED_MAPPER_METHOD,
    remove: mapper.remove || UNIMPLEMENTED_MAPPER_METHOD
  };
}

function loadJSONHasOne(hasOne, json){
  for(let name in hasOne){
    let assoc = hasOne[name];
    json[name] = assoc.type.loadJSON(json[name]);
  }
}

function loadJSONHasMany(hasMany, json){
  for(let name in hasMany){
    let type = hasMany[name].type;
    if(json[name] instanceof Array){
      json[name] = json[name].map(a=>type.loadJSON(a));
    }
  }
}

export function polymorphic(types, typeFromJSON){
  return new Polymorphic(types, typeFromJSON);
}

export default class Model {
  constructor(data){
    this.constructor._ensureModelPrepared();

    this._rawModelData = data;
    this._associations = {};
    this._initHasMany(data);
    this._initHasOne(data);
  }

  static loadJSON(json){
    this._ensureModelPrepared();
    loadJSONHasOne(this._desc.hasOne, json);
    loadJSONHasMany(this._desc.hasMany, json);
    return new this(json);
  }

  static get(id){
    this._ensureModelPrepared();
    return this.mapper.get(id).then(data=>this.loadJSON(data));
  }

  static query(options){
    this._ensureModelPrepared();
    return this.mapper.query(options).then(dataArray=>
      dataArray ? dataArray.map(data=>new this(data)) : []
    );
  }

  // Private

  static _ensureModelPrepared(){
    if(this.__modelPrepared){ return; }

    let desc = this._desc = this.desc;
    // Generate the properties (getter/setters) for all attributes and
    // associations
    let propsDescriptor = {};
    mergeAttrPropertiesDescriptor(desc.attr, propsDescriptor);
    mergeHasManyPropertiesDescriptor(desc.hasMany, propsDescriptor);
    mergeHasOnePropertiesDescriptor(desc.hasOne, propsDescriptor);
    Object.defineProperties(this.prototype, propsDescriptor);

    this.mapper = getNormalizedMapper(desc.mapper);
    this.__modelPrepared = true;
  }

  _initHasMany(rawModelData){
    for(let name in this.constructor._desc.hasMany){
      let data = rawModelData[name];
      if(Array.isArray(data)){
        this[name].push(...data);
      }
    }
  }

  _initHasOne(rawModelData){
    for(let name in this.constructor._desc.hasOne){
      this[name] = rawModelData[name];
    }
  }
}
