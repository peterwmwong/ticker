System.register("elements/cards/ticker-github-branch", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-branch";
  function require(path) {
    return $traceurRuntime.require("elements/cards/ticker-github-branch", path);
  }
  return {
    setters: [],
    execute: function() {
      Polymer('ticker-github-branch', {branchChanged: function(_, branch) {
          this.branchName = branch && branch.split('/').slice(-1);
        }});
    }
  };
});
System.register("helpers/is", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/is";
  function require(path) {
    return $traceurRuntime.require("helpers/is", path);
  }
  return {
    setters: [],
    execute: function() {
      $__export('default', {
        aString: function(value) {
          return typeof value === 'string';
        },
        aObject: function(value) {
          return value != null && typeof value === 'object';
        },
        aWindow: function(obj) {
          return obj && obj.document && obj.location && obj.alert && obj.setInterval;
        },
        aFunction: function(value) {
          return typeof value == 'function';
        },
        aRegExp: function(value) {
          return Object.prototype.toString.call(value) == '[object RegExp]';
        },
        aDate: function(value) {
          return Object.prototype.toString.call(value) == '[object Date]';
        },
        aArray: function(value) {
          return Object.prototype.toString.call(value) == '[object Array]';
        }
      });
    }
  };
});
System.register("helpers/isEqual", ["./is"], function($__export) {
  "use strict";
  var __moduleName = "helpers/isEqual";
  function require(path) {
    return $traceurRuntime.require("helpers/isEqual", path);
  }
  var is;
  function isEqual(o1, o2) {
    if (o1 === o2)
      return true;
    if (o1 === null || o2 === null)
      return false;
    if (o1 !== o1 && o2 !== o2)
      return true;
    var t1 = typeof o1,
        t2 = typeof o2,
        length,
        key,
        keySet;
    if (t1 == t2) {
      if (t1 == 'object') {
        if (is.aArray(o1)) {
          if (!is.aArray(o2))
            return false;
          if ((length = o1.length) == o2.length) {
            for (key = 0; key < length; key++) {
              if (!isEqual(o1[key], o2[key]))
                return false;
            }
            return true;
          }
        } else if (is.aDate(o1)) {
          return is.aDate(o2) && o1.getTime() == o2.getTime();
        } else if (is.aRegExp(o1) && is.aRegExp(o2)) {
          return o1.toString() == o2.toString();
        } else {
          if (is.aWindow(o1) || is.aWindow(o2) || is.aArray(o2))
            return false;
          keySet = {};
          for (key in o1) {
            if (key.charAt(0) === '$' || is.aFunction(o1[key]))
              continue;
            if (!isEqual(o1[key], o2[key]))
              return false;
            keySet[key] = true;
          }
          for (key in o2) {
            if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !is.aFunction(o2[key]))
              return false;
          }
          return true;
        }
      }
    }
    return false;
  }
  $__export("default", isEqual);
  return {
    setters: [function(m) {
      is = m.default;
    }],
    execute: function() {
    }
  };
});
System.register("helpers/singularize", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/singularize";
  function require(path) {
    return $traceurRuntime.require("helpers/singularize", path);
  }
  function singularize(word) {
    return word.replace(/s$/, '');
  }
  $__export("default", singularize);
  return {
    setters: [],
    execute: function() {
    }
  };
});
System.register("helpers/model/IDMap", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/model/IDMap";
  function require(path) {
    return $traceurRuntime.require("helpers/model/IDMap", path);
  }
  var nextClassId,
      models;
  return {
    setters: [],
    execute: function() {
      nextClassId = 0;
      models = {};
      $__export('default', {
        insert: function(model) {
          model.constructor.__classId__ = model.constructor.__classId__ || nextClassId++;
          var id = model.id;
          var map = models[model.constructor.__classId__] = (models[model.constructor.__classId__] || {});
          if (map[id])
            throw (model.$className() + ": a model with id '" + id + "' already exists");
          map[id] = model;
        },
        get: (function(klass, id) {
          return models[klass.__classId__] && models[klass.__classId__][id];
        }),
        all: (function(klass) {
          return Object.keys(models[klass.__classId__]);
        }),
        delete: function(model) {
          var map = models[model.constructor.__classId__];
          if (map)
            delete map[model.id];
        },
        reset: function() {
          models = {};
        }
      });
    }
  };
});
System.register("helpers/model/attrs", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/model/attrs";
  function require(path) {
    return $traceurRuntime.require("helpers/model/attrs", path);
  }
  var IdentityAttr,
      StringAttr,
      NumberAttr,
      BooleanAttr,
      DateAttr,
      noTZRe,
      DateTimeAttr;
  return {
    setters: [],
    execute: function() {
      IdentityAttr = $__export("IdentityAttr", {
        coerce: (function(v) {
          return v;
        }),
        serialize: (function(v) {
          return v;
        })
      });
      StringAttr = $__export("StringAttr", {
        coerce: (function(v) {
          return v ? '' + v : v;
        }),
        serialize: (function(s) {
          return s;
        })
      });
      NumberAttr = $__export("NumberAttr", {
        coerce: (function(v) {
          return (typeof v === 'string') ? parseFloat(v, 10) : (typeof v === 'number') ? v : null;
        }),
        serialize: (function(v) {
          return v;
        })
      });
      BooleanAttr = $__export("BooleanAttr", {
        coerce: (function(v) {
          return !!v;
        }),
        serialize: (function(v) {
          return v;
        })
      });
      DateAttr = $__export("DateAttr", {
        coerce: function(v) {
          if (!v || v instanceof Date)
            return v;
          if (typeof v === 'number')
            return new Date(v);
          if (typeof v != 'string')
            throw ("DateAttr#coerce: don't know how to convert '" + v + "' to a Date");
          var parts = v.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
          if (!parts)
            throw ("DateAttr#coerce: don't know how to parse '" + v + "' to a Date");
          return new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
        },
        serialize: function(date) {
          if (!date)
            return null;
          var y = date.getFullYear().toString();
          var m = (date.getMonth() + 1).toString();
          var d = date.getDate().toString();
          m = (m.length === 1) ? '0' + m : m;
          d = (d.length === 1) ? '0' + d : d;
          return (y + "-" + m + "-" + d);
        }
      });
      noTZRe = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?$/;
      DateTimeAttr = $__export("DateTimeAttr", {
        coerce: function(v) {
          if (!v || v instanceof Date)
            return v;
          if (typeof v === 'number')
            return new Date(v);
          if (typeof v !== 'string')
            throw ("DateTimeAttr#coerce: don't know how to convert '" + v + "' to a Date");
          if (v.match(noTZRe))
            v += 'Z';
          var t = Date.parse(v);
          if (!t)
            throw ("DateTimeAttr#coerce: don't know how to parse '" + v + "' to a Date");
          return new Date(t);
        },
        serialize: (function(v) {
          return v && v.toJSON();
        })
      });
    }
  };
});
System.register("helpers/model/Model", ["./IDMap", "../isEqual", "../singularize", "./attrs"], function($__export) {
  "use strict";
  var __moduleName = "helpers/model/Model";
  function require(path) {
    return $traceurRuntime.require("helpers/model/Model", path);
  }
  var IDMap,
      isEqual,
      singularize,
      IdentityAttr,
      StringAttr,
      NumberAttr,
      BooleanAttr,
      DateAttr,
      DateTimeAttr,
      allModels,
      attrRe,
      assocRe,
      attrTypes,
      capitalize,
      resolve,
      Model,
      NEW,
      EMPTY,
      LOADED,
      DELETED,
      NOTFOUND;
  function extend(dst, src) {
    for (var key in src)
      dst[key] = src[key];
    return dst;
  }
  function extendMany(dst, srcs) {
    return srcs.reduce(extend, dst);
  }
  function copy(obj) {
    return extend({}, obj);
  }
  function deepCopy(obj) {
    var result = {},
        value;
    for (var key in obj) {
      value = obj[key];
      result[key] = (typeof value === 'object') ? deepCopy(value) : value;
    }
    return result;
  }
  function checkAssociatedType(desc, o) {
    var klass = resolve(desc.klass);
    if (!(o instanceof klass))
      throw (this.$className() + "#" + desc.name + ": expected an object of type '" + klass + "' but received " + o + " instead");
  }
  function inverseAdded(name, model) {
    var desc = this.constructor["__assoc_" + name + "__"];
    if (!desc)
      throw this.$className() + "#inverseAdded: unknown association '" + name + "': " + this;
    if (desc.type === 'hasOne')
      hasOneSet.call(this, desc, model, false);
    else if (desc.type === 'hasMany')
      hasManyAdd.call(this, desc, [model], false);
  }
  function inverseRemoved(name, model) {
    var desc = this.constructor["__assoc_" + name + "__"];
    if (!desc)
      throw ("" + (this.$className()) + "#inverseRemoved: unknown association '" + name + "': " + this);
    if (desc.type === 'hasOne')
      hasOneSet.call(this, desc, null, false);
    else if (desc.type === 'hasMany')
      hasManyRemove.call(this, desc, [model], false);
  }
  function hasOneSet(desc, v, sync) {
    var $__15 = desc,
        name = $__15.name,
        inverse = $__15.inverse;
    var key = ("__" + name + "__");
    var prev = this[key];
    if (v)
      checkAssociatedType.call(this, desc, v);
    this["__" + name + "__"] = v;
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
    if (sync && inverse && prev)
      inverseRemoved.call(prev, inverse, this);
    if (sync && inverse && v)
      inverseAdded.call(v, inverse, this);
  }
  function hasManySet(desc, a) {
    var $__0 = this;
    var name = desc.name;
    var prev = this[name];
    a.forEach(checkAssociatedType.bind(this, desc));
    if (desc.inverse) {
      prev.forEach((function(x) {
        return inverseRemoved.call(x, desc.inverse, $__0);
      }));
      a.forEach((function(x) {
        return inverseAdded.call(x, desc.inverse, $__0);
      }));
    }
    this[("__" + desc.name + "__")] = a;
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyAdd(desc, models, sync) {
    var $__0 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      checkAssociatedType.call($__0, desc, m);
      if (sync && desc.inverse)
        inverseAdded.call(m, desc.inverse, $__0);
      $__0[name].push(m);
    }));
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyRemove(desc, models, sync) {
    var $__0 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      var i = $__0[name].indexOf(m);
      if (i >= 0) {
        if (sync && desc.inverse)
          inverseRemoved.call(m, desc.inverse, $__0);
        $__0[name].splice(i, 1);
        if (desc.owner && $__0.$isLoaded)
          setChange.call($__0, name, prev);
      }
    }));
  }
  function setChange(name, value) {
    if (!(name in this.changes))
      this.changes[name] = value;
    if (isEqual(this[name], this.changes[name]))
      delete this.changes[name];
  }
  function setPristine() {
    this.changes = {};
  }
  function ensurePromise(promise, fName) {
    if (promise.then == null)
      throw fName + ": expected a promise to be returned from the mapper, but got: " + promise;
    return promise;
  }
  function buildQueryArray(klass) {
    var isBusy = false;
    var queued = null;
    var promise = null;
    return Object.defineProperties([], {
      $class: {
        get: (function() {
          return klass;
        }),
        enumerable: false,
        configurable: false
      },
      $promise: {
        get: (function() {
          return promise;
        }),
        enumerable: false,
        configurable: false
      },
      $isBusy: {
        get: (function() {
          return isBusy;
        }),
        enumerable: false,
        configurable: false
      },
      $query: {
        value: function() {
          var $__16;
          for (var args = [],
              $__6 = 0; $__6 < arguments.length; $__6++)
            args[$__6] = arguments[$__6];
          var $__0 = this;
          if (isBusy) {
            queued = args;
          } else {
            isBusy = true;
            promise = ensurePromise(($__16 = klass.mapper).query.apply($__16, $traceurRuntime.spread($traceurRuntime.spread([this], args))), '$query').then((function() {
              var $__17;
              isBusy = false;
              if (queued)
                ($__17 = $__0).$query.apply($__17, $traceurRuntime.spread(queued));
              return $__0;
            }), (function(error) {
              var $__17;
              isBusy = false;
              if (queued)
                ($__17 = $__0).$query.apply($__17, $traceurRuntime.spread(queued));
              throw error;
            }));
          }
          return this;
        },
        enumerable: false,
        configurable: false,
        writable: false
      },
      $replace: {
        value: function(a) {
          var $__16;
          ($__16 = this).splice.apply($__16, $traceurRuntime.spread($traceurRuntime.spread([0, this.length], a)));
          return this;
        },
        enumerable: false,
        configurable: false,
        writable: false
      }
    });
  }
  function mapperGet(model) {
    var $__16;
    for (var args = [],
        $__6 = 1; $__6 < arguments.length; $__6++)
      args[$__6 - 1] = arguments[$__6];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__16 = model.constructor.mapper).get.apply($__16, $traceurRuntime.spread([model], args)), 'mapperGet').then((function() {
      model.__$sourceState__ = LOADED;
      model.__$isBusy__ = false;
      return model;
    }), (function(error) {
      if (model.__$sourceState__ === EMPTY)
        model.__$sourceState__ = NOTFOUND;
      model.__$isBusy__ = false;
      throw error;
    }));
    return model;
  }
  function mapperCreate(model) {
    var $__16;
    for (var args = [],
        $__7 = 1; $__7 < arguments.length; $__7++)
      args[$__7 - 1] = arguments[$__7];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__16 = model.constructor.mapper).create.apply($__16, $traceurRuntime.spread([model], args)), 'mapperCreate').then((function() {
      model.__$sourceState__ = LOADED;
      model.__$isBusy__ = false;
      return model;
    }), (function(error) {
      model.__$isBusy__ = false;
      throw error;
    }));
    return model;
  }
  function mapperUpdate(model) {
    var $__16;
    for (var args = [],
        $__8 = 1; $__8 < arguments.length; $__8++)
      args[$__8 - 1] = arguments[$__8];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__16 = model.constructor.mapper).update.apply($__16, $traceurRuntime.spread([model], args)), 'mapperUpdate').then((function() {
      model.__$isBusy__ = false;
      return model;
    }), (function(error) {
      model.__$isBusy__ = false;
      throw error;
    }));
    return model;
  }
  function mapperDeleteSuccess(model) {
    IDMap.delete(model);
    model.__$sourceState__ = DELETED;
    model.__$isBusy__ = false;
    setPristine.call(model);
    var associations = model.constructor.associations();
    for (var $__2 = Object.keys(associations)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__3; !($__3 = $__2.next()).done; ) {
      var name = $__3.value;
      {
        var desc = associations[name];
        var m = model[name];
        if (desc.inverse) {
          if (desc.type === 'hasMany')
            model[name].slice(0).forEach((function(m2) {
              inverseRemoved.call(m2, desc.inverse, model);
            }));
          else if (desc.type === 'hasOne' && m)
            inverseRemoved.call(m, desc.inverse, model);
        }
      }
    }
    return model;
  }
  function mapperDelete(model) {
    var $__16;
    for (var args = [],
        $__9 = 1; $__9 < arguments.length; $__9++)
      args[$__9 - 1] = arguments[$__9];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__16 = model.constructor.mapper).delete.apply($__16, $traceurRuntime.spread([model], args)), 'mapperDelete').then((function() {
      model.__$isBusy__ = false;
      mapperDeleteSuccess(model);
    }), (function(error) {
      model.__$isBusy__ = false;
      throw error;
    }));
    return model;
  }
  return {
    setters: [function(m) {
      IDMap = m.default;
    }, function(m) {
      isEqual = m.default;
    }, function(m) {
      singularize = m.default;
    }, function(m) {
      IdentityAttr = m.IdentityAttr;
      StringAttr = m.StringAttr;
      NumberAttr = m.NumberAttr;
      BooleanAttr = m.BooleanAttr;
      DateAttr = m.DateAttr;
      DateTimeAttr = m.DateTimeAttr;
    }],
    execute: function() {
      allModels = {};
      attrRe = /^__attr_(.*)__$/;
      assocRe = /^__assoc_(.*)__$/;
      attrTypes = {};
      capitalize = (function(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      });
      resolve = (function(name) {
        return allModels[name];
      });
      Model = (function() {
        var Model = function Model() {
          var attrs = arguments[0] !== (void 0) ? arguments[0] : {};
          this.__$sourceState__ = NEW;
          this.__$isBusy__ = false;
          this.changes = {};
          for (var k in attrs)
            if (this.constructor.hasName(k))
              this[k] = attrs[k];
        };
        return ($traceurRuntime.createClass)(Model, {
          $load: function(attrs) {
            var id = attrs.id || attrs.uuid;
            if (!((id != null) || (this.id != null)))
              throw (this.$className() + "#$load: an 'id' attribute is required");
            if ((this.id != null) && (id != null) && id !== this.id)
              throw (this.$className() + "#$load: received attributes with id " + id + " but instance already has id " + this.id);
            if (this.id == null)
              this.id = id;
            attrs.id = this.id;
            this.constructor.load(attrs);
            return this;
          },
          $className: function() {
            return this.constructor.className();
          },
          toString: function() {
            var klass = this.$className();
            var state = this.$stateString();
            if (this.$isEmpty)
              return ("#<" + klass + " (" + state + ") ") + JSON.stringify({id: this.id}) + '>';
            var attrs = this.$attrs();
            var associations = this.constructor.associations();
            for (var name in associations) {
              var desc = associations[name];
              attrs[desc.name] = (desc.type === 'hasMany') ? this[desc.name].map((function(m) {
                return m.id;
              })) : (this[desc.name] ? this[desc.name].id : undefined);
            }
            return ("#<" + klass + " (" + state + ") " + JSON.stringify(attrs) + ">");
          },
          $attrs: function() {
            var o = {};
            var attrs = this.constructor.attrs();
            for (var k in attrs)
              o[k] = attrs[k].converter.serialize(this[k]);
            if (this.id != null)
              o.id = this.id;
            return o;
          },
          $stateString: function() {
            var a = [this.$sourceState.toUpperCase()];
            if (this.$hasChanges())
              a.push('DIRTY');
            if (this.$isBusy)
              a.push('BUSY');
            return a.join('-');
          },
          $hasChanges: function() {
            if (Object.keys(this.changes).length !== 0)
              return true;
            var associations = this.constructor.associations();
            for (var name in associations) {
              var desc = associations[name];
              if (desc.owner) {
                var assoc = this[desc.name];
                if (desc.type === 'hasMany') {
                  for (var $__2 = assoc[$traceurRuntime.toProperty(Symbol.iterator)](),
                      $__3; !($__3 = $__2.next()).done; ) {
                    var o = $__3.value;
                    if (o.$hasChanges())
                      return true;
                  }
                } else if (assoc && assoc.$hasChanges())
                  return true;
              }
            }
            return false;
          },
          $undoChanges: function() {
            if (this.$isDeleted)
              throw (this.$className() + "#$undoChanges: attempted to undo changes on a DELETED model: " + this);
            for (var k in this.changes)
              this[k] = this.changes[k];
            var associations = this.constructor.associations();
            for (var name in associations) {
              var desc = associations[name];
              var association = this[desc.name];
              if (desc.owner) {
                if (desc.type === 'hasMany')
                  association.forEach((function(m) {
                    return m.$undoChanges();
                  }));
                else if (association)
                  association.$undoChanges();
              }
            }
            setPristine.call(this);
            return this;
          },
          $get: function() {
            for (var args = [],
                $__10 = 0; $__10 < arguments.length; $__10++)
              args[$__10] = arguments[$__10];
            if ((!this.$isLoaded && !this.$isEmpty) || this.$isBusy)
              throw (this.$className() + "#$get: cannot get a model in the " + this.$stateString() + " state: " + this);
            return mapperGet.apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
          },
          $save: function() {
            for (var args = [],
                $__11 = 0; $__11 < arguments.length; $__11++)
              args[$__11] = arguments[$__11];
            if ((!this.$isNew && !this.$isLoaded) || this.$isBusy)
              throw (this.$className() + "#$save: cannot save a model in the " + this.$stateString() + " state: " + this);
            (this.$isNew ? mapperCreate : mapperUpdate).apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
            return this;
          },
          $delete: function() {
            for (var args = [],
                $__12 = 0; $__12 < arguments.length; $__12++)
              args[$__12] = arguments[$__12];
            if (this.$isDeleted)
              return this;
            if (this.$isBusy)
              throw (this.$className() + "#$delete: cannot delete a model in the " + this.$stateString() + " state: " + this);
            if (this.$isNew)
              mapperDeleteSuccess(this);
            else
              mapperDelete.apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
            return this;
          },
          get id() {
            return this.__id__;
          },
          set id(v) {
            if (this.__id__)
              throw this.$className() + "#id (setter): overwriting a model's identity is not allowed: " + this;
            this.__id__ = v;
            IDMap.insert(this);
          },
          get $promise() {
            return this.__$promise__;
          },
          get $sourceState() {
            return this.__$sourceState__;
          },
          get $isNew() {
            return this.$sourceState === NEW;
          },
          get $isEmpty() {
            return this.$sourceState === EMPTY;
          },
          get $isLoaded() {
            return this.$sourceState === LOADED;
          },
          get $isDeleted() {
            return this.$sourceState === DELETED;
          },
          get $isNotfound() {
            return this.$sourceState === NOTFOUND;
          },
          get $isBusy() {
            return this.__$isBusy__;
          }
        }, {
          create: function(createFn) {
            if (allModels[this.className()]) {
              throw "Model.create: cannot to create the " + this.className() + " model more than once";
            } else {
              allModels[this.className()] = this;
              if (createFn)
                createFn.call(this, this);
            }
          },
          className: function() {
            return this.__className__ || (this.__className__ = Function.prototype.toString.call(this).match(/^\s*function\s+(\w+)/)[1]);
          },
          registerAttr: function(name, converter) {
            if (attrTypes[name]) {
              throw ("Model.registerAttr: an attribute type with the name '" + name + "' has already been defined");
            }
            attrTypes[name] = converter;
            return this;
          },
          attr: function(name, type) {
            var converter = attrTypes[type];
            var key = ("__" + name + "__");
            if (!converter)
              throw (this.className() + ".attr: unknown type: " + type);
            this[("__attr_" + name + "__")] = {
              type: type,
              converter: converter
            };
            Object.defineProperty(this.prototype, name, {
              get: function() {
                return this[key];
              },
              set: function(v) {
                var prev = this[key];
                this[key] = converter.coerce(v);
                if (this.$isLoaded)
                  return setChange.call(this, name, prev);
              },
              enumerable: true,
              configurable: false
            });
          },
          prop: function(name) {
            var opts = arguments[1] !== (void 0) ? arguments[1] : {};
            var DEFAULT_PROPERTY_OPTS = {
              enumerable: true,
              configurable: false
            };
            Object.defineProperty(this.prototype, name, extend(DEFAULT_PROPERTY_OPTS, typeof opts === 'function' ? {get: opts} : opts));
          },
          attrs: function() {
            var o = {};
            var name;
            for (var k in this) {
              name = k.match(attrRe);
              if (name && name[1])
                o[name[1]] = this[k];
            }
            return o;
          },
          hasAttr: function(name) {
            return ("__attr_" + name + "__") in this || name === 'id';
          },
          hasOne: function(name, klass) {
            var opts = arguments[2] !== (void 0) ? arguments[2] : {};
            var descriptor = this["__assoc_" + name + "__"] = extend(copy(opts), {
              type: 'hasOne',
              name: name,
              klass: klass
            });
            Object.defineProperty(this.prototype, name, {
              get: function() {
                return this[("__" + name + "__")] || null;
              },
              set: function(v) {
                return hasOneSet.call(this, descriptor, v, true);
              },
              enumerable: true,
              configurable: false
            });
          },
          hasMany: function(name, klass) {
            var opts = arguments[2] !== (void 0) ? arguments[2] : {};
            var cap = capitalize(name);
            var desc = this[("__assoc_" + name + "__")] = extend(copy(opts), {
              type: 'hasMany',
              name: name,
              klass: klass,
              singular: singularize(name)
            });
            Object.defineProperty(this.prototype, name, {
              get: function() {
                var _name = ("__" + name + "__");
                return this[_name] || (this[_name] = []);
              },
              set: function(v) {
                return hasManySet.call(this, desc, v);
              },
              enumerable: true,
              configurable: false
            });
            this.prototype[("add" + cap)] = function() {
              for (var args = [],
                  $__13 = 0; $__13 < arguments.length; $__13++)
                args[$__13] = arguments[$__13];
              hasManyAdd.call(this, desc, (1 <= args.length ? args : []), true);
            };
            this.prototype[("remove" + cap)] = function() {
              for (var args = [],
                  $__14 = 0; $__14 < arguments.length; $__14++)
                args[$__14] = arguments[$__14];
              hasManyRemove.call(this, desc, (1 <= args.length ? args : []), true);
            };
            this.prototype[("clear" + cap)] = function() {
              hasManySet.call(this, desc, []);
            };
          },
          associations: function() {
            var o = {};
            var name;
            for (var k in this) {
              name = k.match(assocRe);
              if (name && name[1])
                o[name[1]] = this[k];
            }
            return deepCopy(o);
          },
          hasAssociation: function(name) {
            return ("__assoc_" + name + "__") in this;
          },
          hasName: function(name) {
            return this.hasAttr(name) || this.hasAssociation(name);
          },
          empty: function(id) {
            var model = new this({id: id});
            model.__$sourceState__ = EMPTY;
            return model;
          },
          load: function(attrs) {
            var id = attrs.id || attrs.uuid;
            if (id == null) {
              throw (this.className() + ".load: an 'id' attribute is required");
            }
            attrs = copy(attrs);
            var model = IDMap.get(this, id) || new this();
            delete attrs.id;
            var associations = this.associations();
            var associated = {};
            for (var name in associations) {
              var desc = associations[name];
              if (name in attrs) {
                associated[name] = attrs[name];
                delete attrs[name];
              } else if (desc.type === 'hasOne' && (name + "Id") in attrs) {
                associated[name] = attrs[(name + "Id")];
                delete attrs[(name + "Id")];
              } else if (desc.type === 'hasOne' && (name + "_id") in attrs) {
                associated[name] = attrs["" + name + "_id"];
                delete attrs["" + name + "_id"];
              } else if (desc.type === 'hasMany' && (desc.singular + "Ids") in attrs) {
                associated[name] = attrs[(desc.singular + "Ids")];
                delete attrs[(desc.singular + "Ids")];
              } else if (desc.type === 'hasMany' && (desc.singular + "_ids") in attrs) {
                associated[name] = attrs[(desc.singular + "_ids")];
                delete attrs[(desc.singular + "_ids")];
              }
            }
            for (var k in attrs) {
              var v = attrs[k];
              if (model.constructor.hasName(k))
                model[k] = v;
            }
            if (model.id == null)
              model.id = id;
            for (name in associated) {
              var klass = resolve(associations[name].klass);
              var data = associated[name];
              var type = associations[name].type;
              if (data) {
                if (type === 'hasOne') {
                  var other = typeof data === 'object' ? klass.load(data) : IDMap.get(klass, data) || klass.empty(data);
                  model[name] = other;
                  setPristine.call(other);
                } else if (type === 'hasMany') {
                  var others = [],
                      o;
                  for (var $__2 = data[$traceurRuntime.toProperty(Symbol.iterator)](),
                      $__3; !($__3 = $__2.next()).done; ) {
                    o = $__3.value;
                    others.push(typeof o === 'object' ? klass.load(o) : IDMap.get(klass, o) || klass.empty(o));
                  }
                  model[name] = others;
                  for (var $__4 = others[$traceurRuntime.toProperty(Symbol.iterator)](),
                      $__5; !($__5 = $__4.next()).done; ) {
                    o = $__5.value;
                    setPristine.call(o);
                  }
                }
              }
            }
            model.__$sourceState__ = LOADED;
            setPristine.call(model);
            model.__$isBusy__ = false;
            return model;
          },
          loadAll: function(objects) {
            var $__0 = this;
            return objects.map((function(o) {
              return $__0.load(o);
            }));
          },
          query: function() {
            var $__16;
            for (var args = [],
                $__13 = 0; $__13 < arguments.length; $__13++)
              args[$__13] = arguments[$__13];
            return ($__16 = this.buildQuery()).$query.apply($__16, $traceurRuntime.spread(args));
          },
          buildQuery: function() {
            return buildQueryArray(this);
          },
          local: function(id) {
            return IDMap.get(this, id) || this.empty(id);
          },
          get: function(id) {
            var opts = arguments[1] !== (void 0) ? arguments[1] : {};
            var model = this.local(id);
            var params = copy(opts);
            delete params.refresh;
            if (model.$isEmpty || opts.refresh)
              mapperGet(model, params);
            return model;
          },
          reset: function() {
            allModels = {};
            IDMap.reset();
          },
          extend: function() {
            for (var args = [],
                $__14 = 0; $__14 < arguments.length; $__14++)
              args[$__14] = arguments[$__14];
            return extendMany(this, args);
          }
        });
      }());
      NEW = Model.NEW = 'new';
      EMPTY = Model.EMPTY = 'empty';
      LOADED = Model.LOADED = 'loaded';
      DELETED = Model.DELETED = 'deleted';
      NOTFOUND = Model.NOTFOUND = 'notfound';
      Model.toString = Model.className;
      Model.registerAttr('identity', IdentityAttr);
      Model.registerAttr('string', StringAttr);
      Model.registerAttr('number', NumberAttr);
      Model.registerAttr('boolean', BooleanAttr);
      Model.registerAttr('date', DateAttr);
      Model.registerAttr('datetime', DateTimeAttr);
      $__export('default', Model);
    }
  };
});
System.register("helpers/load", ["./is"], function($__export) {
  "use strict";
  var __moduleName = "helpers/load";
  function require(path) {
    return $traceurRuntime.require("helpers/load", path);
  }
  var is;
  function loadResource(type, url, accessToken) {
    return new Promise(function(fulfill, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader('Authorization', ("token " + accessToken));
      xhr.responseType = type;
      xhr.send();
      xhr.onload = (function() {
        return fulfill(xhr);
      });
      xhr.onerror = (function() {
        return reject(xhr);
      });
    });
  }
  $__export("loadResource", loadResource);
  return {
    setters: [function(m) {
      is = m.default;
    }],
    execute: function() {
      $__export('default', function loadJSON(url) {
        var response,
            $__1,
            $__2,
            $__3,
            $__4;
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $__1 = loadJSON.accessToken;
                $__2 = loadResource("json", url, $__1);
                $ctx.state = 5;
                break;
              case 5:
                Promise.resolve($__2).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                $__3 = $ctx.value;
                $ctx.state = 2;
                break;
              case 2:
                $__4 = $__3.response;
                response = $__4;
                $ctx.state = 7;
                break;
              case 7:
                if (!response)
                  throw new Error("Not found");
                $ctx.state = 12;
                break;
              case 12:
                $ctx.returnValue = is.aString(response) ? JSON.parse(response) : response;
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, this);
      });
    }
  };
});
System.register("models/github/GithubIssueMapper", ["helpers/load"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubIssueMapper";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubIssueMapper", path);
  }
  var loadJSON;
  return {
    setters: [function(m) {
      loadJSON = m.default;
    }],
    execute: function() {
      $__export('default', {get: (function(model, $__0) {
          var $__1 = $__0,
              repo = $__1.repo,
              issueNumber = $__1.issueNumber;
          return (loadJSON(("https://api.github.com/" + repo + "/issues/" + issueNumber))).then((function(data) {
            if (!data)
              throw "No Data";
            model.$load(data);
          }));
        })});
    }
  };
});
System.register("models/github/GithubIssue", ["../../helpers/model/Model", "./GithubIssueMapper"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubIssue";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubIssue", path);
  }
  var Model,
      GithubIssueMapper,
      GithubIssue;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubIssueMapper = m.default;
    }],
    execute: function() {
      GithubIssue = (function($__super) {
        var GithubIssue = function GithubIssue() {
          $traceurRuntime.superConstructor(GithubIssue).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GithubIssue, {}, {}, $__super);
      }(Model));
      GithubIssue.create((function($) {
        $.mapper = GithubIssueMapper;
        $.attr('fullName', 'string');
        $.attr('name', 'string');
        $.attr('url', 'string');
        $.attr('score', 'number');
      }));
      $__export('default', GithubIssue);
    }
  };
});
System.register("elements/cards/ticker-github-events-card", ["../../models/github/GithubIssue"], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-events-card";
  function require(path) {
    return $traceurRuntime.require("elements/cards/ticker-github-events-card", path);
  }
  var GithubIssue;
  return {
    setters: [function(m) {
      GithubIssue = m.default;
    }],
    execute: function() {
      Polymer('ticker-github-events-card', {onOpenIssueDetails: function(event) {
          var $__0 = this;
          var $__1 = event.target.templateInstance.model,
              payload = $__1.payload,
              repo = $__1.repo;
          GithubIssue.get(undefined, {
            issueNumber: payload.issue.number,
            repo: repo.name
          }).$promise.then((function(issue) {
            return $__0.issue = issue;
          }));
        }});
    }
  };
});
System.register("elements/cards/ticker-github-repo", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-repo";
  function require(path) {
    return $traceurRuntime.require("elements/cards/ticker-github-repo", path);
  }
  return {
    setters: [],
    execute: function() {
      Polymer('ticker-github-repo', {repoChanged: function(_, repo) {
          var $__0;
          if (repo)
            ($__0 = repo.split('/'), this.repoOwner = $__0[0], this.repoName = $__0[1], $__0);
        }});
    }
  };
});
System.register("filters/limitArray", [], function($__export) {
  "use strict";
  var __moduleName = "filters/limitArray";
  function require(path) {
    return $traceurRuntime.require("filters/limitArray", path);
  }
  function limitArray(array, size) {
    return array && array.slice(0, size);
  }
  $__export("default", limitArray);
  return {
    setters: [],
    execute: function() {
      PolymerExpressions.prototype.limitArray = limitArray;
    }
  };
});
System.register("helpers/svengali", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/svengali";
  function require(path) {
    return $traceurRuntime.require("helpers/svengali", path);
  }
  var EMPTY_OBJ,
      nextStateUID,
      StateChart,
      State;
  function Reenter(params) {
    this.params = params;
  }
  function reenter(params) {
    return new Reenter(params);
  }
  function Goto(path, params) {
    this.path = path;
    this.params = params;
  }
  function goto(path, params) {
    return new Goto(path, params);
  }
  function AttrValue(val) {
    this.val = val;
  }
  function attrValue(val) {
    return new AttrValue(val);
  }
  $__export("reenter", reenter);
  $__export("goto", goto);
  $__export("attrValue", attrValue);
  return {
    setters: [],
    execute: function() {
      EMPTY_OBJ = {};
      nextStateUID = 1;
      StateChart = $__export("StateChart", (function() {
        var StateChart = function StateChart(rootStateOptions) {
          this.attrs = {};
          this.rootState = new State(null, this, rootStateOptions);
        };
        return ($traceurRuntime.createClass)(StateChart, {
          goto: function() {
            var path = arguments[0] !== (void 0) ? arguments[0] : '.';
            var params = arguments[1] !== (void 0) ? arguments[1] : {};
            this.rootState.scState.goto(path, {context: params});
          },
          fire: function(eventName) {
            var $__6;
            for (var args = [],
                $__2 = 1; $__2 < arguments.length; $__2++)
              args[$__2 - 1] = arguments[$__2];
            ($__6 = this.rootState.scState).send.apply($__6, $traceurRuntime.spread([eventName], args));
          },
          _getStateEvents: function(scState) {
            var $__0 = this;
            return scState.substates.reduce((function(acc, s) {
              return acc.concat($__0._getStateEvents(s));
            }), Object.keys(scState.events));
          },
          get events() {
            return this._getStateEvents(this.rootState.scState);
          }
        }, {});
      }()));
      State = $__export("State", (function() {
        var State = function State(parent, stateChart, $__4) {
          var $__5 = $__4,
              attrs = $__5.attrs,
              enter = $__5.enter,
              exit = $__5.exit,
              events = $__5.events,
              history = $__5.history,
              parallelStates = $__5.parallelStates,
              params = $__5.params,
              states = $__5.states;
          var name = arguments[3] !== (void 0) ? arguments[3] : nextStateUID++;
          var $__0 = this;
          this._attrs = attrs || EMPTY_OBJ;
          this._attrKeys = Object.keys(this._attrs);
          this._resolvedAttrValues = {};
          this.attrs = Object.create((parent && parent.attrs || null), this._attrKeys.reduce((function(acc, attr) {
            acc[attr] = {get: (function() {
                return $__0._resolveAttrValue(attr);
              })};
            return acc;
          }), {}));
          this.enter = enter;
          this.exit = exit;
          this.params = params;
          this.stateChart = stateChart;
          var scState = this.scState = statechart.State(name, {
            name: name,
            concurrent: !!parallelStates,
            history: !!history
          });
          if (params)
            scState.canEnter = (function(states, params) {
              return $__0._doCanEnter(params);
            });
          scState.enter((function(params) {
            return $__0._doEnter(params);
          }));
          scState.exit((function() {
            return $__0._doExit();
          }));
          if (events)
            Object.keys(events).forEach((function(eventName) {
              eventName.split(',').forEach((function(ename) {
                $__0._registerEvent(ename.trim(), events[eventName]);
              }));
            }));
          states = parallelStates || states;
          if (states)
            Object.keys(states).forEach((function(stateName) {
              return scState.addSubstate(new State($__0, stateChart, states[stateName], stateName).scState);
            }));
        };
        return ($traceurRuntime.createClass)(State, {
          fire: function(eventName) {
            var $__6;
            for (var args = [],
                $__2 = 1; $__2 < arguments.length; $__2++)
              args[$__2 - 1] = arguments[$__2];
            ($__6 = this.stateChart).fire.apply($__6, $traceurRuntime.spread([eventName], args));
          },
          get isCurrent() {
            return this.scState.__isCurrent__;
          },
          _doCanEnter: function(params) {
            return !this.params || (params && this.params.every((function(p) {
              return p in params;
            })));
          },
          _doEnter: function() {
            var params = arguments[0] !== (void 0) ? arguments[0] : {};
            var $__0 = this;
            this._currentParams = params;
            this._resolvedAttrValues = {};
            this._attrKeys.forEach((function(a) {
              return $__0._resolveAttrValue(a);
            }));
            if (this.enter)
              this.enter(params);
          },
          _doExit: function() {
            var $__0 = this;
            if (this.exit)
              this.exit();
            this._attrKeys.forEach((function(a) {
              return delete $__0.stateChart.attrs[a];
            }));
          },
          _doReenter: function(reenterObj) {
            this._doExit();
            this._doEnter(reenterObj.params);
          },
          _transitionToSameState: function(reenterObj) {
            return this._doReenter.bind(this, reenterObj);
          },
          _transitionToState: function(gotoObj) {
            return this.scState.goto.bind(this.scState, gotoObj.path, {context: gotoObj.params});
          },
          _transitionToDynamicState: function(func) {
            var $__0 = this;
            return (function() {
              for (var args = [],
                  $__3 = 0; $__3 < arguments.length; $__3++)
                args[$__3] = arguments[$__3];
              var result = func.apply($__0, args);
              if (result instanceof Goto)
                $__0.scState.goto(result.path, {context: result.params || {}});
              else if (result instanceof Reenter)
                $__0._doReenter(result);
            });
          },
          _registerEvent: function(eventName, eventValue) {
            var type = typeof eventValue;
            var callback = eventValue instanceof Goto ? this._transitionToState(eventValue) : type === 'function' ? this._transitionToDynamicState(eventValue) : eventValue instanceof Reenter ? this._transitionToSameState(eventValue) : undefined;
            if (callback)
              this.scState.event(eventName, callback);
          },
          _resolveAttrValue: function(attrName) {
            var $__0 = this;
            var params = this._currentParams;
            var result;
            if (attrName in this._resolvedAttrValues) {
              result = this._resolvedAttrValues[attrName];
            } else {
              var val = this._attrs[attrName];
              val = typeof val === 'function' ? val.call(this, params) : val;
              if (!(val instanceof Promise))
                result = this.stateChart.attrs[attrName] = val instanceof AttrValue ? val.val : val;
              else
                result = val.then((function(value) {
                  if ($__0.isCurrent)
                    $__0.stateChart.attrs[attrName] = value;
                  return value;
                }));
            }
            return this._resolvedAttrValues[attrName] = result;
          }
        }, {});
      }()));
    }
  };
});
System.register("helpers/StatefulPolymer", ["helpers/svengali"], function($__export) {
  "use strict";
  var __moduleName = "helpers/StatefulPolymer";
  function require(path) {
    return $traceurRuntime.require("helpers/StatefulPolymer", path);
  }
  var StateChart;
  function stateFire(statechart, stateEvent, $__0) {
    var currentTarget = $__0.currentTarget;
    var fireArg = currentTarget.getAttribute('fire-arg');
    if (fireArg)
      statechart.fire(stateEvent, currentTarget.templateInstance.model[fireArg]);
    else
      statechart.fire(stateEvent);
  }
  function addFireFuncs(object, statechart) {
    var events = statechart.events;
    for (var i = 0; i < events.length; ++i)
      object[("stateFire." + events[i])] = stateFire.bind(null, statechart, events[i]);
  }
  function StatefulPolymer(name, options) {
    var stateConfig = options.state;
    var originalCreated = options.created;
    options.state = null;
    if (stateConfig instanceof StateChart)
      addFireFuncs(options, stateConfig);
    options.created = function() {
      this.bindInputToState = {
        toDOM: function(val, attr) {
          return this.state[attr];
        },
        toModel: function(val, attr) {
          this.stateEvent((attr + "Changed"), val);
          if (window.event.target.value !== this.state[attr])
            window.event.target.value = this.state[attr];
          return this.state[attr];
        }
      };
      this._statechart = (stateConfig instanceof StateChart) ? stateConfig : new StateChart(stateConfig);
      if (!(stateConfig instanceof StateChart))
        addFireFuncs(this, this._statechart);
      this.state = this._statechart.attrs;
      if (originalCreated)
        originalCreated.call(this);
    };
    options.stateEvent = function(eventName, params) {
      this._statechart.fire(eventName, params);
    };
    window.Polymer(name, options);
  }
  $__export("default", StatefulPolymer);
  return {
    setters: [function(m) {
      StateChart = m.StateChart;
    }],
    execute: function() {
    }
  };
});
System.register("models/sources/Source", [], function($__export) {
  "use strict";
  var __moduleName = "models/sources/Source";
  function require(path) {
    return $traceurRuntime.require("models/sources/Source", path);
  }
  var SOURCE_CLASSES;
  return {
    setters: [],
    execute: function() {
      SOURCE_CLASSES = {};
      $__export('default', (($traceurRuntime.createClass)(function() {}, {
        toSourceJSON: function() {
          return {
            type: this.constructor.name,
            config: this.toJSON()
          };
        },
        get name() {
          throw 'Subclasses should implement `get name()`';
        },
        toJSON: function() {
          throw 'Subclasses should implement `toJSON()`';
        }
      }, {
        load: function($__2) {
          var $__3 = $__2,
              type = $__3.type,
              config = $__3.config;
          return new SOURCE_CLASSES[type](config);
        },
        query: function($__2) {
          var term = $__2.term;
          return Promise.all(Object.keys(SOURCE_CLASSES).map((function(key) {
            return SOURCE_CLASSES[key].query({term: term});
          }))).then((function(allSources) {
            var $__4;
            return ($__4 = []).concat.apply($__4, $traceurRuntime.spread(allSources));
          }));
        },
        registerSource: function(SourceClass) {
          SOURCE_CLASSES[SourceClass.name] = SourceClass;
        }
      })));
    }
  };
});
System.register("helpers/MapperUtils", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/MapperUtils";
  function require(path) {
    return $traceurRuntime.require("helpers/MapperUtils", path);
  }
  function load(model, data) {
    return data && model.$load(data);
  }
  function loadAll(modelArray, data) {
    return data && modelArray.$replace(modelArray.$class.loadAll(data));
  }
  $__export("load", load);
  $__export("loadAll", loadAll);
  return {
    setters: [],
    execute: function() {
    }
  };
});
System.register("models/github/GithubEventMapper", ["helpers/load", "helpers/MapperUtils"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubEventMapper";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubEventMapper", path);
  }
  var loadJSON,
      load,
      loadAll;
  return {
    setters: [function(m) {
      loadJSON = m.default;
    }, function(m) {
      load = m.load;
      loadAll = m.loadAll;
    }],
    execute: function() {
      $__export('default', {query: (function(array, $__0) {
          var $__1,
              type,
              id,
              $__2,
              $__3,
              $__4;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__1 = $__0, type = $__1.type, id = $__1.id;
                  $ctx.state = 12;
                  break;
                case 12:
                  $__2 = loadJSON(("https://api.github.com/" + type + "/" + id + "/events"));
                  $ctx.state = 5;
                  break;
                case 5:
                  Promise.resolve($__2).then($ctx.createCallback(3), $ctx.errback);
                  return;
                case 3:
                  $__3 = $ctx.value;
                  $ctx.state = 2;
                  break;
                case 2:
                  $__4 = loadAll(array, $__3);
                  $ctx.state = 7;
                  break;
                case 7:
                  $ctx.returnValue = $__4;
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, this);
        })});
    }
  };
});
System.register("models/github/GithubRepoMapper", ["helpers/load", "helpers/MapperUtils"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubRepoMapper";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubRepoMapper", path);
  }
  var loadJSON,
      load,
      loadAll;
  return {
    setters: [function(m) {
      loadJSON = m.default;
    }, function(m) {
      load = m.load;
      loadAll = m.loadAll;
    }],
    execute: function() {
      $__export('default', {
        get: (function(model) {
          var response;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  Promise.resolve(loadJSON(("https://api.github.com/repos/" + model.id))).then($ctx.createCallback(3), $ctx.errback);
                  return;
                case 3:
                  response = $ctx.value;
                  $ctx.state = 2;
                  break;
                case 2:
                  response.id = model.id;
                  $ctx.state = 8;
                  break;
                case 8:
                  $ctx.returnValue = load(model, response);
                  $ctx.state = 5;
                  break;
                case 5:
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, this);
        }),
        query: (function(array, $__0) {
          var term,
              $__2,
              $__3,
              $__4,
              $__5;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  term = $__0.term;
                  $ctx.state = 12;
                  break;
                case 12:
                  $__2 = loadJSON(("https://api.github.com/search/repositories?q=" + term));
                  $ctx.state = 5;
                  break;
                case 5:
                  Promise.resolve($__2).then($ctx.createCallback(3), $ctx.errback);
                  return;
                case 3:
                  $__3 = $ctx.value;
                  $ctx.state = 2;
                  break;
                case 2:
                  $__4 = $__3.items;
                  $__5 = loadAll(array, $__4);
                  $ctx.state = 7;
                  break;
                case 7:
                  $ctx.returnValue = $__5;
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, this);
        })
      });
    }
  };
});
System.register("models/github/GithubRepo", ["../../helpers/model/Model", "./GithubRepoMapper"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubRepo";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubRepo", path);
  }
  var Model,
      GithubRepoMapper,
      GithubRepo;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubRepoMapper = m.default;
    }],
    execute: function() {
      GithubRepo = (function($__super) {
        var GithubRepo = function GithubRepo() {
          $traceurRuntime.superConstructor(GithubRepo).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GithubRepo, {}, {}, $__super);
      }(Model));
      GithubRepo.create((function($) {
        $.mapper = GithubRepoMapper;
        $.attr('full_name', 'string');
        $.attr('name', 'string');
        $.attr('url', 'string');
        $.attr('score', 'number');
      }));
      $__export('default', GithubRepo);
    }
  };
});
System.register("models/github/GithubUser", ["../../helpers/load", "../../helpers/MapperUtils", "../../helpers/model/Model"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubUser";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubUser", path);
  }
  var loadJSON,
      load,
      loadAll,
      Model,
      GithubUser;
  return {
    setters: [function(m) {
      loadJSON = m.default;
    }, function(m) {
      load = m.load;
      loadAll = m.loadAll;
    }, function(m) {
      Model = m.default;
    }],
    execute: function() {
      GithubUser = (function($__super) {
        var GithubUser = function GithubUser() {
          $traceurRuntime.superConstructor(GithubUser).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GithubUser, {}, {}, $__super);
      }(Model));
      GithubUser.create((function($) {
        $.attr('avatar_url', 'string');
        $.attr('login', 'string');
        $.attr('url', 'string');
        $.attr('score', 'number');
        $.mapper = {
          get: (function(model) {
            var response;
            return $traceurRuntime.asyncWrap(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    Promise.resolve(loadJSON(("https://api.github.com/users/" + model.id))).then($ctx.createCallback(3), $ctx.errback);
                    return;
                  case 3:
                    response = $ctx.value;
                    $ctx.state = 2;
                    break;
                  case 2:
                    response.id = model.id;
                    $ctx.state = 8;
                    break;
                  case 8:
                    $ctx.returnValue = load(model, response);
                    $ctx.state = 5;
                    break;
                  case 5:
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, this);
          }),
          query: (function(array, $__0) {
            var term = $__0.term;
            return (loadJSON(("https://api.github.com/search/users?q=" + term))).then((function($__2) {
              var items = $__2.items;
              return loadAll(array, items);
            }));
          })
        };
      }));
      $__export('default', GithubUser);
    }
  };
});
System.register("models/github/GithubEvent", ["../../helpers/model/Model", "./GithubEventMapper", "./GithubUser", "./GithubRepo", "./GithubIssue"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubEvent";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubEvent", path);
  }
  var Model,
      GithubEventMapper,
      GithubUser,
      GithubRepo,
      GithubIssue,
      GithubEvent;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubEventMapper = m.default;
    }, function(m) {
      GithubUser = m.default;
    }, function(m) {
      GithubRepo = m.default;
    }, function(m) {
      GithubIssue = m.default;
    }],
    execute: function() {
      GithubEvent = (function($__super) {
        var GithubEvent = function GithubEvent() {
          $traceurRuntime.superConstructor(GithubEvent).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GithubEvent, {fetchDetails: function() {
            GithubIssue.get();
          }}, {}, $__super);
      }(Model));
      GithubEvent.create((function($) {
        $.mapper = GithubEventMapper;
        $.attr('type', 'string');
        $.attr('payload', 'identity');
        $.attr('created_at', 'datetime');
        $.hasOne('actor', 'GithubUser');
        $.hasOne('repo', 'GithubRepo');
      }));
      $__export('default', GithubEvent);
    }
  };
});
System.register("models/sources/GithubRepoSource", ["models/github/GithubRepo", "models/github/GithubEvent", "./Source"], function($__export) {
  "use strict";
  var __moduleName = "models/sources/GithubRepoSource";
  function require(path) {
    return $traceurRuntime.require("models/sources/GithubRepoSource", path);
  }
  var GithubRepo,
      GithubEvent,
      Source,
      GithubRepoSource;
  return {
    setters: [function(m) {
      GithubRepo = m.default;
    }, function(m) {
      GithubEvent = m.default;
    }, function(m) {
      Source = m.default;
    }],
    execute: function() {
      GithubRepoSource = (function($__super) {
        var GithubRepoSource = function GithubRepoSource($__2) {
          var $__3 = $__2,
              full_name = $__3.full_name,
              details = $__3.details;
          this.full_name = full_name;
          this._details = details;
        };
        return ($traceurRuntime.createClass)(GithubRepoSource, {
          get name() {
            return this.full_name;
          },
          get details() {
            return this._details || (this._details = GithubRepo.get(this.full_name));
          },
          get events() {
            return this._events || (this._events = GithubEvent.query({
              type: 'repos',
              id: this.full_name
            }));
          },
          toJSON: function() {
            return {full_name: this.full_name};
          }
        }, {query: function($__2) {
            var term = $__2.term;
            var $__0 = this;
            return GithubRepo.query({term: term}).$promise.then((function(repos) {
              return repos.map((function(repo) {
                return new $__0({
                  full_name: repo.full_name,
                  details: repo
                });
              }));
            }));
          }}, $__super);
      }(Source));
      Source.registerSource(GithubRepoSource);
      $__export('default', GithubRepoSource);
    }
  };
});
System.register("states/searchState", ["../helpers/svengali", "../models/sources/Source", "../models/sources/GithubRepoSource"], function($__export) {
  "use strict";
  var __moduleName = "states/searchState";
  function require(path) {
    return $traceurRuntime.require("states/searchState", path);
  }
  var reenter,
      Source,
      GithubRepoSource,
      currentQuery;
  function delayedSourceQuery(term) {
    if (currentQuery)
      currentQuery.term = term;
    else
      currentQuery = {
        term: term,
        promise: new Promise(function(resolve) {
          setTimeout((function() {
            resolve(Source.query({term: currentQuery.term}).then(function(results) {
              currentQuery = null;
              return results;
            }));
          }), 300);
        })
      };
    return currentQuery.promise;
  }
  return {
    setters: [function(m) {
      reenter = m.reenter;
    }, function(m) {
      Source = m.default;
    }, function(m) {
      GithubRepoSource = m.default;
    }],
    execute: function() {
      currentQuery = null;
      $__export('default', {
        attrs: {
          'appView': 'search',
          'searchText': (function($__0) {
            var searchText = $__0.searchText;
            return searchText || '';
          }),
          'searchResults': function() {
            return this.attrs.searchText ? delayedSourceQuery(this.attrs.searchText) : [];
          }
        },
        events: {
          'clearSearchText': reenter({searchText: ''}),
          'searchTextChanged': (function(searchText) {
            return reenter({searchText: searchText});
          })
        }
      });
    }
  };
});
System.register("states/sourceState", ["../helpers/svengali"], function($__export) {
  "use strict";
  var __moduleName = "states/sourceState";
  function require(path) {
    return $traceurRuntime.require("states/sourceState", path);
  }
  var reenter;
  return {
    setters: [function(m) {
      reenter = m.reenter;
    }],
    execute: function() {
      $__export('default', {
        attrs: {
          'appView': function() {
            return ("source-" + this.attrs.source.constructor.name);
          },
          'isSourceFavorited': function() {
            return this.attrs.user.sources.indexOf(this.attrs.source) !== -1;
          },
          'source': function($__0) {
            var s = $__0.source;
            return s || this.attrs.user.sources[0];
          }
        },
        events: {
          'selectSource': (function(source) {
            return reenter({source: source});
          }),
          'toggleFavoriteSource': function() {
            var $__0 = this.attrs,
                user = $__0.user,
                source = $__0.source;
            if (!this.attrs.isSourceFavorited) {
              if (user.sources.indexOf(source) === -1)
                user.sources.push(source);
            } else {
              var index = user.sources.indexOf(source);
              if (index !== -1)
                user.sources.splice(index, 1);
            }
            user.$save();
            return reenter({source: source});
          }
        },
        states: {'tab': {
            attrs: {'tab': (function($__0) {
                var tab = $__0.tab;
                return tab || 'info';
              })},
            events: {'selectTab': (function(tab) {
                return reenter({tab: tab});
              })}
          }}
      });
    }
  };
});
System.register("states/loggedInState", ["../helpers/svengali", "../helpers/load", "./sourceState", "./searchState"], function($__export) {
  "use strict";
  var __moduleName = "states/loggedInState";
  function require(path) {
    return $traceurRuntime.require("states/loggedInState", path);
  }
  var goto,
      reenter,
      load,
      sourceState,
      searchState;
  return {
    setters: [function(m) {
      goto = m.goto;
      reenter = m.reenter;
    }, function(m) {
      load = m.default;
    }, function(m) {
      sourceState = m.default;
    }, function(m) {
      searchState = m.default;
    }],
    execute: function() {
      $__export('default', {
        params: ['user', 'accessTokens'],
        attrs: {
          'user': (function($__0) {
            var user = $__0.user;
            return user;
          }),
          'accessTokens': (function($__0) {
            var accessTokens = $__0.accessTokens;
            load.accessToken = accessTokens.github;
            return accessTokens;
          })
        },
        parallelStates: {
          'appDrawer': {
            attrs: {'appDrawerOpened': (function($__0) {
                var appDrawerOpened = $__0.appDrawerOpened;
                return !!appDrawerOpened;
              })},
            events: {
              'selectSearch, selectSource': reenter({appDrawerOpened: false}),
              'toggleAppDrawer': function() {
                return reenter({appDrawerOpened: !this.attrs.appDrawerOpened});
              }
            }
          },
          'appView': {
            events: {
              'selectSource': (function(source) {
                return goto('./source', {source: source});
              }),
              'selectSearch': goto('./search')
            },
            states: {
              'source': sourceState,
              'search': searchState
            }
          }
        }
      });
    }
  };
});
System.register("models/User", ["helpers/model/Model", "models/sources/Source"], function($__export) {
  "use strict";
  var __moduleName = "models/User";
  function require(path) {
    return $traceurRuntime.require("models/User", path);
  }
  var Model,
      Source,
      User;
  function updateCreate(user) {
    return new Promise((function(resolve, reject) {
      return new Firebase((CONFIG.firebaseUrl + "/users/" + user.id)).set({
        id: user.id,
        githubUsername: user.githubUsername,
        sources: user.sources.map((function(s) {
          return s.toSourceJSON();
        }))
      }, (function(error) {
        return error ? reject(error) : resolve(user);
      }));
    }));
  }
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      Source = m.default;
    }],
    execute: function() {
      User = (function($__super) {
        var User = function User(attrs) {
          this._sources = attrs.sources;
          $traceurRuntime.superConstructor(User).call(this, attrs);
        };
        return ($traceurRuntime.createClass)(User, {get sources() {
            return this._sources;
          }}, {}, $__super);
      }(Model));
      User.create((function($) {
        $.attr('githubUsername', 'string');
        $.mapper = {
          create: updateCreate,
          update: updateCreate,
          get: (function(user) {
            return new Promise((function(resolve, reject) {
              return new Firebase((CONFIG.firebaseUrl + "/users/" + user.id)).once('value', (function(data) {
                var val = data.val();
                if (val) {
                  user.$load(val);
                  user._sources = val.sources.map((function(s) {
                    return Source.load(s);
                  }));
                  resolve(user);
                } else {
                  reject("Couldn't find User");
                }
              }));
            }));
          })
        };
      }));
      $__export('default', User);
    }
  };
});
System.register("models/sources/GithubUserSource", ["models/github/GithubUser", "models/github/GithubEvent", "./Source"], function($__export) {
  "use strict";
  var __moduleName = "models/sources/GithubUserSource";
  function require(path) {
    return $traceurRuntime.require("models/sources/GithubUserSource", path);
  }
  var GithubUser,
      GithubEvent,
      Source,
      GithubUserSource;
  return {
    setters: [function(m) {
      GithubUser = m.default;
    }, function(m) {
      GithubEvent = m.default;
    }, function(m) {
      Source = m.default;
    }],
    execute: function() {
      GithubUserSource = (function($__super) {
        var GithubUserSource = function GithubUserSource($__2) {
          var $__3 = $__2,
              login = $__3.login,
              details = $__3.details;
          this.login = login;
          this._details = details;
        };
        return ($traceurRuntime.createClass)(GithubUserSource, {
          get name() {
            return this.login;
          },
          get details() {
            return this._details || (this._details = GithubUser.get(this.login));
          },
          get events() {
            return this._events || (this._events = GithubEvent.query({
              type: 'users',
              id: this.login
            }));
          },
          toJSON: function() {
            return {login: this.login};
          }
        }, {query: function($__2) {
            var term = $__2.term;
            var $__0 = this;
            return GithubUser.query({term: term}).$promise.then((function(users) {
              return users.map((function(user) {
                return new $__0({
                  login: user.login,
                  details: user
                });
              }));
            }));
          }}, $__super);
      }(Source));
      Source.registerSource(GithubUserSource);
      $__export('default', GithubUserSource);
    }
  };
});
System.register("states/loggedOutState", ["../helpers/svengali", "../models/User", "../models/sources/Source", "../models/sources/GithubUserSource"], function($__export) {
  "use strict";
  var __moduleName = "states/loggedOutState";
  function require(path) {
    return $traceurRuntime.require("states/loggedOutState", path);
  }
  var goto,
      User,
      Source,
      GithubUserSource;
  function createUserWithDefaults($__0) {
    var $__1 = $__0,
        id = $__1.id,
        githubUsername = $__1.githubUsername;
    return new User({
      githubUsername: githubUsername,
      id: id,
      sources: [new GithubUserSource({login: "Polymer"}), new GithubUserSource({login: "web-animations"})]
    }).$save().$promise;
  }
  return {
    setters: [function(m) {
      goto = m.goto;
    }, function(m) {
      User = m.default;
    }, function(m) {
      Source = m.default;
    }, function(m) {
      GithubUserSource = m.default;
    }],
    execute: function() {
      $__export('default', {states: {
          'determineAuth': {events: {
              'authFailed': goto('../auth'),
              'authSuccessful': (function(authId, githubUsername, accessTokens) {
                return goto('../retrieveUser', {
                  authId: authId,
                  githubUsername: githubUsername,
                  accessTokens: accessTokens
                });
              })
            }},
          'auth': {events: {
              'authWithGithub': function() {
                this.attrs.firebaseRef.authWithOAuthPopup("github", (function(_) {
                  return _;
                }));
              },
              'authSuccessful': (function(authId, githubUsername, accessTokens) {
                return goto('../retrieveUser', {
                  authId: authId,
                  githubUsername: githubUsername,
                  accessTokens: accessTokens
                });
              })
            }},
          'retrieveUser': {enter: function($__0) {
              var $__1,
                  authId,
                  githubUsername,
                  accessTokens,
                  user,
                  e;
              return $traceurRuntime.asyncWrap(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      $__1 = $__0, authId = $__1.authId, githubUsername = $__1.githubUsername, accessTokens = $__1.accessTokens;
                      user = User.get(authId);
                      $ctx.state = 14;
                      break;
                    case 14:
                      $ctx.pushTry(6, null);
                      $ctx.state = 9;
                      break;
                    case 9:
                      Promise.resolve(user.$promise).then($ctx.createCallback(2), $ctx.errback);
                      return;
                    case 2:
                      $ctx.popTry();
                      $ctx.state = 11;
                      break;
                    case 6:
                      $ctx.popTry();
                      e = $ctx.storedException;
                      $ctx.state = 3;
                      break;
                    case 3:
                      Promise.resolve(createUserWithDefaults({
                        id: authId,
                        githubUsername: githubUsername
                      })).then($ctx.createCallback(5), $ctx.errback);
                      return;
                    case 5:
                      user = $ctx.value;
                      $ctx.state = 11;
                      break;
                    case 11:
                      this.fire('userLoggedIn', user, accessTokens);
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, this);
            }}
        }});
    }
  };
});
System.register("states/appState", ["../helpers/svengali", "./loggedInState", "./loggedOutState"], function($__export) {
  "use strict";
  var __moduleName = "states/appState";
  function require(path) {
    return $traceurRuntime.require("states/appState", path);
  }
  var StateChart,
      goto,
      loggedInState,
      loggedOutState,
      appState;
  return {
    setters: [function(m) {
      StateChart = m.StateChart;
      goto = m.goto;
    }, function(m) {
      loggedInState = m.default;
    }, function(m) {
      loggedOutState = m.default;
    }],
    execute: function() {
      appState = new StateChart({
        attrs: {'firebaseRef': (function() {
            return new window.Firebase(CONFIG.firebaseUrl);
          })},
        enter: function() {
          var $__0 = this;
          setTimeout((function() {
            $__0.attrs.firebaseRef.onAuth((function(authData) {
              var github = authData && authData.github;
              if (github)
                $__0.fire('authSuccessful', github.id, github.username, {github: github.accessToken});
              else
                $__0.fire('authFailed');
            }));
          }));
        },
        events: {'userLoggedIn': (function(user, accessTokens) {
            return goto('loggedIn', {
              user: user,
              accessTokens: accessTokens
            });
          })},
        states: {
          'loggedOut': loggedOutState,
          'loggedIn': loggedInState
        }
      });
      if (!('__karma__' in window))
        appState.goto();
      if (window.CONFIG.statechartTrace) {
        appState.rootState.scState.trace = true;
        window.appState = appState;
      }
      $__export('default', appState);
    }
  };
});
System.register("elements/ticker-app", ["../helpers/StatefulPolymer", "../states/appState", "../filters/limitArray"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-app";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-app", path);
  }
  var StatefulPolymer,
      appState,
      limitArray;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }, function(m) {
      limitArray = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-app', {
        state: appState,
        DRAWER_SWIPE_DISABLED: !/Chrome/.test(window.navigator.userAgent) && /AppleWebKit.*Mobile.*Safari/.test(window.navigator.userAgent),
        openedToSelected: {
          toDOM: (function(drawerOpened) {
            return drawerOpened ? 'drawer' : 'main';
          }),
          toModel: function(selected) {
            if (this.state.appDrawerOpened != (selected === 'drawer'))
              this.stateEvent('toggleAppDrawer');
            return this.state.appDrawerOpened;
          }
        }
      });
    }
  };
});
System.register("elements/ticker-drawer", ["../helpers/StatefulPolymer", "../states/appState"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-drawer";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-drawer", path);
  }
  var StatefulPolymer,
      appState;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-drawer', {state: appState});
    }
  };
});
System.register("elements/ticker-login", ["../helpers/StatefulPolymer", "../states/appState"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-login";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-login", path);
  }
  var StatefulPolymer,
      appState;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-login', {state: appState});
    }
  };
});
System.register("elements/ticker-search", ["../helpers/StatefulPolymer", "../states/appState"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-search";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-search", path);
  }
  var StatefulPolymer,
      appState;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-search', {state: appState});
    }
  };
});
System.register("elements/ticker-source-github-repo", ["../helpers/StatefulPolymer", "../states/appState"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-source-github-repo";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-source-github-repo", path);
  }
  var StatefulPolymer,
      appState;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-source-github-repo', {state: appState});
    }
  };
});
System.register("elements/ticker-source-github-user", ["../helpers/StatefulPolymer", "../states/appState"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-source-github-user";
  function require(path) {
    return $traceurRuntime.require("elements/ticker-source-github-user", path);
  }
  var StatefulPolymer,
      appState;
  return {
    setters: [function(m) {
      StatefulPolymer = m.default;
    }, function(m) {
      appState = m.default;
    }],
    execute: function() {
      StatefulPolymer('ticker-source-github-user', {state: appState});
    }
  };
});
System.register("helpers/AttrMunger", ["./is"], function($__export) {
  "use strict";
  var __moduleName = "helpers/AttrMunger";
  function require(path) {
    return $traceurRuntime.require("helpers/AttrMunger", path);
  }
  var is;
  function copy(obj) {
    return is.aArray(obj) ? obj.map(copy) : is.aObject(obj) ? copyObj(obj) : obj;
  }
  function copyObj(obj) {
    var result = {};
    for (var key in obj)
      result[key] = copy(obj[key]);
    return result;
  }
  function upcase(str) {
    var self;
    self = str.replace(/_([a-z])/g, (function($) {
      return "_" + $[1].toUpperCase();
    }));
    self = self.replace(/\/([a-z])/g, (function($) {
      return "/" + $[1].toUpperCase();
    }));
    return self[0].toUpperCase() + self.substr(1);
  }
  function downcase(str) {
    var self;
    self = str.replace(/_([A-Z])/g, (function($) {
      return "_" + $[1].toLowerCase();
    }));
    self = self.replace(/\/([A-Z])/g, (function($) {
      return "/" + $[1].toLowerCase();
    }));
    return self[0].toLowerCase() + self.substr(1);
  }
  function camelize(words) {
    return downcase(words.replace(/\/(.?)/g, (function($) {
      return "." + upcase($[1]);
    })).replace(/(?:_)(.)/g, (function($) {
      return upcase($[1]);
    })));
  }
  function underscore(word) {
    return word.replace(/\./g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, '_').toLowerCase();
  }
  function munge(isCamelize, attrs) {
    if (is.aArray(attrs)) {
      attrs.map((function(o) {
        return munge(isCamelize, o);
      }));
    } else if (is.aObject(attrs)) {
      for (var k in attrs) {
        var v = attrs[k];
        if (is.aObject(v))
          munge(isCamelize, v);
        var transformed = isCamelize ? camelize(k, false) : underscore(k);
        if (k !== transformed) {
          attrs[transformed] = v;
          delete attrs[k];
        }
      }
    }
    return attrs;
  }
  return {
    setters: [function(m) {
      is = m.default;
    }],
    execute: function() {
      $__export('default', {
        camelize: (function(attrs) {
          return munge(true, copy(attrs));
        }),
        underscore: (function(attrs) {
          return munge(false, copy(attrs));
        })
      });
    }
  };
});
System.register("helpers/KEYCODES", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/KEYCODES";
  function require(path) {
    return $traceurRuntime.require("helpers/KEYCODES", path);
  }
  return {
    setters: [],
    execute: function() {
      $__export('default', {
        SHIFT: 16,
        BACKSPACE: 8,
        ENTER: 13,
        ESC: 27,
        TAB: 9,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
      });
    }
  };
});
System.register("helpers/model/Mapper", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/model/Mapper";
  function require(path) {
    return $traceurRuntime.require("helpers/model/Mapper", path);
  }
  return {
    setters: [],
    execute: function() {
      $__export('default', {
        query: function(array) {
          for (var args = [],
              $__0 = 1; $__0 < arguments.length; $__0++)
            args[$__0 - 1] = arguments[$__0];
        },
        get: function(model) {
          for (var args = [],
              $__1 = 1; $__1 < arguments.length; $__1++)
            args[$__1 - 1] = arguments[$__1];
        },
        create: function(model) {
          for (var args = [],
              $__2 = 1; $__2 < arguments.length; $__2++)
            args[$__2 - 1] = arguments[$__2];
        },
        update: function(model) {
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
        },
        delete: function(model) {
          for (var args = [],
              $__4 = 1; $__4 < arguments.length; $__4++)
            args[$__4 - 1] = arguments[$__4];
        }
      });
    }
  };
});
System.register("models/github/GithubComment", ["../../helpers/model/Model", "./GithubUser"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubComment";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubComment", path);
  }
  var Model,
      GithubUser,
      GithubComment;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubUser = m.default;
    }],
    execute: function() {
      GithubComment = (function($__super) {
        var GithubComment = function GithubComment() {
          $traceurRuntime.superConstructor(GithubComment).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(GithubComment, {}, {}, $__super);
      }(Model));
      Github.create((function($) {
        $.attr('body', 'datetime');
        $.attr('commitId', 'string');
        $.attr('createdAt', 'datetime');
        $.attr('html_url', 'string');
        $.attr('line', 'number');
        $.attr('path', 'string');
        $.attr('position', 'number');
        $.attr('updatedAt', 'datetime');
        $.attr('url', 'string');
        $.hasOne('user', 'GithubUser');
      }));
      $__export('default', GithubComment);
    }
  };
});
System.register("models/github/GithubEventPayloads", ["../../helpers/model/Model", "./GithubComment", "./GithubRepo", "./GithubUser"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubEventPayloads";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubEventPayloads", path);
  }
  var Model,
      GithubComment,
      GithubRepo,
      GithubUser,
      CommitCommentEvent,
      CreateEvent,
      DeleteEvent;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubComment = m.default;
    }, function(m) {
      GithubRepo = m.default;
    }, function(m) {
      GithubUser = m.default;
    }],
    execute: function() {
      CommitCommentEvent = $__export("CommitCommentEvent", (function($__super) {
        var CommitCommentEvent = function CommitCommentEvent() {
          $traceurRuntime.superConstructor(CommitCommentEvent).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(CommitCommentEvent, {}, {}, $__super);
      }(Model)));
      CommitCommentEvent.create((function($) {
        $.hasOne('comment', 'GithubComment');
        $.hasOne('repository', 'GithubRepo');
        $.hasOne('sender', 'GithubUser');
      }));
      CreateEvent = $__export("CreateEvent", (function($__super) {
        var CreateEvent = function CreateEvent() {
          $traceurRuntime.superConstructor(CreateEvent).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(CreateEvent, {}, {}, $__super);
      }(Model)));
      CreateEvent.create((function($) {
        $.attr('description', 'string');
        $.attr('masterBranch', 'string');
        $.attr('pusherType', 'string');
        $.attr('ref', 'string');
        $.attr('refType', 'string');
        $.hasOne('repository', 'GithubRepo');
        $.hasOne('sender', 'GithubUser');
      }));
      DeleteEvent = $__export("DeleteEvent", (function($__super) {
        var DeleteEvent = function DeleteEvent() {
          $traceurRuntime.superConstructor(DeleteEvent).apply(this, arguments);
        };
        return ($traceurRuntime.createClass)(DeleteEvent, {}, {}, $__super);
      }(Model)));
      DeleteEvent.create((function($) {
        $.attr('description', 'string');
        $.attr('masterBranch', 'string');
        $.attr('pusherType', 'string');
        $.attr('ref', 'string');
        $.attr('refType', 'string');
        $.hasOne('repository', 'GithubRepo');
        $.hasOne('sender', 'GithubUser');
      }));
    }
  };
});
System.register("models/github/GithubUserMapper", ["helpers/load", "helpers/MapperUtils"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubUserMapper";
  function require(path) {
    return $traceurRuntime.require("models/github/GithubUserMapper", path);
  }
  var loadJSON,
      load,
      loadAll;
  return {
    setters: [function(m) {
      loadJSON = m.default;
    }, function(m) {
      load = m.load;
      loadAll = m.loadAll;
    }],
    execute: function() {
      $__export('default', {
        get: (function(model) {
          var response;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  Promise.resolve(loadJSON(("https://api.github.com/users/" + model.id))).then($ctx.createCallback(3), $ctx.errback);
                  return;
                case 3:
                  response = $ctx.value;
                  $ctx.state = 2;
                  break;
                case 2:
                  response.id = model.id;
                  $ctx.state = 8;
                  break;
                case 8:
                  $ctx.returnValue = load(model, response);
                  $ctx.state = 5;
                  break;
                case 5:
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, this);
        }),
        query: (function(array, $__0) {
          var term,
              $__2,
              $__3,
              $__4,
              $__5;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  term = $__0.term;
                  $ctx.state = 12;
                  break;
                case 12:
                  $__2 = loadJSON(("https://api.github.com/search/users?q=" + term));
                  $ctx.state = 5;
                  break;
                case 5:
                  Promise.resolve($__2).then($ctx.createCallback(3), $ctx.errback);
                  return;
                case 3:
                  $__3 = $ctx.value;
                  $ctx.state = 2;
                  break;
                case 2:
                  $__4 = $__3.items;
                  $__5 = loadAll(array, $__4);
                  $ctx.state = 7;
                  break;
                case 7:
                  $ctx.returnValue = $__5;
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, this);
        })
      });
    }
  };
});
System.register("patchTraceurForIE", [], function($__export) {
  "use strict";
  var __moduleName = "patchTraceurForIE";
  function require(path) {
    return $traceurRuntime.require("patchTraceurForIE", path);
  }
  return {
    setters: [],
    execute: function() {
      (function() {
        var test = {};
        if (!('__proto__' in test)) {
          var orig = $traceurRuntime.createClass;
          $traceurRuntime.createClass = function() {
            var result = orig.apply(null, [].slice.call(arguments));
            if (arguments.length > 3) {
              var superClass = arguments[3];
              Object.keys(superClass).map(function(key) {
                result[key] = superClass[key];
              });
            }
            return result;
          };
        }
      })();
    }
  };
});
