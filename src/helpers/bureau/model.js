import Polymorphic from './polymorphic.js';
import hasManyArray from './hasManyArray.js';
import {
  errorWrongType,
  errorMapperDidntReturnPromise,
  errorMapperMethodNotImplemented
} from './errors.js';

function instanceOfType(obj, type){ return obj.constructor === type; }

function mergeAttrPropertiesDescriptor(attr, propsDescriptor){
  for(let name in attr){
    propsDescriptor[name] = {
      get(){ return this._data[name]; },
      set(value){ this._data[name] = value; }
    };
  }
}

function mergeHasManyPropertiesDescriptor(hasMany, propsDescriptor){
  for(let name in hasMany){
    let assoc = hasMany[name];
    assoc.instanceOf =
      instanceOfType(assoc.type, Polymorphic) ? assoc.type.instanceOf
        : instanceOfType;
    propsDescriptor[name] = {
      get(){
        return this._associations[name] ||
          (this._associations[name] = hasManyArray(assoc, []));
      }
    };
  }
}

function mergeHasOnePropertiesDescriptor(hasOne, propsDescriptor){
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
          if(inverse) newValue[inverse] = this;
        }
        else if(IS_DEV){
          errorWrongType(type, newValue);
        }
      }
    };
  }
}

function loadJSONAttr(attrs, json){
  for(let name in attrs){
    if(attrs[name] === Date && json[name]){
      json[name] = new Date(json[name]);
    }
  }
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
    if(instanceOfType(json[name], Array)){
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

    this._data = data;
    this._associations = {};
    this._initHasMany(data);
    this._initHasOne(data);
  }

  static loadJSON(json){
    this._ensureModelPrepared();
    loadJSONAttr(this._desc.attr, json);
    loadJSONHasOne(this._desc.hasOne, json);
    loadJSONHasMany(this._desc.hasMany, json);
    return new this(json);
  }

  static cacheGet(id){
    if(IS_DEV && !this.desc.mapper.cacheGet){
      errorMapperMethodNotImplemented(this, 'cacheGet');
    }

    let result = this.desc.mapper.cacheGet(id);
    return result && this.loadJSON(result);
  }

  static get(id){
    if(IS_DEV && !this.desc.mapper.get){
      errorMapperMethodNotImplemented(this, 'get');
    }

    const promise = this.desc.mapper.get(id);

    if(IS_DEV && !(promise instanceof Promise)){
      errorMapperDidntReturnPromise(this, 'get', promise);
    }

    return promise.then(data=>this.loadJSON(data));
  }

  static query(options){
    if(IS_DEV && !this.desc.mapper.query){
      errorMapperMethodNotImplemented(this, 'query');
    }

    const promise = this.desc.mapper.query(options);

    if(IS_DEV && !(promise instanceof Promise)){
      errorMapperDidntReturnPromise(this, 'query', promise);
    }
    return promise.then(dataArray=>
      dataArray ? dataArray.map(data=>this.loadJSON(data)) : []
    );
  }

  static localQuery(options){
    if(IS_DEV && !this.desc.mapper.localQuery){
      errorMapperMethodNotImplemented(this, 'localQuery');
    }

    const results = this.desc.mapper.localQuery(options);

    if(IS_DEV && !(results instanceof Array)){
      errorMapperDidntReturnPromise(this, 'localQuery', results);
    }

    return results.map(data=>this.loadJSON(data));
  }

  save(){
    if(IS_DEV && !this.constructor.desc.mapper.save){
      errorMapperMethodNotImplemented(this.constructor, 'save');
    }

    const promise = this.constructor.desc.mapper.save(this);
    if(IS_DEV && !(promise instanceof Promise)){
      errorMapperDidntReturnPromise(this.constructor, 'save', promise);
    }

    return promise.then(data=>data === this ? this : this.loadJSON(data));
  }

  toJSON(){
    const desc = this.constructor._desc;
    const json = {};
    let name;
    for(name in desc.attr){
      if(this[name]) json[name] = this[name];
    }

    for(name in desc.hasMany){
      json[name] = this[name].map(m=>m.toJSON());
    }

    for(name in desc.hasOne){
      if(this[name]) json[name] = this[name].toJSON();
    }
    return json;
  }

  // Private

  static _ensureModelPrepared(){
    if(this._desc) return;
    const desc = this._desc = this.desc;

    // Generate the properties (getter/setters) for all attributes and
    // associations
    const propsDescriptor = {};
    mergeAttrPropertiesDescriptor(desc.attr, propsDescriptor);
    mergeHasManyPropertiesDescriptor(desc.hasMany, propsDescriptor);
    mergeHasOnePropertiesDescriptor(desc.hasOne, propsDescriptor);
    Object.defineProperties(this.prototype, propsDescriptor);
  }

  _initHasMany(rawData){
    const hasMany = this.constructor._desc.hasMany;
    for(let name in hasMany){
      let data = rawData[name];
      if(instanceOfType(data, Array)){
        this._associations[name] = hasManyArray(hasMany[name], data);
      }
    }
  }

  _initHasOne(rawData){
    for(let name in this.constructor._desc.hasOne){
      this[name] = rawData[name];
    }
  }
}
