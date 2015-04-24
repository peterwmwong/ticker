import IDMap from './IDMap.js';
import isEqual from '../isEqual.js';
import singularize from '../singularize.js';

import {
  IdentityAttr,
  StringAttr,
  NumberAttr,
  BooleanAttr,
  DateAttr,
  DateTimeAttr
} from './attrs.js';

const NEW      = 'new';
const EMPTY    = 'empty';
const LOADED   = 'loaded';
const DELETED  = 'deleted';
const NOTFOUND = 'notfound';

// Registry of all Model classes
const allModels = {};
const attrRe = /^__attr_(.*)__$/;
const assocRe = /^__assoc_(.*)__$/;
const attrTypes = {};

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

function resolve(name){ return allModels[name]; }

function extend(dst, src){
  for(let key in src) dst[key] = src[key];
  return dst;
}

function extendMany(dst, srcs){
  return srcs.reduce(extend, dst);
}

function copy(obj){ return extend({}, obj); }

function deepCopy(obj){
  let result = {}, value;
  for(let key in obj){
    value = obj[key];
    result[key] = (typeof value === 'object') ? deepCopy(value) : value;
  }
  return result;
}

function checkAssociatedType(desc, o){
  let klass = resolve(desc.klass);
  if(!(o instanceof klass)){
    throw `${this.$className()}#${desc.name}: expected an object of type '${klass}' but received ${o} instead`;
  }
}

function inverseAdded(name, model){
  let desc = this.constructor[`__assoc_${name}__`];
  if(!desc){
    throw this.$className() + "#inverseAdded: unknown association '" + name + "': " + this;
  }
  if(desc.type === 'hasOne'){
    hasOneSet.call(this, desc, model, false);
  }
  else if(desc.type === 'hasMany'){
    hasManyAdd.call(this, desc, [model], false);
  }
}

// TODO(pwong): swap this <-> model, so it bind() and called more easily hasManySet
function inverseRemoved(name, model){
  let desc = this.constructor[`__assoc_${name}__`];
  if(!desc){
    throw (`${this.$className()}#inverseRemoved: unknown association '${name}': ${this}`);
  }
  if(desc.type === 'hasOne'){
    hasOneSet.call(this, desc, null, false);
  }
  else if(desc.type === 'hasMany'){
    hasManyRemove.call(this, desc, [model], false);
  }
}

// TODO(pwong): Can we move hasOneSet (and the like) put on Model.prototype?
function hasOneSet(desc, v, sync){
  let {name, inverse} = desc;
  let key = `__${name}__`;
  let prev = this[key];
  if(v){
    checkAssociatedType.call(this, desc, v);
  }
  this[`__${name}__`] = v;
  if(desc.owner && this.$isLoaded){
    setChange.call(this, name, prev);
  }
  if(sync && inverse && prev){
    inverseRemoved.call(prev, inverse, this);
  }
  if(sync && inverse && v){
    inverseAdded.call(v, inverse, this);
  }
}

function hasManySet(desc, a){
  let name = desc.name;
  let prev = this[name];

  a.forEach(checkAssociatedType.bind(this, desc));
  if(desc.inverse){
    prev.forEach((x)=>inverseRemoved.call(x, desc.inverse, this));
    a.forEach((x)=>inverseAdded.call(x, desc.inverse, this));
  }
  this[`__${desc.name}__`] = a;
  if(desc.owner && this.$isLoaded){
    setChange.call(this, name, prev);
  }
}

function hasManyAdd(desc, models, sync){
  let name = desc.name;
  let prev = this[name].slice();

  models.forEach(m=>{
    checkAssociatedType.call(this, desc, m);
    if(sync && desc.inverse){
      inverseAdded.call(m, desc.inverse, this);
    }
    this[name].push(m);
  });

  if(desc.owner && this.$isLoaded){
    setChange.call(this, name, prev);
  }
}

function hasManyRemove(desc, models, sync){
  let name = desc.name;
  let prev = this[name].slice();
  models.forEach(m=>{
    let i = this[name].indexOf(m);
    if(i >= 0){
      if(sync && desc.inverse){
        inverseRemoved.call(m, desc.inverse, this);
      }
      this[name].splice(i, 1);
      if(desc.owner && this.$isLoaded){
        setChange.call(this, name, prev);
      }
    }
  });
}

function setChange(name, value){
  if (!(name in this.changes)){
    this.changes[name] = value;
  }
  if (isEqual(this[name], this.changes[name])){
    delete this.changes[name];
  }
}

function setPristine(){
  this.changes = {};
}

function ensurePromise(promise, fName){
  if(promise.then == null){
    throw `${fName}: expected a promise to be returned from the mapper, but got: ${promise}`;
  }
  return promise;
}

function buildQueryArray(klass){
  let isBusy = false;
  let queued = null;
  let promise = null;
  return Object.defineProperties([], {
    $class:{
      get:()=>klass,
      enumerable: false,
      configurable: false
    },
    $promise:{
      get:()=>promise,
      enumerable: false,
      configurable: false
    },
    $isBusy:{
      get:()=>isBusy,
      enumerable: false,
      configurable: false
    },
    $query:{
      value(...args){
        if(isBusy){
          queued = args;
        }
        else{
          isBusy = true;
          promise = ensurePromise(klass.mapper.query(...[this, ...args]), '$query')
            .then(
              ()=>{
                isBusy = false;
                if(queued) this.$query(...queued);
                return this;
              },
              (error)=>{
                isBusy = false;
                if(queued) this.$query(...queued);
                throw error;
              }
            );
        }
        return this;
      },
      enumerable: false,
      configurable: false,
      writable: false
    },
    $replace:{
      value(a){
        this.splice(...[0, this.length, ...a]);
        return this;
      },
      enumerable: false,
      configurable: false,
      writable: false
    }
  });
}

function mapperGet(model, ...args){
  model.__$isBusy__ = true;
  model.__$promise__ =
    ensurePromise(model.constructor.mapper.get(model, ...args), 'mapperGet')
      .then(
        ()=>{
          model.__$sourceState__ = LOADED;
          model.__$isBusy__ = false;
          return model;
        },
        error=>{
          if(model.__$sourceState__ === EMPTY){
            model.__$sourceState__ = NOTFOUND;
          }
          model.__$isBusy__ = false;
          throw error;
        }
      );
  return model;
}


// Internal: Invokes the data mapper's `create` method and does some model
// state bookkeeping.
function mapperCreate(model, ...args){
  model.__$isBusy__ = true;
  model.__$promise__ =
    ensurePromise(model.constructor.mapper.create(model, ...args), 'mapperCreate')
      .then(
        ()=>{
          model.__$sourceState__ = LOADED;
          model.__$isBusy__ = false;
          return model;
        },
        (error)=>{
          model.__$isBusy__ = false;
          throw error;
        }
      );
  return model;
}

function mapperUpdate(model, ...args){
  model.__$isBusy__ = true;
  model.__$promise__ =
    ensurePromise(model.constructor.mapper.update(model, ...args), 'mapperUpdate')
      .then(
        ()=>{
          model.__$isBusy__ = false;
          return model;
        },
        (error)=>{
          model.__$isBusy__ = false;
          throw error;
        }
      );
  return model;
}

function mapperDeleteSuccess(model){
  IDMap.delete(model);
  model.__$sourceState__ = DELETED;
  model.__$isBusy__      = false;
  setPristine.call(model);

  // update any associations this model is involved in
  let associations = model.constructor.associations();
  for(let name of Object.keys(associations)){
    let desc = associations[name];
    let m = model[name];
    if(desc.inverse){
      if(desc.type === 'hasMany') {
        model[name].slice(0).forEach((m2)=>{
          inverseRemoved.call(m2, desc.inverse, model);
        });
      }
      else if(desc.type === 'hasOne' && m)
        inverseRemoved.call(m, desc.inverse, model);
    }
  }
  return model;
}

function mapperDelete(model, ...args){
  model.__$isBusy__ = true;
  model.__$promise__ =
    ensurePromise(model.constructor.mapper.delete(model, ...args), 'mapperDelete')
      .then(
        ()=>{
          model.__$isBusy__ = false;
          mapperDeleteSuccess(model);
        },
        (error)=>{
          model.__$isBusy__ = false;
          throw error;
        }
      );
  return model;
}

class Model {
  static create(createFn){
    if(allModels[this.className()]){
      throw "Model.create: cannot to create the "+this.className()+" model more than once";
    }else{
      allModels[this.className()] = this;
      if(createFn)
        createFn.call(this, this);
    }
  }

  static className(){
    return this.__className__ || (this.__className__ = Function.prototype.toString.call(this).match(/^\s*function\s+(\w+)/)[1]);
  }

  static registerAttr(name, converter){
    if(attrTypes[name]){
      throw ("Model.registerAttr: an attribute type with the name '" + name + "' has already been defined");
    }
    attrTypes[name] = converter;
    return this;
  }

  static attr(name, type){
    let converter = attrTypes[type];
    let key = `__${name}__`;
    if(!converter)
      throw `${this.className()}.attr: unknown type: ${type}`;

    this[`__attr_${name}__`] = {
      type: type,
      converter: converter
    };
    Object.defineProperty(this.prototype, name, {
      get(){return this[key];},
      set(v){
        let prev = this[key];
        this[key] = converter.coerce(v);
        if(this.$isLoaded)
          return setChange.call(this, name, prev);
      },
      enumerable: true,
      configurable: false
    });
  }

  static prop(name, opts={}){
    let DEFAULT_PROPERTY_OPTS = {
      enumerable: true,
      configurable: false
    };
    Object.defineProperty(this.prototype, name,
      extend(DEFAULT_PROPERTY_OPTS, typeof opts === 'function' ? {get:opts} : opts));
  }

  static attrs(){
    let o = {};
    let name;
    for(let k in this){
      name = k.match(attrRe);
      if(name && name[1])
        o[name[1]] = this[k];
    }
    return o;
  }

  static hasAttr(name){
    return `__attr_${name}__` in this || name === 'id';
  }

  static hasOne(name, klass, opts={}){
    let descriptor = this["__assoc_" + name + "__"] = extend(copy(opts), {
      type: 'hasOne',
      name: name,
      klass: klass
    });
    Object.defineProperty(this.prototype, name, {
      get(){return this[`__${name}__`] || null;},
      set(v){
        return hasOneSet.call(this, descriptor, v, true);
      },
      enumerable: true,
      configurable: false
    });
  }

  static hasMany(name, klass, opts={}){
    let cap = capitalize(name);
    let desc = this[`__assoc_${name}__`] = extend(copy(opts), {
      type: 'hasMany',
      name: name,
      klass: klass,
      singular: singularize(name)
    });
    Object.defineProperty(this.prototype, name, {
      get(){
        let _name = `__${name}__`;
        return this[_name] || (this[_name] = []);
      },
      set(v){return hasManySet.call(this, desc, v);},
      enumerable: true,
      configurable: false
    });

    this.prototype[`add${cap}`] = function(...args){
      hasManyAdd.call(this, desc, (1 <= args.length ? args : []), true);
    };
    this.prototype[`remove${cap}`] = function(...args){
      hasManyRemove.call(this, desc, (1 <= args.length ? args : []), true);
    };
    this.prototype[`clear${cap}`] = function(){
      hasManySet.call(this, desc, []);
    };
  }

  // TODO(pwong): Cache associations
  static associations(){
    let o = {};
    let name;
    for(let k in this){
      name = k.match(assocRe);
      if(name && name[1])
        o[name[1]] = this[k];
    }
    return deepCopy(o);
  }

  static hasAssociation(name){
    return `__assoc_${name}__` in this;
  }

  static hasName(name){
    return this.hasAttr(name) || this.hasAssociation(name);
  }

  static empty(id){
    let model = new this({id:id});
    model.__$sourceState__ = EMPTY;
    return model;
  }

  static load(attrs){
    let id = attrs.id || attrs.uuid;
    if(id == null){
      throw `${this.className()}.load: an 'id' attribute is required`;
    }
    attrs = copy(attrs);
    let model = IDMap.get(this, id) || new this();
    delete attrs.id;
    let associations = this.associations();
    let associated = {};
    for(let name in associations){
      let desc = associations[name];
      if(name in attrs){
        associated[name] = attrs[name];
        delete attrs[name];
      }else if(desc.type === 'hasOne' && `${name}Id` in attrs){
        associated[name] = attrs[`${name}Id`];
        delete attrs[`${name}Id`];
      }else if(desc.type === 'hasOne' && `${name}_id` in attrs){
        associated[name] = attrs["" + name + "_id"];
        delete attrs["" + name + "_id"];
      }else if(desc.type === 'hasMany' && `${desc.singular}Ids` in attrs){
        associated[name] = attrs[`${desc.singular}Ids`];
        delete attrs[`${desc.singular}Ids`];
      }else if(desc.type === 'hasMany' && `${desc.singular}_ids` in attrs){
        associated[name] = attrs[`${desc.singular}_ids`];
        delete attrs[`${desc.singular}_ids`];
      }
    }
    for (let k in attrs){
      let v = attrs[k];
      if(model.constructor.hasName(k))
        model[k] = v;
    }
    if(model.id == null)
      model.id = id;

    for(name in associated){
      let klass = resolve(associations[name].klass);
      let data = associated[name];
      let type = associations[name].type;
      if(data){
        if(type === 'hasOne'){
          let other = typeof data === 'object' ? klass.load(data) : IDMap.get(klass, data) || klass.empty(data);
          model[name] = other;
          setPristine.call(other);
        }else if(type === 'hasMany'){
          let others = [], o;
          for(o of data)
            others.push(typeof o === 'object' ? klass.load(o) : IDMap.get(klass, o) || klass.empty(o));

          model[name] = others;

          for(o of others)
            setPristine.call(o);
        }
      }
    }
    model.__$sourceState__ = LOADED;
    setPristine.call(model);
    model.__$isBusy__ = false;
    return model;
  }

  static loadAll(objects){
    return objects.map(o=>this.load(o));
  }

  static query(...args){
    return this.buildQuery().$query(...args);
  }

  static buildQuery(){
    return buildQueryArray(this);
  }

  static local(id){
    return IDMap.get(this, id) || this.empty(id);
  }

  static get(id, opts={}){
    let model = this.local(id);
    let params = copy(opts);
    delete params.refresh;
    if(model.$isEmpty || opts.refresh)
      mapperGet(model, params);
    return model;
  }

  static reset(){
    allModels = {};
    IDMap.reset();
  }

  static extend(...args){
    return extendMany(this, args);
  }

  constructor(attrs = {}){
    this.__$sourceState__ = NEW;
    this.__$isBusy__ = false;
    this.changes = {};

    for(let k in attrs)
      if(this.constructor.hasName(k))
        this[k] = attrs[k];
  }

  $load(attrs){
    let id = attrs.id || attrs.uuid;
    if (!((id != null) || (this.id != null)))
      throw `${this.$className()}#$load: an 'id' attribute is required`;
    if ((this.id != null) && (id != null) && id !== this.id)
      throw `${this.$className()}#$load: received attributes with id ${id} but instance already has id ${this.id}`;
    if (this.id == null)
      this.id = id;
    attrs.id = this.id;
    this.constructor.load(attrs);
    return this;
  }

  $className(){
    return this.constructor.className();
  }

  toString(){
    let klass = this.$className();
    let state = this.$stateString();
    if(this.$isEmpty)
      return `#<${klass} (${state}) `+JSON.stringify({id:this.id})+'>';

    let attrs = this.$attrs();
    let associations = this.constructor.associations();
    for(let name in associations){
      let desc = associations[name];
      attrs[desc.name] =
        (desc.type === 'hasMany') ?
          this[desc.name].map(m=>m.id) :
          (this[desc.name] ? this[desc.name].id : undefined);
    }
    return `#<${klass} (${state}) ${JSON.stringify(attrs)}>`;
  }

  $attrs(){
    let o = {};
    let attrs = this.constructor.attrs();
    for(let k in attrs)
      o[k] = attrs[k].converter.serialize(this[k]);
    if(this.id != null)
      o.id = this.id;
    return o;
  }

  $stateString(){
    let a = [this.$sourceState.toUpperCase()];
    if(this.$hasChanges())
      a.push('DIRTY');
    if (this.$isBusy)
      a.push('BUSY');
    return a.join('-');
  }

  $hasChanges(){
    if(Object.keys(this.changes).length !== 0)
      return true;

    let associations = this.constructor.associations();
    for(let name in associations){
      let desc = associations[name];
      if(desc.owner){
        let assoc = this[desc.name];
        if(desc.type === 'hasMany'){
          for(let o of assoc)
            if(o.$hasChanges())
              return true;
        }else if(assoc && assoc.$hasChanges())
          return true;
      }
    }
    return false;
  }

  $undoChanges(){
    if(this.$isDeleted)
      throw `${this.$className()}#$undoChanges: attempted to undo changes on a DELETED model: ${this}`;

    for(let k in this.changes)
      this[k] = this.changes[k];

    let associations = this.constructor.associations();
    for(let name in associations){
      let desc = associations[name];
      let association = this[desc.name];
      if(desc.owner){
        if(desc.type === 'hasMany')
          association.forEach(m=>m.$undoChanges());
        else if(association)
          association.$undoChanges();
      }
    }
    setPristine.call(this);
    return this;
  }

  $get(...args){
    if((!this.$isLoaded && !this.$isEmpty) || this.$isBusy)
      throw `${this.$className()}#$get: cannot get a model in the ${this.$stateString()} state: ${this}`;

    return mapperGet(...[this, ...args]);
  }

  $save(...args){
    if((!this.$isNew && !this.$isLoaded) || this.$isBusy)
      throw `${this.$className()}#$save: cannot save a model in the ${this.$stateString()} state: ${this}`;

    (this.$isNew ? mapperCreate : mapperUpdate)(...[this, ...args]);
    return this;
  }

  $delete(...args){
    if(this.$isDeleted)
      return this;

    if(this.$isBusy)
      throw `${this.$className()}#$delete: cannot delete a model in the ${this.$stateString()} state: ${this}`;

    if(this.$isNew)
      mapperDeleteSuccess(this);
    else
      mapperDelete(...[this, ...args]);

    return this;
  }

  get id(){return this.__id__;}
  set id(v){
    if(this.__id__)
      throw this.$className() + "#id (setter): overwriting a model's identity is not allowed: " + this;
    this.__id__ = v;
    IDMap.insert(this);
  }

  get $promise(){    return this.__$promise__;}
  get $sourceState(){return this.__$sourceState__;}
  get $isNew(){      return this.$sourceState === NEW;}
  get $isEmpty(){    return this.$sourceState === EMPTY;}
  get $isLoaded(){   return this.$sourceState === LOADED;}
  get $isDeleted(){  return this.$sourceState === DELETED;}
  get $isNotfound(){ return this.$sourceState === NOTFOUND;}
  get $isBusy(){     return this.__$isBusy__;}
}

Model.toString = Model.className;

Model.registerAttr('identity', IdentityAttr);
Model.registerAttr('string',   StringAttr);
Model.registerAttr('number',   NumberAttr);
Model.registerAttr('boolean',  BooleanAttr);
Model.registerAttr('date',     DateAttr);
Model.registerAttr('datetime', DateTimeAttr);

export default Model;
