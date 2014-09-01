System.register("elements/cards/ticker-github-avatar", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-avatar";
  return {
    setters: [],
    execute: function() {
      Polymer('ticker-github-avatar', {size: 24});
    }
  };
});
System.register("elements/cards/ticker-github-branch", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-branch";
  return {
    setters: [],
    execute: function() {
      Polymer('ticker-github-branch', {branchChanged: function(_, branch) {
          this.branchName = branch && branch.split('/').slice(-1);
        }});
    }
  };
});
System.register("elements/cards/ticker-github-events-card", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-events-card";
  return {
    setters: [],
    execute: function() {
      PolymerExpressions.prototype.limitArray = function(array, size) {
        return array && array.slice(0, size);
      };
      Polymer('ticker-github-events-card', {});
    }
  };
});
System.register("elements/cards/ticker-github-repo", [], function($__export) {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-repo";
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
System.register("helpers/is", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/is";
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
  $__export("isEqual", isEqual);
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
  function singularize(word) {
    return word.replace(/s$/, '');
  }
  $__export("singularize", singularize);
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
          var id = $__export("id", model.id);
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
    var $__16 = desc,
        name = $__16.name,
        inverse = $__16.inverse;
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
    var $__1 = this;
    var name = desc.name;
    var prev = this[name];
    a.forEach(checkAssociatedType.bind(this, desc));
    if (desc.inverse) {
      prev.forEach((function(x) {
        return inverseRemoved.call(x, desc.inverse, $__1);
      }));
      a.forEach((function(x) {
        return inverseAdded.call(x, desc.inverse, $__1);
      }));
    }
    this[("__" + desc.name + "__")] = a;
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyAdd(desc, models, sync) {
    var $__1 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      checkAssociatedType.call($__1, desc, m);
      if (sync && desc.inverse)
        inverseAdded.call(m, desc.inverse, $__1);
      $__1[name].push(m);
    }));
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyRemove(desc, models, sync) {
    var $__1 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      var i = $__1[name].indexOf(m);
      if (i >= 0) {
        if (sync && desc.inverse)
          inverseRemoved.call(m, desc.inverse, $__1);
        $__1[name].splice(i, 1);
        if (desc.owner && $__1.$isLoaded)
          setChange.call($__1, name, prev);
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
          for (var args = [],
              $__7 = 0; $__7 < arguments.length; $__7++)
            args[$__7] = arguments[$__7];
          var $__1 = this;
          if (isBusy) {
            queued = args;
          } else {
            isBusy = true;
            promise = ensurePromise(klass.mapper.query.apply(this, $traceurRuntime.spread([this], args)), '$query').then((function() {
              return $__1;
            }), (function() {})).then((function(result) {
              var $__17;
              isBusy = false;
              if (queued)
                ($__17 = $__1).$query.apply($__17, $traceurRuntime.spread(queued));
              return result;
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
          var $__17;
          ($__17 = this).splice.apply($__17, $traceurRuntime.spread($traceurRuntime.spread([0, this.length], a)));
          return this;
        },
        enumerable: false,
        configurable: false,
        writable: false
      }
    });
  }
  function mapperGet(model) {
    var $__17;
    for (var args = [],
        $__7 = 1; $__7 < arguments.length; $__7++)
      args[$__7 - 1] = arguments[$__7];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__17 = model.constructor.mapper).get.apply($__17, $traceurRuntime.spread([model], args)), 'mapperGet').then((function() {
      model.__$sourceState__ = LOADED;
    }), (function() {
      if (model.__$sourceState__ === EMPTY)
        model.__$sourceState__ = NOTFOUND;
    })).then((function() {
      model.__$isBusy__ = false;
    }));
    return model;
  }
  function mapperCreate(model) {
    var $__17;
    for (var args = [],
        $__8 = 1; $__8 < arguments.length; $__8++)
      args[$__8 - 1] = arguments[$__8];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__17 = model.constructor.mapper).create.apply($__17, $traceurRuntime.spread([model], args)), 'mapperCreate').then((function() {
      model.__$sourceState__ = LOADED;
      return model;
    }), (function() {})).then((function() {
      model.__$isBusy__ = false;
      return model;
    }));
    return model;
  }
  function mapperUpdate(model) {
    var $__17;
    for (var args = [],
        $__9 = 1; $__9 < arguments.length; $__9++)
      args[$__9 - 1] = arguments[$__9];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__17 = model.constructor.mapper).update.apply($__17, $traceurRuntime.spread([model], args)), 'mapperUpdate').then((function() {
      return model;
    }), (function() {})).then((function() {
      return model.__$isBusy__ = false;
    }));
    return model;
  }
  function mapperDeleteSuccess(model) {
    IDMap.delete(model);
    model.__$sourceState__ = DELETED;
    model.__$isBusy__ = false;
    setPristine.call(model);
    var associations = model.constructor.associations();
    for (var $__3 = Object.keys(associations)[Symbol.iterator](),
        $__4; !($__4 = $__3.next()).done; ) {
      var name = $__4.value;
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
    var $__17;
    for (var args = [],
        $__10 = 1; $__10 < arguments.length; $__10++)
      args[$__10 - 1] = arguments[$__10];
    model.__$isBusy__ = true;
    model.__$promise__ = ($__17 = model.constructor.mapper).delete.apply($__17, $traceurRuntime.spread([model], args));
    ensurePromise(model.__$promise__, 'mapperDelete');
    model.__$promise__.then((function() {
      return mapperDeleteSuccess(model);
    }), (function() {
      return undefined;
    })).then((function() {
      return model.__$isBusy__ = false;
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
              return ("#<" + klass + " (" + state + ") " + JSON.stringify({id: this.id}) + ">");
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
                  for (var $__3 = assoc[Symbol.iterator](),
                      $__4; !($__4 = $__3.next()).done; ) {
                    var o = $__4.value;
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
                $__11 = 0; $__11 < arguments.length; $__11++)
              args[$__11] = arguments[$__11];
            if ((!this.$isLoaded && !this.$isEmpty) || this.$isBusy)
              throw (this.$className() + "#$get: cannot get a model in the " + this.$stateString() + " state: " + this);
            return mapperGet.apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
          },
          $save: function() {
            for (var args = [],
                $__12 = 0; $__12 < arguments.length; $__12++)
              args[$__12] = arguments[$__12];
            if ((!this.$isNew && !this.$isLoaded) || this.$isBusy)
              throw (this.$className() + "#$save: cannot save a model in the " + this.$stateString() + " state: " + this);
            (this.$isNew ? mapperCreate : mapperUpdate).apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
            return this;
          },
          $delete: function() {
            for (var args = [],
                $__13 = 0; $__13 < arguments.length; $__13++)
              args[$__13] = arguments[$__13];
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
                  $__14 = 0; $__14 < arguments.length; $__14++)
                args[$__14] = arguments[$__14];
              hasManyAdd.call(this, desc, (1 <= args.length ? args : []), true);
            };
            this.prototype[("remove" + cap)] = function() {
              for (var args = [],
                  $__15 = 0; $__15 < arguments.length; $__15++)
                args[$__15] = arguments[$__15];
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
                  for (var $__3 = data[Symbol.iterator](),
                      $__4; !($__4 = $__3.next()).done; ) {
                    o = $__4.value;
                    others.push(typeof o === 'object' ? klass.load(o) : IDMap.get(klass, o) || klass.empty(o));
                  }
                  model[name] = others;
                  for (var $__5 = others[Symbol.iterator](),
                      $__6; !($__6 = $__5.next()).done; ) {
                    o = $__6.value;
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
            var $__1 = this;
            return objects.map((function(o) {
              return $__1.load(o);
            }));
          },
          query: function() {
            var $__17;
            for (var args = [],
                $__14 = 0; $__14 < arguments.length; $__14++)
              args[$__14] = arguments[$__14];
            return ($__17 = this.buildQuery()).$query.apply($__17, $traceurRuntime.spread(args));
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
                $__15 = 0; $__15 < arguments.length; $__15++)
              args[$__15] = arguments[$__15];
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
System.register("helpers/AttrMunger", ["./is"], function($__export) {
  "use strict";
  var __moduleName = "helpers/AttrMunger";
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
System.register("helpers/load", ["./is"], function($__export) {
  "use strict";
  var __moduleName = "helpers/load";
  var is;
  function loadResource(type, url, headers) {
    headers = headers == null ? {} : headers;
    return new Promise(function(fulfill, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader('Authorization', 'token cd3cc5d471d59d6dce0095cf33e7c7f1ddaf23e6');
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
  function loadJSON(url) {
    return loadResource("json", url).then(function($__18) {
      var response = $__18.response;
      if (!response)
        throw new Error("Not found");
      return is.aString(response) ? JSON.parse(response) : response;
    });
  }
  $__export("loadResource", loadResource);
  $__export("loadJSON", loadJSON);
  return {
    setters: [function(m) {
      is = m.default;
    }],
    execute: function() {
    }
  };
});
System.register("models/github/EventMapper", ["helpers/AttrMunger", "helpers/load"], function($__export) {
  "use strict";
  var $__20;
  var __moduleName = "models/github/EventMapper";
  var AttrMunger,
      loadJSON;
  return ($__20 = {}, Object.defineProperty($__20, "setters", {
    value: [function(m) {
      AttrMunger = m.default;
    }, function(m) {
      loadJSON = m.loadJSON;
    }],
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__20, "execute", {
    value: function() {
      var $__20;
      $__export('default', ($__20 = {}, Object.defineProperty($__20, "query", {
        value: (function(array, $__21) {
          var $__22 = $__21,
              type = $__22.type,
              typeRef = $__22[type];
          return (loadJSON(("https://api.github.com/" + type + "/" + typeRef + "/events"))).then((function(data) {
            return array.$replace(array.$class.loadAll(AttrMunger.camelize(data)));
          }));
        }),
        configurable: true,
        enumerable: true,
        writable: true
      }), $__20));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__20);
});
System.register("models/github/Repo", ["../../helpers/model/Model"], function($__export) {
  "use strict";
  var __moduleName = "models/github/Repo";
  var Model,
      Repo;
  return {
    setters: [function(m) {
      Model = m.default;
    }],
    execute: function() {
      Repo = (function($__super) {
        var Repo = function Repo() {
          $traceurRuntime.defaultSuperCall(this, Repo.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(Repo, {}, {}, $__super);
      }(Model));
      Repo.create((function($) {
        $.attr('name', 'string');
        $.attr('url', 'string');
      }));
      $__export('default', Repo);
    }
  };
});
System.register("models/github/User", ["../../helpers/model/Model"], function($__export) {
  "use strict";
  var __moduleName = "models/github/User";
  var Model,
      User;
  return {
    setters: [function(m) {
      Model = m.default;
    }],
    execute: function() {
      User = (function($__super) {
        var User = function User() {
          $traceurRuntime.defaultSuperCall(this, User.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(User, {}, {}, $__super);
      }(Model));
      User.create((function($) {
        $.attr('avatarUrl', 'string');
        $.attr('gravatarId', 'string');
        $.attr('login', 'string');
        $.attr('url', 'string');
      }));
      $__export('default', User);
    }
  };
});
System.register("models/github/Event", ["../../helpers/model/Model", "./EventMapper", "./User", "./Repo"], function($__export) {
  "use strict";
  var __moduleName = "models/github/Event";
  var Model,
      EventMapper,
      User,
      Repo,
      Event;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      EventMapper = m.default;
    }, function(m) {
      User = m.default;
    }, function(m) {
      Repo = m.default;
    }],
    execute: function() {
      Event = (function($__super) {
        var Event = function Event() {
          $traceurRuntime.defaultSuperCall(this, Event.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(Event, {}, {}, $__super);
      }(Model));
      Event.create((function($) {
        $.mapper = EventMapper;
        $.attr('type', 'string');
        $.attr('payload', 'identity');
        $.attr('createdAt', 'datetime');
        $.hasOne('actor', 'User');
        $.hasOne('repo', 'Repo');
      }));
      $__export('default', Event);
    }
  };
});
System.register("elements/ticker-app", ["../models/github/Event"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-app";
  var Event;
  return {
    setters: [function(m) {
      Event = m.default;
    }],
    execute: function() {
      Polymer('ticker-app', {
        query: {
          type: 'users',
          users: 'polymer'
        },
        isSearching: false,
        searchText: '',
        ready: function() {
          this.githubEvents = Event.query(this.query);
        },
        focusSearchInput: function() {
          var $__23 = this;
          this.job('focusSearchInput', (function(_) {
            var searchInput = $__23.shadowRoot.querySelector('#searchInput');
            if (searchInput)
              searchInput.focus();
          }), 150);
        },
        onRefresh: function() {
          this.githubEvents.$query(this.query);
        },
        onShowSearch: function() {
          this.isSearching = true;
          this.focusSearchInput();
        },
        onHideSearch: function() {
          this.isSearching = false;
        },
        onClearSearch: function() {
          this.searchText = '';
          this.focusSearchInput();
        }
      });
    }
  };
});
System.register("elements/ticker-search", ["../models/github/Repo", "../models/github/User"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-search";
  var Repo,
      User;
  return {
    setters: [function(m) {
      Repo = m.default;
    }, function(m) {
      User = m.default;
    }],
    execute: function() {
      Polymer('ticker-search', {
        searchText: '',
        userResults: [],
        repoResults: [],
        search: function() {
          var $__24 = this;
          this.job('search', (function() {
            var term = $__24.searchText;
            $__24.repoResults = Repo.query({term: term});
            $__24.userResults = User.query({term: term});
          }));
        },
        searchTextChanged: function(_, searchText) {
          if (searchText) {
            this.onSearch();
          }
        },
        onSearch: function() {
          var $__24 = this;
          this.job('search', (function() {
            $__24.query = {
              type: 'users',
              users: $__24.searchText
            };
            $__24.onSearch();
          }), 100);
        }
      });
    }
  };
});
System.register("helpers/KEYCODES", [], function($__export) {
  "use strict";
  var __moduleName = "helpers/KEYCODES";
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
  return {
    setters: [],
    execute: function() {
      $__export('default', {
        query: function(array) {
          for (var args = [],
              $__25 = 1; $__25 < arguments.length; $__25++)
            args[$__25 - 1] = arguments[$__25];
        },
        get: function(model) {
          for (var args = [],
              $__26 = 1; $__26 < arguments.length; $__26++)
            args[$__26 - 1] = arguments[$__26];
        },
        create: function(model) {
          for (var args = [],
              $__27 = 1; $__27 < arguments.length; $__27++)
            args[$__27 - 1] = arguments[$__27];
        },
        update: function(model) {
          for (var args = [],
              $__28 = 1; $__28 < arguments.length; $__28++)
            args[$__28 - 1] = arguments[$__28];
        },
        delete: function(model) {
          for (var args = [],
              $__29 = 1; $__29 < arguments.length; $__29++)
            args[$__29 - 1] = arguments[$__29];
        }
      });
    }
  };
});
System.register("models/github/Comment", ["../../helpers/model/Model", "./User"], function($__export) {
  "use strict";
  var __moduleName = "models/github/Comment";
  var Model,
      User,
      Comment;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      User = m.default;
    }],
    execute: function() {
      Comment = (function($__super) {
        var Comment = function Comment() {
          $traceurRuntime.defaultSuperCall(this, Comment.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(Comment, {}, {}, $__super);
      }(Model));
      Comment.create((function($) {
        $.attr('body', 'datetime');
        $.attr('commitId', 'string');
        $.attr('createdAt', 'datetime');
        $.attr('html_url', 'string');
        $.attr('line', 'number');
        $.attr('path', 'string');
        $.attr('position', 'number');
        $.attr('updatedAt', 'datetime');
        $.attr('url', 'string');
        $.hasOne('user', 'User');
      }));
      $__export('default', Comment);
    }
  };
});
System.register("models/github/EventMapperMOCKDATA-allEvents", [], function($__export) {
  "use strict";
  var __moduleName = "models/github/EventMapperMOCKDATA-allEvents";
  return {
    setters: [],
    execute: function() {
      $__export('default', [{
        "id": "2214373807",
        "type": "IssuesEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {
          "action": "opened",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20",
            "labels_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/comments",
            "events_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/events",
            "html_url": "https://github.com/Polymer/polymer-tutorial/issues/20",
            "id": 39278152,
            "number": 20,
            "title": "UTF-8 BOM in various files",
            "user": {
              "login": "marcoms",
              "id": 4211302,
              "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
              "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
              "url": "https://api.github.com/users/marcoms",
              "html_url": "https://github.com/marcoms",
              "followers_url": "https://api.github.com/users/marcoms/followers",
              "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
              "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
              "organizations_url": "https://api.github.com/users/marcoms/orgs",
              "repos_url": "https://api.github.com/users/marcoms/repos",
              "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
              "received_events_url": "https://api.github.com/users/marcoms/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": null,
            "milestone": null,
            "comments": 0,
            "created_at": "2014-08-01T10:24:32Z",
            "updated_at": "2014-08-01T10:24:32Z",
            "closed_at": null,
            "body": "Having cloned the tutorial, `less finished/index.html` gives:\r\n\r\n    <U+FEFF><!doctype html>\r\n    <html>\r\n \r\n    ...\r\n\r\nFrom what I've seen, the starter `index.html` has this too, but I haven't investigated further."
          }
        },
        "public": true,
        "created_at": "2014-08-01T10:24:32Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2249436185",
        "type": "CreateEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "fix-ie-tc-file-error",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T16:44:47Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249773972",
        "type": "DeleteEvent",
        "actor": {
          "id": 569564,
          "login": "cstump",
          "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
          "url": "https://api.github.com/users/cstump",
          "avatar_url": "https://avatars.githubusercontent.com/u/569564?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "trunk",
          "ref_type": "branch",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T19:50:53Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2214234995",
        "type": "ForkEvent",
        "actor": {
          "id": 3986510,
          "login": "ankoh",
          "gravatar_id": "825ecd8cfde1e3e241921f02fc87f275",
          "url": "https://api.github.com/users/ankoh",
          "avatar_url": "https://avatars.githubusercontent.com/u/3986510?"
        },
        "repo": {
          "id": 18537928,
          "name": "Polymer/core-drawer-panel",
          "url": "https://api.github.com/repos/Polymer/core-drawer-panel"
        },
        "payload": {"forkee": {
            "id": 22501871,
            "name": "core-drawer-panel",
            "full_name": "ankoh/core-drawer-panel",
            "owner": {
              "login": "ankoh",
              "id": 3986510,
              "avatar_url": "https://avatars.githubusercontent.com/u/3986510?v=1",
              "gravatar_id": "825ecd8cfde1e3e241921f02fc87f275",
              "url": "https://api.github.com/users/ankoh",
              "html_url": "https://github.com/ankoh",
              "followers_url": "https://api.github.com/users/ankoh/followers",
              "following_url": "https://api.github.com/users/ankoh/following{/other_user}",
              "gists_url": "https://api.github.com/users/ankoh/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/ankoh/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/ankoh/subscriptions",
              "organizations_url": "https://api.github.com/users/ankoh/orgs",
              "repos_url": "https://api.github.com/users/ankoh/repos",
              "events_url": "https://api.github.com/users/ankoh/events{/privacy}",
              "received_events_url": "https://api.github.com/users/ankoh/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/ankoh/core-drawer-panel",
            "description": "Simple two-section responsive panel",
            "fork": true,
            "url": "https://api.github.com/repos/ankoh/core-drawer-panel",
            "forks_url": "https://api.github.com/repos/ankoh/core-drawer-panel/forks",
            "keys_url": "https://api.github.com/repos/ankoh/core-drawer-panel/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/ankoh/core-drawer-panel/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/ankoh/core-drawer-panel/teams",
            "hooks_url": "https://api.github.com/repos/ankoh/core-drawer-panel/hooks",
            "issue_events_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues/events{/number}",
            "events_url": "https://api.github.com/repos/ankoh/core-drawer-panel/events",
            "assignees_url": "https://api.github.com/repos/ankoh/core-drawer-panel/assignees{/user}",
            "branches_url": "https://api.github.com/repos/ankoh/core-drawer-panel/branches{/branch}",
            "tags_url": "https://api.github.com/repos/ankoh/core-drawer-panel/tags",
            "blobs_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/ankoh/core-drawer-panel/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/ankoh/core-drawer-panel/languages",
            "stargazers_url": "https://api.github.com/repos/ankoh/core-drawer-panel/stargazers",
            "contributors_url": "https://api.github.com/repos/ankoh/core-drawer-panel/contributors",
            "subscribers_url": "https://api.github.com/repos/ankoh/core-drawer-panel/subscribers",
            "subscription_url": "https://api.github.com/repos/ankoh/core-drawer-panel/subscription",
            "commits_url": "https://api.github.com/repos/ankoh/core-drawer-panel/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/ankoh/core-drawer-panel/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/ankoh/core-drawer-panel/contents/{+path}",
            "compare_url": "https://api.github.com/repos/ankoh/core-drawer-panel/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/ankoh/core-drawer-panel/merges",
            "archive_url": "https://api.github.com/repos/ankoh/core-drawer-panel/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/ankoh/core-drawer-panel/downloads",
            "issues_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues{/number}",
            "pulls_url": "https://api.github.com/repos/ankoh/core-drawer-panel/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/ankoh/core-drawer-panel/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/ankoh/core-drawer-panel/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/ankoh/core-drawer-panel/labels{/name}",
            "releases_url": "https://api.github.com/repos/ankoh/core-drawer-panel/releases{/id}",
            "created_at": "2014-08-01T08:42:54Z",
            "updated_at": "2014-07-21T09:34:18Z",
            "pushed_at": "2014-07-29T17:00:20Z",
            "git_url": "git://github.com/ankoh/core-drawer-panel.git",
            "ssh_url": "git@github.com:ankoh/core-drawer-panel.git",
            "clone_url": "https://github.com/ankoh/core-drawer-panel.git",
            "svn_url": "https://github.com/ankoh/core-drawer-panel",
            "homepage": null,
            "size": 1803,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T08:42:54Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2249472340",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128",
            "id": 40852167,
            "number": 128,
            "title": "Sizmek advertisers 139",
            "user": {
              "login": "mswieboda",
              "id": 2223822,
              "avatar_url": "https://avatars.githubusercontent.com/u/2223822?v=2",
              "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
              "url": "https://api.github.com/users/mswieboda",
              "html_url": "https://github.com/mswieboda",
              "followers_url": "https://api.github.com/users/mswieboda/followers",
              "following_url": "https://api.github.com/users/mswieboda/following{/other_user}",
              "gists_url": "https://api.github.com/users/mswieboda/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mswieboda/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mswieboda/subscriptions",
              "organizations_url": "https://api.github.com/users/mswieboda/orgs",
              "repos_url": "https://api.github.com/users/mswieboda/repos",
              "events_url": "https://api.github.com/users/mswieboda/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mswieboda/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 3,
            "created_at": "2014-08-21T21:27:22Z",
            "updated_at": "2014-08-22T17:05:16Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128",
              "html_url": "https://github.com/centro/centro-media-manager/pull/128",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/128.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/128.patch"
            },
            "body": "[Create and Manage Advertisers in Sizmek](https://centro.mingle.thoughtworks.com/projects/cmp___integration_efforts/cards/139)\r\nSizmek Create/Delete/Update/Get Advertisers\r\n\r\nNote: also renamed a few classes match Sizmek API better\r\n`FindCampaign` => `GetCampaigns` and `CampaignFilter => CampaignsFilter`"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53090095",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128#issuecomment-53090095",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "id": 53090095,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T17:05:16Z",
            "updated_at": "2014-08-22T17:05:16Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/152/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T17:05:16Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249313151",
        "type": "PullRequestEvent",
        "actor": {
          "id": 2243386,
          "login": "tmertens",
          "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
          "url": "https://api.github.com/users/tmertens",
          "avatar_url": "https://avatars.githubusercontent.com/u/2243386?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 131,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131",
            "id": 20179425,
            "html_url": "https://github.com/centro/centro-media-manager/pull/131",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/131.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/131.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131",
            "number": 131,
            "state": "open",
            "locked": false,
            "title": "Add spec:integration task for VCR-disabled testing to other gems",
            "user": {
              "login": "tmertens",
              "id": 2243386,
              "avatar_url": "https://avatars.githubusercontent.com/u/2243386?v=2",
              "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
              "url": "https://api.github.com/users/tmertens",
              "html_url": "https://github.com/tmertens",
              "followers_url": "https://api.github.com/users/tmertens/followers",
              "following_url": "https://api.github.com/users/tmertens/following{/other_user}",
              "gists_url": "https://api.github.com/users/tmertens/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/tmertens/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/tmertens/subscriptions",
              "organizations_url": "https://api.github.com/users/tmertens/orgs",
              "repos_url": "https://api.github.com/users/tmertens/repos",
              "events_url": "https://api.github.com/users/tmertens/events{/privacy}",
              "received_events_url": "https://api.github.com/users/tmertens/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "@cwitthaus @brownierin This one is for you.  It adds a spec:integration task to the integration gems which disables VCR and executes the specs against the real server(s).  Previously it was only added to the adwords_integration gem, this adds it to the rest.",
            "created_at": "2014-08-22T15:42:18Z",
            "updated_at": "2014-08-22T15:42:18Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/68e2e6dd0c2534f9841719a4d5836aa20587386a",
            "head": {
              "label": "centro:gem-vcr-tasks",
              "ref": "gem-vcr-tasks",
              "sha": "68e2e6dd0c2534f9841719a4d5836aa20587386a",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:41:00Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:41:00Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/131"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/131"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/131/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/68e2e6dd0c2534f9841719a4d5836aa20587386a"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 88,
            "deletions": 24,
            "changed_files": 10
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:42:18Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249428233",
        "type": "PushEvent",
        "actor": {
          "id": 271342,
          "login": "mikenichols",
          "gravatar_id": "9a8e6e470fcf3e3112e1fac53737e421",
          "url": "https://api.github.com/users/mikenichols",
          "avatar_url": "https://avatars.githubusercontent.com/u/271342?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 435026494,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/master",
          "head": "f72f149f6401e7a65b6ffc763ecf6405f0e77246",
          "before": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
          "commits": [{
            "sha": "f72f149f6401e7a65b6ffc763ecf6405f0e77246",
            "author": {
              "email": "mike.nichols@cento.net",
              "name": "Mike Nichols"
            },
            "message": "Making repo_manager setup tasks idempotent.",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/f72f149f6401e7a65b6ffc763ecf6405f0e77246"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T16:40:24Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2214359972",
        "type": "WatchEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T10:13:59Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }]);
    }
  };
});
System.register("models/github/EventMapperMOCKDATA", [], function($__export) {
  "use strict";
  var __moduleName = "models/github/EventMapperMOCKDATA";
  return {
    setters: [],
    execute: function() {
      $__export('default', [{
        "id": "2214563715",
        "type": "PullRequestEvent",
        "actor": {
          "id": 110953,
          "login": "addyosmani",
          "gravatar_id": "96270e4c3e5e9806cf7245475c00b275",
          "url": "https://api.github.com/users/addyosmani",
          "avatar_url": "https://avatars.githubusercontent.com/u/110953?"
        },
        "repo": {
          "id": 7804910,
          "name": "Polymer/docs",
          "url": "https://api.github.com/repos/Polymer/docs"
        },
        "payload": {
          "action": "opened",
          "number": 573,
          "pull_request": {
            "url": "https://api.github.com/repos/Polymer/docs/pulls/573",
            "id": 19208601,
            "html_url": "https://github.com/Polymer/docs/pull/573",
            "diff_url": "https://github.com/Polymer/docs/pull/573.diff",
            "patch_url": "https://github.com/Polymer/docs/pull/573.patch",
            "issue_url": "https://api.github.com/repos/Polymer/docs/issues/573",
            "number": 573,
            "state": "open",
            "title": "Adds global filters docs for #571",
            "user": {
              "login": "addyosmani",
              "id": 110953,
              "avatar_url": "https://avatars.githubusercontent.com/u/110953?v=1",
              "gravatar_id": "96270e4c3e5e9806cf7245475c00b275",
              "url": "https://api.github.com/users/addyosmani",
              "html_url": "https://github.com/addyosmani",
              "followers_url": "https://api.github.com/users/addyosmani/followers",
              "following_url": "https://api.github.com/users/addyosmani/following{/other_user}",
              "gists_url": "https://api.github.com/users/addyosmani/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/addyosmani/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/addyosmani/subscriptions",
              "organizations_url": "https://api.github.com/users/addyosmani/orgs",
              "repos_url": "https://api.github.com/users/addyosmani/repos",
              "events_url": "https://api.github.com/users/addyosmani/events{/privacy}",
              "received_events_url": "https://api.github.com/users/addyosmani/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "reviewer: @ebidel ",
            "created_at": "2014-08-01T13:00:02Z",
            "updated_at": "2014-08-01T13:00:02Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/Polymer/docs/pulls/573/commits",
            "review_comments_url": "https://api.github.com/repos/Polymer/docs/pulls/573/comments",
            "review_comment_url": "https://api.github.com/repos/Polymer/docs/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/Polymer/docs/issues/573/comments",
            "statuses_url": "https://api.github.com/repos/Polymer/docs/statuses/d02f2631ac5336db0a5c6622f06beb654e7904bf",
            "head": {
              "label": "Polymer:globalfilters",
              "ref": "globalfilters",
              "sha": "d02f2631ac5336db0a5c6622f06beb654e7904bf",
              "user": {
                "login": "Polymer",
                "id": 2159051,
                "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                "url": "https://api.github.com/users/Polymer",
                "html_url": "https://github.com/Polymer",
                "followers_url": "https://api.github.com/users/Polymer/followers",
                "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                "organizations_url": "https://api.github.com/users/Polymer/orgs",
                "repos_url": "https://api.github.com/users/Polymer/repos",
                "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                "received_events_url": "https://api.github.com/users/Polymer/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 7804910,
                "name": "docs",
                "full_name": "Polymer/docs",
                "owner": {
                  "login": "Polymer",
                  "id": 2159051,
                  "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                  "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                  "url": "https://api.github.com/users/Polymer",
                  "html_url": "https://github.com/Polymer",
                  "followers_url": "https://api.github.com/users/Polymer/followers",
                  "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                  "organizations_url": "https://api.github.com/users/Polymer/orgs",
                  "repos_url": "https://api.github.com/users/Polymer/repos",
                  "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Polymer/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/Polymer/docs",
                "description": "Documentation for Polymer",
                "fork": false,
                "url": "https://api.github.com/repos/Polymer/docs",
                "forks_url": "https://api.github.com/repos/Polymer/docs/forks",
                "keys_url": "https://api.github.com/repos/Polymer/docs/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/Polymer/docs/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/Polymer/docs/teams",
                "hooks_url": "https://api.github.com/repos/Polymer/docs/hooks",
                "issue_events_url": "https://api.github.com/repos/Polymer/docs/issues/events{/number}",
                "events_url": "https://api.github.com/repos/Polymer/docs/events",
                "assignees_url": "https://api.github.com/repos/Polymer/docs/assignees{/user}",
                "branches_url": "https://api.github.com/repos/Polymer/docs/branches{/branch}",
                "tags_url": "https://api.github.com/repos/Polymer/docs/tags",
                "blobs_url": "https://api.github.com/repos/Polymer/docs/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/Polymer/docs/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/Polymer/docs/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/Polymer/docs/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/Polymer/docs/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/Polymer/docs/languages",
                "stargazers_url": "https://api.github.com/repos/Polymer/docs/stargazers",
                "contributors_url": "https://api.github.com/repos/Polymer/docs/contributors",
                "subscribers_url": "https://api.github.com/repos/Polymer/docs/subscribers",
                "subscription_url": "https://api.github.com/repos/Polymer/docs/subscription",
                "commits_url": "https://api.github.com/repos/Polymer/docs/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/Polymer/docs/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/Polymer/docs/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/Polymer/docs/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/Polymer/docs/contents/{+path}",
                "compare_url": "https://api.github.com/repos/Polymer/docs/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/Polymer/docs/merges",
                "archive_url": "https://api.github.com/repos/Polymer/docs/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/Polymer/docs/downloads",
                "issues_url": "https://api.github.com/repos/Polymer/docs/issues{/number}",
                "pulls_url": "https://api.github.com/repos/Polymer/docs/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/Polymer/docs/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/Polymer/docs/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/Polymer/docs/labels{/name}",
                "releases_url": "https://api.github.com/repos/Polymer/docs/releases{/id}",
                "created_at": "2013-01-24T19:11:00Z",
                "updated_at": "2014-08-01T01:48:12Z",
                "pushed_at": "2014-08-01T12:57:40Z",
                "git_url": "git://github.com/Polymer/docs.git",
                "ssh_url": "git@github.com:Polymer/docs.git",
                "clone_url": "https://github.com/Polymer/docs.git",
                "svn_url": "https://github.com/Polymer/docs",
                "homepage": "www.polymer-project.org",
                "size": 23274,
                "stargazers_count": 368,
                "watchers_count": 368,
                "language": "CSS",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 573,
                "mirror_url": null,
                "open_issues_count": 85,
                "forks": 573,
                "open_issues": 85,
                "watchers": 368,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "Polymer:master",
              "ref": "master",
              "sha": "6de6398a31afd411cd36b96117db920905f691ea",
              "user": {
                "login": "Polymer",
                "id": 2159051,
                "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                "url": "https://api.github.com/users/Polymer",
                "html_url": "https://github.com/Polymer",
                "followers_url": "https://api.github.com/users/Polymer/followers",
                "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                "organizations_url": "https://api.github.com/users/Polymer/orgs",
                "repos_url": "https://api.github.com/users/Polymer/repos",
                "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                "received_events_url": "https://api.github.com/users/Polymer/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 7804910,
                "name": "docs",
                "full_name": "Polymer/docs",
                "owner": {
                  "login": "Polymer",
                  "id": 2159051,
                  "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                  "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                  "url": "https://api.github.com/users/Polymer",
                  "html_url": "https://github.com/Polymer",
                  "followers_url": "https://api.github.com/users/Polymer/followers",
                  "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                  "organizations_url": "https://api.github.com/users/Polymer/orgs",
                  "repos_url": "https://api.github.com/users/Polymer/repos",
                  "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Polymer/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/Polymer/docs",
                "description": "Documentation for Polymer",
                "fork": false,
                "url": "https://api.github.com/repos/Polymer/docs",
                "forks_url": "https://api.github.com/repos/Polymer/docs/forks",
                "keys_url": "https://api.github.com/repos/Polymer/docs/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/Polymer/docs/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/Polymer/docs/teams",
                "hooks_url": "https://api.github.com/repos/Polymer/docs/hooks",
                "issue_events_url": "https://api.github.com/repos/Polymer/docs/issues/events{/number}",
                "events_url": "https://api.github.com/repos/Polymer/docs/events",
                "assignees_url": "https://api.github.com/repos/Polymer/docs/assignees{/user}",
                "branches_url": "https://api.github.com/repos/Polymer/docs/branches{/branch}",
                "tags_url": "https://api.github.com/repos/Polymer/docs/tags",
                "blobs_url": "https://api.github.com/repos/Polymer/docs/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/Polymer/docs/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/Polymer/docs/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/Polymer/docs/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/Polymer/docs/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/Polymer/docs/languages",
                "stargazers_url": "https://api.github.com/repos/Polymer/docs/stargazers",
                "contributors_url": "https://api.github.com/repos/Polymer/docs/contributors",
                "subscribers_url": "https://api.github.com/repos/Polymer/docs/subscribers",
                "subscription_url": "https://api.github.com/repos/Polymer/docs/subscription",
                "commits_url": "https://api.github.com/repos/Polymer/docs/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/Polymer/docs/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/Polymer/docs/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/Polymer/docs/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/Polymer/docs/contents/{+path}",
                "compare_url": "https://api.github.com/repos/Polymer/docs/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/Polymer/docs/merges",
                "archive_url": "https://api.github.com/repos/Polymer/docs/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/Polymer/docs/downloads",
                "issues_url": "https://api.github.com/repos/Polymer/docs/issues{/number}",
                "pulls_url": "https://api.github.com/repos/Polymer/docs/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/Polymer/docs/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/Polymer/docs/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/Polymer/docs/labels{/name}",
                "releases_url": "https://api.github.com/repos/Polymer/docs/releases{/id}",
                "created_at": "2013-01-24T19:11:00Z",
                "updated_at": "2014-08-01T01:48:12Z",
                "pushed_at": "2014-08-01T12:57:40Z",
                "git_url": "git://github.com/Polymer/docs.git",
                "ssh_url": "git@github.com:Polymer/docs.git",
                "clone_url": "https://github.com/Polymer/docs.git",
                "svn_url": "https://github.com/Polymer/docs",
                "homepage": "www.polymer-project.org",
                "size": 23274,
                "stargazers_count": 368,
                "watchers_count": 368,
                "language": "CSS",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 573,
                "mirror_url": null,
                "open_issues_count": 85,
                "forks": 573,
                "open_issues": 85,
                "watchers": 368,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/Polymer/docs/pulls/573"},
              "html": {"href": "https://github.com/Polymer/docs/pull/573"},
              "issue": {"href": "https://api.github.com/repos/Polymer/docs/issues/573"},
              "comments": {"href": "https://api.github.com/repos/Polymer/docs/issues/573/comments"},
              "review_comments": {"href": "https://api.github.com/repos/Polymer/docs/pulls/573/comments"},
              "review_comment": {"href": "https://api.github.com/repos/Polymer/docs/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/Polymer/docs/pulls/573/commits"},
              "statuses": {"href": "https://api.github.com/repos/Polymer/docs/statuses/d02f2631ac5336db0a5c6622f06beb654e7904bf"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 74,
            "deletions": 13,
            "changed_files": 1
          }
        },
        "public": true,
        "created_at": "2014-08-01T13:00:02Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214560545",
        "type": "CreateEvent",
        "actor": {
          "id": 110953,
          "login": "addyosmani",
          "gravatar_id": "96270e4c3e5e9806cf7245475c00b275",
          "url": "https://api.github.com/users/addyosmani",
          "avatar_url": "https://avatars.githubusercontent.com/u/110953?"
        },
        "repo": {
          "id": 7804910,
          "name": "Polymer/docs",
          "url": "https://api.github.com/repos/Polymer/docs"
        },
        "payload": {
          "ref": "globalfilters",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for Polymer",
          "pusher_type": "user"
        },
        "public": true,
        "created_at": "2014-08-01T12:57:40Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214545395",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 597287,
          "login": "OttoRobba",
          "gravatar_id": "d4cda76db3fb9a3ee452c8e2432c3b0d",
          "url": "https://api.github.com/users/OttoRobba",
          "avatar_url": "https://avatars.githubusercontent.com/u/597287?"
        },
        "repo": {
          "id": 14120695,
          "name": "Polymer/designer",
          "url": "https://api.github.com/repos/Polymer/designer"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/designer/issues/61",
            "labels_url": "https://api.github.com/repos/Polymer/designer/issues/61/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/designer/issues/61/comments",
            "events_url": "https://api.github.com/repos/Polymer/designer/issues/61/events",
            "html_url": "https://github.com/Polymer/designer/issues/61",
            "id": 39114552,
            "number": 61,
            "title": "Losing code when toggling  Code/Design view",
            "user": {
              "login": "monkeybrau",
              "id": 8263092,
              "avatar_url": "https://avatars.githubusercontent.com/u/8263092?v=1",
              "gravatar_id": "a674a9a1e969de2036642613618da985",
              "url": "https://api.github.com/users/monkeybrau",
              "html_url": "https://github.com/monkeybrau",
              "followers_url": "https://api.github.com/users/monkeybrau/followers",
              "following_url": "https://api.github.com/users/monkeybrau/following{/other_user}",
              "gists_url": "https://api.github.com/users/monkeybrau/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/monkeybrau/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/monkeybrau/subscriptions",
              "organizations_url": "https://api.github.com/users/monkeybrau/orgs",
              "repos_url": "https://api.github.com/users/monkeybrau/repos",
              "events_url": "https://api.github.com/users/monkeybrau/events{/privacy}",
              "received_events_url": "https://api.github.com/users/monkeybrau/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": {
              "login": "ebidel",
              "id": 238208,
              "avatar_url": "https://avatars.githubusercontent.com/u/238208?v=1",
              "gravatar_id": "e7948aac7c52b26470be80311873a398",
              "url": "https://api.github.com/users/ebidel",
              "html_url": "https://github.com/ebidel",
              "followers_url": "https://api.github.com/users/ebidel/followers",
              "following_url": "https://api.github.com/users/ebidel/following{/other_user}",
              "gists_url": "https://api.github.com/users/ebidel/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/ebidel/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/ebidel/subscriptions",
              "organizations_url": "https://api.github.com/users/ebidel/orgs",
              "repos_url": "https://api.github.com/users/ebidel/repos",
              "events_url": "https://api.github.com/users/ebidel/events{/privacy}",
              "received_events_url": "https://api.github.com/users/ebidel/received_events",
              "type": "User",
              "site_admin": false
            },
            "milestone": null,
            "comments": 9,
            "created_at": "2014-07-30T17:05:07Z",
            "updated_at": "2014-08-01T12:46:46Z",
            "closed_at": null,
            "body": "I noticed this issue between 7/29/2014 and 7/30/2014. If you just navigate to a fresh designer view you can reproduce it: http://www.polymer-project.org/tools/designer/\r\n\r\nDrag a Core Card onto the page, click to toggle code/design view and examine the code. Click again to return to design view and your canvas will be blank. Click to code view again and your code is gone. I am seeing this in Chrome 36.0.1985.125m (today's latest) and Firefox 31 (if that's interesting.)\r\n\r\nUpon toggling back from code view to design view, the following exception is caught in the Chrome dev console:\r\n\r\nException caught during observer callback: TypeError: undefined is not a function\r\n    at x-meta.Polymer.ensureMeta (http://www.polymer-project.org/tools/designer/components/x-meta/x-meta.html:151:47)\r\n    at design-host.Polymer.loadElementImports (http://www.polymer-project.org/tools/designer/elements/design-host/design-host.html:122:22)\r\n    at design-host.Polymer.loadHtml (http://www.polymer-project.org/tools/designer/elements/design-host/design-host.html:96:12)\r\n    at design-canvas.Polymer.loadHtml (http://www.polymer-project.org/tools/designer/elements/design-canvas/design-canvas.html:549:21)\r\n    at design-frame.Polymer.loadHtml (http://www.polymer-project.org/tools/designer/elements/design-frame/design-frame.html:62:19)\r\n    at designer-element.Polymer.loadHtml (http://www.polymer-project.org/tools/designer/elements/designer-element/designer-element.html:434:19)\r\n    at designer-element.Polymer.codeToDesign (http://www.polymer-project.org/tools/designer/elements/designer-element/designer-element.html:332:10)\r\n    at designer-element.Polymer.selectedChanged (http://www.polymer-project.org/tools/designer/elements/designer-element/designer-element.html:277:12)\r\n    at designer-element.g.invokeMethod (http://www.polymer-project.org/tools/designer/components/polymer/polymer.js:12:13312)\r\n    at designer-element.g.notifyPropertyChanges (http://www.polymer-project.org/tools/designer/components/polymer/polymer.js:12:11598) \r\n\r\n"
          },
          "comment": {
            "url": "https://api.github.com/repos/Polymer/designer/issues/comments/50879864",
            "html_url": "https://github.com/Polymer/designer/issues/61#issuecomment-50879864",
            "issue_url": "https://api.github.com/repos/Polymer/designer/issues/61",
            "id": 50879864,
            "user": {
              "login": "OttoRobba",
              "id": 597287,
              "avatar_url": "https://avatars.githubusercontent.com/u/597287?v=1",
              "gravatar_id": "d4cda76db3fb9a3ee452c8e2432c3b0d",
              "url": "https://api.github.com/users/OttoRobba",
              "html_url": "https://github.com/OttoRobba",
              "followers_url": "https://api.github.com/users/OttoRobba/followers",
              "following_url": "https://api.github.com/users/OttoRobba/following{/other_user}",
              "gists_url": "https://api.github.com/users/OttoRobba/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/OttoRobba/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/OttoRobba/subscriptions",
              "organizations_url": "https://api.github.com/users/OttoRobba/orgs",
              "repos_url": "https://api.github.com/users/OttoRobba/repos",
              "events_url": "https://api.github.com/users/OttoRobba/events{/privacy}",
              "received_events_url": "https://api.github.com/users/OttoRobba/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-01T12:46:46Z",
            "updated_at": "2014-08-01T12:46:46Z",
            "body": "Same issue on Firefox 31 (64bit Linux) and Chromium 34 (64bit Linux)"
          }
        },
        "public": true,
        "created_at": "2014-08-01T12:46:46Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214522110",
        "type": "WatchEvent",
        "actor": {
          "id": 1263239,
          "login": "RootMale",
          "gravatar_id": "8d0b4df3fe1c70b7c5f1e4ca4ce32a7f",
          "url": "https://api.github.com/users/RootMale",
          "avatar_url": "https://avatars.githubusercontent.com/u/1263239?"
        },
        "repo": {
          "id": 19582637,
          "name": "Polymer/paper-ripple",
          "url": "https://api.github.com/repos/Polymer/paper-ripple"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T12:28:48Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214501510",
        "type": "WatchEvent",
        "actor": {
          "id": 459918,
          "login": "firecode",
          "gravatar_id": "e923aa50548d9e1959d9de0d30ca139f",
          "url": "https://api.github.com/users/firecode",
          "avatar_url": "https://avatars.githubusercontent.com/u/459918?"
        },
        "repo": {
          "id": 14432672,
          "name": "Polymer/polymer-dev",
          "url": "https://api.github.com/repos/Polymer/polymer-dev"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T12:12:16Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214448835",
        "type": "ForkEvent",
        "actor": {
          "id": 5439360,
          "login": "Escapado",
          "gravatar_id": "7c8fedf7977e78644b79c80ab266aef9",
          "url": "https://api.github.com/users/Escapado",
          "avatar_url": "https://avatars.githubusercontent.com/u/5439360?"
        },
        "repo": {
          "id": 7804910,
          "name": "Polymer/docs",
          "url": "https://api.github.com/repos/Polymer/docs"
        },
        "payload": {"forkee": {
            "id": 22506747,
            "name": "docs",
            "full_name": "Escapado/docs",
            "owner": {
              "login": "Escapado",
              "id": 5439360,
              "avatar_url": "https://avatars.githubusercontent.com/u/5439360?v=1",
              "gravatar_id": "7c8fedf7977e78644b79c80ab266aef9",
              "url": "https://api.github.com/users/Escapado",
              "html_url": "https://github.com/Escapado",
              "followers_url": "https://api.github.com/users/Escapado/followers",
              "following_url": "https://api.github.com/users/Escapado/following{/other_user}",
              "gists_url": "https://api.github.com/users/Escapado/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/Escapado/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/Escapado/subscriptions",
              "organizations_url": "https://api.github.com/users/Escapado/orgs",
              "repos_url": "https://api.github.com/users/Escapado/repos",
              "events_url": "https://api.github.com/users/Escapado/events{/privacy}",
              "received_events_url": "https://api.github.com/users/Escapado/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/Escapado/docs",
            "description": "Documentation for Polymer",
            "fork": true,
            "url": "https://api.github.com/repos/Escapado/docs",
            "forks_url": "https://api.github.com/repos/Escapado/docs/forks",
            "keys_url": "https://api.github.com/repos/Escapado/docs/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/Escapado/docs/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/Escapado/docs/teams",
            "hooks_url": "https://api.github.com/repos/Escapado/docs/hooks",
            "issue_events_url": "https://api.github.com/repos/Escapado/docs/issues/events{/number}",
            "events_url": "https://api.github.com/repos/Escapado/docs/events",
            "assignees_url": "https://api.github.com/repos/Escapado/docs/assignees{/user}",
            "branches_url": "https://api.github.com/repos/Escapado/docs/branches{/branch}",
            "tags_url": "https://api.github.com/repos/Escapado/docs/tags",
            "blobs_url": "https://api.github.com/repos/Escapado/docs/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/Escapado/docs/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/Escapado/docs/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/Escapado/docs/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/Escapado/docs/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/Escapado/docs/languages",
            "stargazers_url": "https://api.github.com/repos/Escapado/docs/stargazers",
            "contributors_url": "https://api.github.com/repos/Escapado/docs/contributors",
            "subscribers_url": "https://api.github.com/repos/Escapado/docs/subscribers",
            "subscription_url": "https://api.github.com/repos/Escapado/docs/subscription",
            "commits_url": "https://api.github.com/repos/Escapado/docs/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/Escapado/docs/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/Escapado/docs/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/Escapado/docs/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/Escapado/docs/contents/{+path}",
            "compare_url": "https://api.github.com/repos/Escapado/docs/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/Escapado/docs/merges",
            "archive_url": "https://api.github.com/repos/Escapado/docs/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/Escapado/docs/downloads",
            "issues_url": "https://api.github.com/repos/Escapado/docs/issues{/number}",
            "pulls_url": "https://api.github.com/repos/Escapado/docs/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/Escapado/docs/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/Escapado/docs/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/Escapado/docs/labels{/name}",
            "releases_url": "https://api.github.com/repos/Escapado/docs/releases{/id}",
            "created_at": "2014-08-01T11:27:11Z",
            "updated_at": "2014-08-01T01:48:12Z",
            "pushed_at": "2014-08-01T02:05:23Z",
            "git_url": "git://github.com/Escapado/docs.git",
            "ssh_url": "git@github.com:Escapado/docs.git",
            "clone_url": "https://github.com/Escapado/docs.git",
            "svn_url": "https://github.com/Escapado/docs",
            "homepage": "www.polymer-project.org",
            "size": 23274,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T11:27:11Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214428841",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 4281416,
          "login": "krozycki",
          "gravatar_id": "bbbb18f055913753d04b39fdae9223ee",
          "url": "https://api.github.com/users/krozycki",
          "avatar_url": "https://avatars.githubusercontent.com/u/4281416?"
        },
        "repo": {
          "id": 17417350,
          "name": "Polymer/paper-input",
          "url": "https://api.github.com/repos/Polymer/paper-input"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/paper-input/issues/28",
            "labels_url": "https://api.github.com/repos/Polymer/paper-input/issues/28/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/paper-input/issues/28/comments",
            "events_url": "https://api.github.com/repos/Polymer/paper-input/issues/28/events",
            "html_url": "https://github.com/Polymer/paper-input/issues/28",
            "id": 37733700,
            "number": 28,
            "title": "Paper Input does not accept value attribute if multi-line",
            "user": {
              "login": "bengfarrell",
              "id": 1298188,
              "avatar_url": "https://avatars.githubusercontent.com/u/1298188?v=1",
              "gravatar_id": "073262b43fb641150c8c5a81e6952f90",
              "url": "https://api.github.com/users/bengfarrell",
              "html_url": "https://github.com/bengfarrell",
              "followers_url": "https://api.github.com/users/bengfarrell/followers",
              "following_url": "https://api.github.com/users/bengfarrell/following{/other_user}",
              "gists_url": "https://api.github.com/users/bengfarrell/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/bengfarrell/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/bengfarrell/subscriptions",
              "organizations_url": "https://api.github.com/users/bengfarrell/orgs",
              "repos_url": "https://api.github.com/users/bengfarrell/repos",
              "events_url": "https://api.github.com/users/bengfarrell/events{/privacy}",
              "received_events_url": "https://api.github.com/users/bengfarrell/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": {
              "login": "morethanreal",
              "id": 1202776,
              "avatar_url": "https://avatars.githubusercontent.com/u/1202776?v=1",
              "gravatar_id": "a0fcc446098fdf18fcc94998f7a5ff76",
              "url": "https://api.github.com/users/morethanreal",
              "html_url": "https://github.com/morethanreal",
              "followers_url": "https://api.github.com/users/morethanreal/followers",
              "following_url": "https://api.github.com/users/morethanreal/following{/other_user}",
              "gists_url": "https://api.github.com/users/morethanreal/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/morethanreal/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/morethanreal/subscriptions",
              "organizations_url": "https://api.github.com/users/morethanreal/orgs",
              "repos_url": "https://api.github.com/users/morethanreal/repos",
              "events_url": "https://api.github.com/users/morethanreal/events{/privacy}",
              "received_events_url": "https://api.github.com/users/morethanreal/received_events",
              "type": "User",
              "site_admin": false
            },
            "milestone": null,
            "comments": 1,
            "created_at": "2014-07-13T03:20:50Z",
            "updated_at": "2014-08-01T11:09:30Z",
            "closed_at": null,
            "body": "When doing the following, everything works fine:\r\n&lt;paper-input multiline label=\"Enter multiple lines here\"&gt;&lt;/paper-input&gt;\r\n\r\nI see an input that says \"Enter multiple lines here\", and it grows as I start hitting enter for newline characters. This is awesome.\r\n\r\nHowever, the following does not appear to work:\r\n&lt;paper-input multiline label=\"Enter multiple lines here\" value=\"sdsffsf\"&gt;&lt;/paper-input&gt;\r\n\r\nAdding the value attribute cause things to break down, and I no longer see the paper-input field on my page. Meanwhile core-input behaves as I would expect\r\n"
          },
          "comment": {
            "url": "https://api.github.com/repos/Polymer/paper-input/issues/comments/50873101",
            "html_url": "https://github.com/Polymer/paper-input/issues/28#issuecomment-50873101",
            "issue_url": "https://api.github.com/repos/Polymer/paper-input/issues/28",
            "id": 50873101,
            "user": {
              "login": "krozycki",
              "id": 4281416,
              "avatar_url": "https://avatars.githubusercontent.com/u/4281416?v=1",
              "gravatar_id": "bbbb18f055913753d04b39fdae9223ee",
              "url": "https://api.github.com/users/krozycki",
              "html_url": "https://github.com/krozycki",
              "followers_url": "https://api.github.com/users/krozycki/followers",
              "following_url": "https://api.github.com/users/krozycki/following{/other_user}",
              "gists_url": "https://api.github.com/users/krozycki/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/krozycki/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/krozycki/subscriptions",
              "organizations_url": "https://api.github.com/users/krozycki/orgs",
              "repos_url": "https://api.github.com/users/krozycki/repos",
              "events_url": "https://api.github.com/users/krozycki/events{/privacy}",
              "received_events_url": "https://api.github.com/users/krozycki/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-01T11:09:30Z",
            "updated_at": "2014-08-01T11:09:30Z",
            "body": "I have the same problem."
          }
        },
        "public": true,
        "created_at": "2014-08-01T11:09:30Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214411046",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 110953,
          "login": "addyosmani",
          "gravatar_id": "96270e4c3e5e9806cf7245475c00b275",
          "url": "https://api.github.com/users/addyosmani",
          "avatar_url": "https://avatars.githubusercontent.com/u/110953?"
        },
        "repo": {
          "id": 7804910,
          "name": "Polymer/docs",
          "url": "https://api.github.com/repos/Polymer/docs"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/docs/issues/571",
            "labels_url": "https://api.github.com/repos/Polymer/docs/issues/571/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/docs/issues/571/comments",
            "events_url": "https://api.github.com/repos/Polymer/docs/issues/571/events",
            "html_url": "https://github.com/Polymer/docs/issues/571",
            "id": 39248845,
            "number": 571,
            "title": "How to add global filters to PolymerExpressions",
            "user": {
              "login": "ebidel",
              "id": 238208,
              "avatar_url": "https://avatars.githubusercontent.com/u/238208?v=1",
              "gravatar_id": "e7948aac7c52b26470be80311873a398",
              "url": "https://api.github.com/users/ebidel",
              "html_url": "https://github.com/ebidel",
              "followers_url": "https://api.github.com/users/ebidel/followers",
              "following_url": "https://api.github.com/users/ebidel/following{/other_user}",
              "gists_url": "https://api.github.com/users/ebidel/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/ebidel/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/ebidel/subscriptions",
              "organizations_url": "https://api.github.com/users/ebidel/orgs",
              "repos_url": "https://api.github.com/users/ebidel/repos",
              "events_url": "https://api.github.com/users/ebidel/events{/privacy}",
              "received_events_url": "https://api.github.com/users/ebidel/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-07-31T23:26:59Z",
            "updated_at": "2014-08-01T10:54:39Z",
            "closed_at": null,
            "body": "e.g. https://github.com/addyosmani/polymer-filters\r\n\r\nFrom the mailing list."
          },
          "comment": {
            "url": "https://api.github.com/repos/Polymer/docs/issues/comments/50872143",
            "html_url": "https://github.com/Polymer/docs/issues/571#issuecomment-50872143",
            "issue_url": "https://api.github.com/repos/Polymer/docs/issues/571",
            "id": 50872143,
            "user": {
              "login": "addyosmani",
              "id": 110953,
              "avatar_url": "https://avatars.githubusercontent.com/u/110953?v=1",
              "gravatar_id": "96270e4c3e5e9806cf7245475c00b275",
              "url": "https://api.github.com/users/addyosmani",
              "html_url": "https://github.com/addyosmani",
              "followers_url": "https://api.github.com/users/addyosmani/followers",
              "following_url": "https://api.github.com/users/addyosmani/following{/other_user}",
              "gists_url": "https://api.github.com/users/addyosmani/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/addyosmani/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/addyosmani/subscriptions",
              "organizations_url": "https://api.github.com/users/addyosmani/orgs",
              "repos_url": "https://api.github.com/users/addyosmani/repos",
              "events_url": "https://api.github.com/users/addyosmani/events{/privacy}",
              "received_events_url": "https://api.github.com/users/addyosmani/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-01T10:54:39Z",
            "updated_at": "2014-08-01T10:54:39Z",
            "body": "I would be happy to author a section on this. "
          }
        },
        "public": true,
        "created_at": "2014-08-01T10:54:39Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214399921",
        "type": "PullRequestEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {
          "action": "opened",
          "number": 21,
          "pull_request": {
            "url": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21",
            "id": 19203838,
            "html_url": "https://github.com/Polymer/polymer-tutorial/pull/21",
            "diff_url": "https://github.com/Polymer/polymer-tutorial/pull/21.diff",
            "patch_url": "https://github.com/Polymer/polymer-tutorial/pull/21.patch",
            "issue_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/21",
            "number": 21,
            "state": "open",
            "title": "strip BOMs (fixes #20)",
            "user": {
              "login": "marcoms",
              "id": 4211302,
              "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
              "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
              "url": "https://api.github.com/users/marcoms",
              "html_url": "https://github.com/marcoms",
              "followers_url": "https://api.github.com/users/marcoms/followers",
              "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
              "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
              "organizations_url": "https://api.github.com/users/marcoms/orgs",
              "repos_url": "https://api.github.com/users/marcoms/repos",
              "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
              "received_events_url": "https://api.github.com/users/marcoms/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "`for i in $(find ./ -iname \"*\"); do sed -i '1 s/^\\xef\\xbb\\xbf//' $i; done`",
            "created_at": "2014-08-01T10:45:05Z",
            "updated_at": "2014-08-01T10:45:05Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21/commits",
            "review_comments_url": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21/comments",
            "review_comment_url": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/21/comments",
            "statuses_url": "https://api.github.com/repos/Polymer/polymer-tutorial/statuses/d49db62f1ada0cae49d4e118273b58d990e5ac09",
            "head": {
              "label": "marcoms:master",
              "ref": "master",
              "sha": "d49db62f1ada0cae49d4e118273b58d990e5ac09",
              "user": {
                "login": "marcoms",
                "id": 4211302,
                "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
                "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
                "url": "https://api.github.com/users/marcoms",
                "html_url": "https://github.com/marcoms",
                "followers_url": "https://api.github.com/users/marcoms/followers",
                "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
                "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
                "organizations_url": "https://api.github.com/users/marcoms/orgs",
                "repos_url": "https://api.github.com/users/marcoms/repos",
                "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
                "received_events_url": "https://api.github.com/users/marcoms/received_events",
                "type": "User",
                "site_admin": false
              },
              "repo": {
                "id": 22505528,
                "name": "polymer-tutorial",
                "full_name": "marcoms/polymer-tutorial",
                "owner": {
                  "login": "marcoms",
                  "id": 4211302,
                  "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
                  "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
                  "url": "https://api.github.com/users/marcoms",
                  "html_url": "https://github.com/marcoms",
                  "followers_url": "https://api.github.com/users/marcoms/followers",
                  "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
                  "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
                  "organizations_url": "https://api.github.com/users/marcoms/orgs",
                  "repos_url": "https://api.github.com/users/marcoms/repos",
                  "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/marcoms/received_events",
                  "type": "User",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/marcoms/polymer-tutorial",
                "description": "Tutorial starter app",
                "fork": true,
                "url": "https://api.github.com/repos/marcoms/polymer-tutorial",
                "forks_url": "https://api.github.com/repos/marcoms/polymer-tutorial/forks",
                "keys_url": "https://api.github.com/repos/marcoms/polymer-tutorial/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/marcoms/polymer-tutorial/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/marcoms/polymer-tutorial/teams",
                "hooks_url": "https://api.github.com/repos/marcoms/polymer-tutorial/hooks",
                "issue_events_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues/events{/number}",
                "events_url": "https://api.github.com/repos/marcoms/polymer-tutorial/events",
                "assignees_url": "https://api.github.com/repos/marcoms/polymer-tutorial/assignees{/user}",
                "branches_url": "https://api.github.com/repos/marcoms/polymer-tutorial/branches{/branch}",
                "tags_url": "https://api.github.com/repos/marcoms/polymer-tutorial/tags",
                "blobs_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/marcoms/polymer-tutorial/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/marcoms/polymer-tutorial/languages",
                "stargazers_url": "https://api.github.com/repos/marcoms/polymer-tutorial/stargazers",
                "contributors_url": "https://api.github.com/repos/marcoms/polymer-tutorial/contributors",
                "subscribers_url": "https://api.github.com/repos/marcoms/polymer-tutorial/subscribers",
                "subscription_url": "https://api.github.com/repos/marcoms/polymer-tutorial/subscription",
                "commits_url": "https://api.github.com/repos/marcoms/polymer-tutorial/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/marcoms/polymer-tutorial/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/marcoms/polymer-tutorial/contents/{+path}",
                "compare_url": "https://api.github.com/repos/marcoms/polymer-tutorial/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/marcoms/polymer-tutorial/merges",
                "archive_url": "https://api.github.com/repos/marcoms/polymer-tutorial/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/marcoms/polymer-tutorial/downloads",
                "issues_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues{/number}",
                "pulls_url": "https://api.github.com/repos/marcoms/polymer-tutorial/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/marcoms/polymer-tutorial/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/marcoms/polymer-tutorial/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/marcoms/polymer-tutorial/labels{/name}",
                "releases_url": "https://api.github.com/repos/marcoms/polymer-tutorial/releases{/id}",
                "created_at": "2014-08-01T10:34:33Z",
                "updated_at": "2014-08-01T10:38:40Z",
                "pushed_at": "2014-08-01T10:43:20Z",
                "git_url": "git://github.com/marcoms/polymer-tutorial.git",
                "ssh_url": "git@github.com:marcoms/polymer-tutorial.git",
                "clone_url": "https://github.com/marcoms/polymer-tutorial.git",
                "svn_url": "https://github.com/marcoms/polymer-tutorial",
                "homepage": null,
                "size": 48864,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CSS",
                "has_issues": false,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "Polymer:master",
              "ref": "master",
              "sha": "957131cf07b53516e3ae804a2eb96745bd7b237a",
              "user": {
                "login": "Polymer",
                "id": 2159051,
                "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                "url": "https://api.github.com/users/Polymer",
                "html_url": "https://github.com/Polymer",
                "followers_url": "https://api.github.com/users/Polymer/followers",
                "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                "organizations_url": "https://api.github.com/users/Polymer/orgs",
                "repos_url": "https://api.github.com/users/Polymer/repos",
                "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                "received_events_url": "https://api.github.com/users/Polymer/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 20638880,
                "name": "polymer-tutorial",
                "full_name": "Polymer/polymer-tutorial",
                "owner": {
                  "login": "Polymer",
                  "id": 2159051,
                  "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                  "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                  "url": "https://api.github.com/users/Polymer",
                  "html_url": "https://github.com/Polymer",
                  "followers_url": "https://api.github.com/users/Polymer/followers",
                  "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                  "organizations_url": "https://api.github.com/users/Polymer/orgs",
                  "repos_url": "https://api.github.com/users/Polymer/repos",
                  "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Polymer/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/Polymer/polymer-tutorial",
                "description": "Tutorial starter app",
                "fork": false,
                "url": "https://api.github.com/repos/Polymer/polymer-tutorial",
                "forks_url": "https://api.github.com/repos/Polymer/polymer-tutorial/forks",
                "keys_url": "https://api.github.com/repos/Polymer/polymer-tutorial/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/Polymer/polymer-tutorial/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/Polymer/polymer-tutorial/teams",
                "hooks_url": "https://api.github.com/repos/Polymer/polymer-tutorial/hooks",
                "issue_events_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/events{/number}",
                "events_url": "https://api.github.com/repos/Polymer/polymer-tutorial/events",
                "assignees_url": "https://api.github.com/repos/Polymer/polymer-tutorial/assignees{/user}",
                "branches_url": "https://api.github.com/repos/Polymer/polymer-tutorial/branches{/branch}",
                "tags_url": "https://api.github.com/repos/Polymer/polymer-tutorial/tags",
                "blobs_url": "https://api.github.com/repos/Polymer/polymer-tutorial/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/Polymer/polymer-tutorial/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/Polymer/polymer-tutorial/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/Polymer/polymer-tutorial/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/Polymer/polymer-tutorial/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/Polymer/polymer-tutorial/languages",
                "stargazers_url": "https://api.github.com/repos/Polymer/polymer-tutorial/stargazers",
                "contributors_url": "https://api.github.com/repos/Polymer/polymer-tutorial/contributors",
                "subscribers_url": "https://api.github.com/repos/Polymer/polymer-tutorial/subscribers",
                "subscription_url": "https://api.github.com/repos/Polymer/polymer-tutorial/subscription",
                "commits_url": "https://api.github.com/repos/Polymer/polymer-tutorial/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/Polymer/polymer-tutorial/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/Polymer/polymer-tutorial/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/Polymer/polymer-tutorial/contents/{+path}",
                "compare_url": "https://api.github.com/repos/Polymer/polymer-tutorial/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/Polymer/polymer-tutorial/merges",
                "archive_url": "https://api.github.com/repos/Polymer/polymer-tutorial/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/Polymer/polymer-tutorial/downloads",
                "issues_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues{/number}",
                "pulls_url": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/Polymer/polymer-tutorial/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/Polymer/polymer-tutorial/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/Polymer/polymer-tutorial/labels{/name}",
                "releases_url": "https://api.github.com/repos/Polymer/polymer-tutorial/releases{/id}",
                "created_at": "2014-06-09T08:03:53Z",
                "updated_at": "2014-08-01T10:13:59Z",
                "pushed_at": "2014-07-31T10:49:07Z",
                "git_url": "git://github.com/Polymer/polymer-tutorial.git",
                "ssh_url": "git@github.com:Polymer/polymer-tutorial.git",
                "clone_url": "https://github.com/Polymer/polymer-tutorial.git",
                "svn_url": "https://github.com/Polymer/polymer-tutorial",
                "homepage": null,
                "size": 48864,
                "stargazers_count": 88,
                "watchers_count": 88,
                "language": "CSS",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 50,
                "mirror_url": null,
                "open_issues_count": 4,
                "forks": 50,
                "open_issues": 4,
                "watchers": 88,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21"},
              "html": {"href": "https://github.com/Polymer/polymer-tutorial/pull/21"},
              "issue": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/21"},
              "comments": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/21/comments"},
              "review_comments": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21/comments"},
              "review_comment": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/pulls/21/commits"},
              "statuses": {"href": "https://api.github.com/repos/Polymer/polymer-tutorial/statuses/d49db62f1ada0cae49d4e118273b58d990e5ac09"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 18,
            "deletions": 18,
            "changed_files": 18
          }
        },
        "public": true,
        "created_at": "2014-08-01T10:45:05Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214387413",
        "type": "WatchEvent",
        "actor": {
          "id": 597287,
          "login": "OttoRobba",
          "gravatar_id": "d4cda76db3fb9a3ee452c8e2432c3b0d",
          "url": "https://api.github.com/users/OttoRobba",
          "avatar_url": "https://avatars.githubusercontent.com/u/597287?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T10:35:04Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214386803",
        "type": "ForkEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {"forkee": {
            "id": 22505528,
            "name": "polymer-tutorial",
            "full_name": "marcoms/polymer-tutorial",
            "owner": {
              "login": "marcoms",
              "id": 4211302,
              "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
              "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
              "url": "https://api.github.com/users/marcoms",
              "html_url": "https://github.com/marcoms",
              "followers_url": "https://api.github.com/users/marcoms/followers",
              "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
              "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
              "organizations_url": "https://api.github.com/users/marcoms/orgs",
              "repos_url": "https://api.github.com/users/marcoms/repos",
              "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
              "received_events_url": "https://api.github.com/users/marcoms/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/marcoms/polymer-tutorial",
            "description": "Tutorial starter app",
            "fork": true,
            "url": "https://api.github.com/repos/marcoms/polymer-tutorial",
            "forks_url": "https://api.github.com/repos/marcoms/polymer-tutorial/forks",
            "keys_url": "https://api.github.com/repos/marcoms/polymer-tutorial/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/marcoms/polymer-tutorial/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/marcoms/polymer-tutorial/teams",
            "hooks_url": "https://api.github.com/repos/marcoms/polymer-tutorial/hooks",
            "issue_events_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues/events{/number}",
            "events_url": "https://api.github.com/repos/marcoms/polymer-tutorial/events",
            "assignees_url": "https://api.github.com/repos/marcoms/polymer-tutorial/assignees{/user}",
            "branches_url": "https://api.github.com/repos/marcoms/polymer-tutorial/branches{/branch}",
            "tags_url": "https://api.github.com/repos/marcoms/polymer-tutorial/tags",
            "blobs_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/marcoms/polymer-tutorial/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/marcoms/polymer-tutorial/languages",
            "stargazers_url": "https://api.github.com/repos/marcoms/polymer-tutorial/stargazers",
            "contributors_url": "https://api.github.com/repos/marcoms/polymer-tutorial/contributors",
            "subscribers_url": "https://api.github.com/repos/marcoms/polymer-tutorial/subscribers",
            "subscription_url": "https://api.github.com/repos/marcoms/polymer-tutorial/subscription",
            "commits_url": "https://api.github.com/repos/marcoms/polymer-tutorial/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/marcoms/polymer-tutorial/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/marcoms/polymer-tutorial/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/marcoms/polymer-tutorial/contents/{+path}",
            "compare_url": "https://api.github.com/repos/marcoms/polymer-tutorial/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/marcoms/polymer-tutorial/merges",
            "archive_url": "https://api.github.com/repos/marcoms/polymer-tutorial/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/marcoms/polymer-tutorial/downloads",
            "issues_url": "https://api.github.com/repos/marcoms/polymer-tutorial/issues{/number}",
            "pulls_url": "https://api.github.com/repos/marcoms/polymer-tutorial/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/marcoms/polymer-tutorial/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/marcoms/polymer-tutorial/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/marcoms/polymer-tutorial/labels{/name}",
            "releases_url": "https://api.github.com/repos/marcoms/polymer-tutorial/releases{/id}",
            "created_at": "2014-08-01T10:34:33Z",
            "updated_at": "2014-08-01T10:13:59Z",
            "pushed_at": "2014-07-31T10:49:07Z",
            "git_url": "git://github.com/marcoms/polymer-tutorial.git",
            "ssh_url": "git@github.com:marcoms/polymer-tutorial.git",
            "clone_url": "https://github.com/marcoms/polymer-tutorial.git",
            "svn_url": "https://github.com/marcoms/polymer-tutorial",
            "homepage": null,
            "size": 48864,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T10:34:34Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214386384",
        "type": "WatchEvent",
        "actor": {
          "id": 597287,
          "login": "OttoRobba",
          "gravatar_id": "d4cda76db3fb9a3ee452c8e2432c3b0d",
          "url": "https://api.github.com/users/OttoRobba",
          "avatar_url": "https://avatars.githubusercontent.com/u/597287?"
        },
        "repo": {
          "id": 14432672,
          "name": "Polymer/polymer-dev",
          "url": "https://api.github.com/repos/Polymer/polymer-dev"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T10:34:14Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214373807",
        "type": "IssuesEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {
          "action": "opened",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20",
            "labels_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/comments",
            "events_url": "https://api.github.com/repos/Polymer/polymer-tutorial/issues/20/events",
            "html_url": "https://github.com/Polymer/polymer-tutorial/issues/20",
            "id": 39278152,
            "number": 20,
            "title": "UTF-8 BOM in various files",
            "user": {
              "login": "marcoms",
              "id": 4211302,
              "avatar_url": "https://avatars.githubusercontent.com/u/4211302?v=1",
              "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
              "url": "https://api.github.com/users/marcoms",
              "html_url": "https://github.com/marcoms",
              "followers_url": "https://api.github.com/users/marcoms/followers",
              "following_url": "https://api.github.com/users/marcoms/following{/other_user}",
              "gists_url": "https://api.github.com/users/marcoms/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/marcoms/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/marcoms/subscriptions",
              "organizations_url": "https://api.github.com/users/marcoms/orgs",
              "repos_url": "https://api.github.com/users/marcoms/repos",
              "events_url": "https://api.github.com/users/marcoms/events{/privacy}",
              "received_events_url": "https://api.github.com/users/marcoms/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": null,
            "milestone": null,
            "comments": 0,
            "created_at": "2014-08-01T10:24:32Z",
            "updated_at": "2014-08-01T10:24:32Z",
            "closed_at": null,
            "body": "Having cloned the tutorial, `less finished/index.html` gives:\r\n\r\n    <U+FEFF><!doctype html>\r\n    <html>\r\n \r\n    ...\r\n\r\nFrom what I've seen, the starter `index.html` has this too, but I haven't investigated further."
          }
        },
        "public": true,
        "created_at": "2014-08-01T10:24:32Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214359972",
        "type": "WatchEvent",
        "actor": {
          "id": 4211302,
          "login": "marcoms",
          "gravatar_id": "d2c8cf73f172ce2c62096cbc97d582d9",
          "url": "https://api.github.com/users/marcoms",
          "avatar_url": "https://avatars.githubusercontent.com/u/4211302?"
        },
        "repo": {
          "id": 20638880,
          "name": "Polymer/polymer-tutorial",
          "url": "https://api.github.com/repos/Polymer/polymer-tutorial"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T10:13:59Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214358274",
        "type": "IssuesEvent",
        "actor": {
          "id": 1685883,
          "login": "mhoppi",
          "gravatar_id": "409a0cebf71d317c8e97954a6ff1935d",
          "url": "https://api.github.com/users/mhoppi",
          "avatar_url": "https://avatars.githubusercontent.com/u/1685883?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {
          "action": "opened",
          "issue": {
            "url": "https://api.github.com/repos/Polymer/polymer/issues/674",
            "labels_url": "https://api.github.com/repos/Polymer/polymer/issues/674/labels{/name}",
            "comments_url": "https://api.github.com/repos/Polymer/polymer/issues/674/comments",
            "events_url": "https://api.github.com/repos/Polymer/polymer/issues/674/events",
            "html_url": "https://github.com/Polymer/polymer/issues/674",
            "id": 39277419,
            "number": 674,
            "title": "Polymer Designer always deletes everything",
            "user": {
              "login": "mhoppi",
              "id": 1685883,
              "avatar_url": "https://avatars.githubusercontent.com/u/1685883?v=1",
              "gravatar_id": "409a0cebf71d317c8e97954a6ff1935d",
              "url": "https://api.github.com/users/mhoppi",
              "html_url": "https://github.com/mhoppi",
              "followers_url": "https://api.github.com/users/mhoppi/followers",
              "following_url": "https://api.github.com/users/mhoppi/following{/other_user}",
              "gists_url": "https://api.github.com/users/mhoppi/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mhoppi/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mhoppi/subscriptions",
              "organizations_url": "https://api.github.com/users/mhoppi/orgs",
              "repos_url": "https://api.github.com/users/mhoppi/repos",
              "events_url": "https://api.github.com/users/mhoppi/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mhoppi/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "assignee": null,
            "milestone": null,
            "comments": 0,
            "created_at": "2014-08-01T10:12:38Z",
            "updated_at": "2014-08-01T10:12:38Z",
            "closed_at": null,
            "body": "When i put element in polymer designer into the canvas and switch between code and designer, i can see the element in code modus, but when i switch back to designer, element is gone (also the code). I cant save the elements and on previw only shows an empty page.\r\n\r\nI can neither place a field inside a card..."
          }
        },
        "public": true,
        "created_at": "2014-08-01T10:12:39Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214345517",
        "type": "WatchEvent",
        "actor": {
          "id": 1263239,
          "login": "RootMale",
          "gravatar_id": "8d0b4df3fe1c70b7c5f1e4ca4ce32a7f",
          "url": "https://api.github.com/users/RootMale",
          "avatar_url": "https://avatars.githubusercontent.com/u/1263239?"
        },
        "repo": {
          "id": 8422015,
          "name": "Polymer/platform",
          "url": "https://api.github.com/repos/Polymer/platform"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T10:02:58Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214335493",
        "type": "WatchEvent",
        "actor": {
          "id": 619183,
          "login": "morristech",
          "gravatar_id": "f26183d9447d9df0ec0b7760c9963b4a",
          "url": "https://api.github.com/users/morristech",
          "avatar_url": "https://avatars.githubusercontent.com/u/619183?"
        },
        "repo": {
          "id": 20343431,
          "name": "Polymer/topeka",
          "url": "https://api.github.com/repos/Polymer/topeka"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:55:47Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214328163",
        "type": "WatchEvent",
        "actor": {
          "id": 801798,
          "login": "SparrowJang",
          "gravatar_id": "c1a1667c77d27e39e9969d3cb8a91c37",
          "url": "https://api.github.com/users/SparrowJang",
          "avatar_url": "https://avatars.githubusercontent.com/u/801798?"
        },
        "repo": {
          "id": 10450220,
          "name": "Polymer/todomvc",
          "url": "https://api.github.com/repos/Polymer/todomvc"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:50:35Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214326432",
        "type": "WatchEvent",
        "actor": {
          "id": 52437,
          "login": "tp",
          "gravatar_id": "cda2fdeeaa2619528de24f7dc77f1c1b",
          "url": "https://api.github.com/users/tp",
          "avatar_url": "https://avatars.githubusercontent.com/u/52437?"
        },
        "repo": {
          "id": 5372136,
          "name": "Polymer/observe-js",
          "url": "https://api.github.com/repos/Polymer/observe-js"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:49:22Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214324272",
        "type": "WatchEvent",
        "actor": {
          "id": 7658690,
          "login": "idol123456789",
          "gravatar_id": "0471f17fb856484572f87e5ad9fe2135",
          "url": "https://api.github.com/users/idol123456789",
          "avatar_url": "https://avatars.githubusercontent.com/u/7658690?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:47:47Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214314325",
        "type": "WatchEvent",
        "actor": {
          "id": 5786541,
          "login": "danchristian",
          "gravatar_id": null,
          "url": "https://api.github.com/users/danchristian",
          "avatar_url": "https://avatars.githubusercontent.com/u/5786541?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:41:03Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214284695",
        "type": "WatchEvent",
        "actor": {
          "id": 5584200,
          "login": "viiiyears",
          "gravatar_id": "efa2e3c85a86396a138daa9847f842c3",
          "url": "https://api.github.com/users/viiiyears",
          "avatar_url": "https://avatars.githubusercontent.com/u/5584200?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:20:09Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214280866",
        "type": "WatchEvent",
        "actor": {
          "id": 864218,
          "login": "beforeadream",
          "gravatar_id": "e705c3e148c2a5dee945419e27a18a29",
          "url": "https://api.github.com/users/beforeadream",
          "avatar_url": "https://avatars.githubusercontent.com/u/864218?"
        },
        "repo": {
          "id": 19483389,
          "name": "Polymer/paper-toast",
          "url": "https://api.github.com/repos/Polymer/paper-toast"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:17:23Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214257995",
        "type": "WatchEvent",
        "actor": {
          "id": 255313,
          "login": "svenjacobs",
          "gravatar_id": "b7f14cb85dedfbe883f1ebaed61b9851",
          "url": "https://api.github.com/users/svenjacobs",
          "avatar_url": "https://avatars.githubusercontent.com/u/255313?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T09:00:26Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214234995",
        "type": "ForkEvent",
        "actor": {
          "id": 3986510,
          "login": "ankoh",
          "gravatar_id": "825ecd8cfde1e3e241921f02fc87f275",
          "url": "https://api.github.com/users/ankoh",
          "avatar_url": "https://avatars.githubusercontent.com/u/3986510?"
        },
        "repo": {
          "id": 18537928,
          "name": "Polymer/core-drawer-panel",
          "url": "https://api.github.com/repos/Polymer/core-drawer-panel"
        },
        "payload": {"forkee": {
            "id": 22501871,
            "name": "core-drawer-panel",
            "full_name": "ankoh/core-drawer-panel",
            "owner": {
              "login": "ankoh",
              "id": 3986510,
              "avatar_url": "https://avatars.githubusercontent.com/u/3986510?v=1",
              "gravatar_id": "825ecd8cfde1e3e241921f02fc87f275",
              "url": "https://api.github.com/users/ankoh",
              "html_url": "https://github.com/ankoh",
              "followers_url": "https://api.github.com/users/ankoh/followers",
              "following_url": "https://api.github.com/users/ankoh/following{/other_user}",
              "gists_url": "https://api.github.com/users/ankoh/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/ankoh/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/ankoh/subscriptions",
              "organizations_url": "https://api.github.com/users/ankoh/orgs",
              "repos_url": "https://api.github.com/users/ankoh/repos",
              "events_url": "https://api.github.com/users/ankoh/events{/privacy}",
              "received_events_url": "https://api.github.com/users/ankoh/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/ankoh/core-drawer-panel",
            "description": "Simple two-section responsive panel",
            "fork": true,
            "url": "https://api.github.com/repos/ankoh/core-drawer-panel",
            "forks_url": "https://api.github.com/repos/ankoh/core-drawer-panel/forks",
            "keys_url": "https://api.github.com/repos/ankoh/core-drawer-panel/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/ankoh/core-drawer-panel/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/ankoh/core-drawer-panel/teams",
            "hooks_url": "https://api.github.com/repos/ankoh/core-drawer-panel/hooks",
            "issue_events_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues/events{/number}",
            "events_url": "https://api.github.com/repos/ankoh/core-drawer-panel/events",
            "assignees_url": "https://api.github.com/repos/ankoh/core-drawer-panel/assignees{/user}",
            "branches_url": "https://api.github.com/repos/ankoh/core-drawer-panel/branches{/branch}",
            "tags_url": "https://api.github.com/repos/ankoh/core-drawer-panel/tags",
            "blobs_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/ankoh/core-drawer-panel/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/ankoh/core-drawer-panel/languages",
            "stargazers_url": "https://api.github.com/repos/ankoh/core-drawer-panel/stargazers",
            "contributors_url": "https://api.github.com/repos/ankoh/core-drawer-panel/contributors",
            "subscribers_url": "https://api.github.com/repos/ankoh/core-drawer-panel/subscribers",
            "subscription_url": "https://api.github.com/repos/ankoh/core-drawer-panel/subscription",
            "commits_url": "https://api.github.com/repos/ankoh/core-drawer-panel/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/ankoh/core-drawer-panel/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/ankoh/core-drawer-panel/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/ankoh/core-drawer-panel/contents/{+path}",
            "compare_url": "https://api.github.com/repos/ankoh/core-drawer-panel/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/ankoh/core-drawer-panel/merges",
            "archive_url": "https://api.github.com/repos/ankoh/core-drawer-panel/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/ankoh/core-drawer-panel/downloads",
            "issues_url": "https://api.github.com/repos/ankoh/core-drawer-panel/issues{/number}",
            "pulls_url": "https://api.github.com/repos/ankoh/core-drawer-panel/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/ankoh/core-drawer-panel/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/ankoh/core-drawer-panel/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/ankoh/core-drawer-panel/labels{/name}",
            "releases_url": "https://api.github.com/repos/ankoh/core-drawer-panel/releases{/id}",
            "created_at": "2014-08-01T08:42:54Z",
            "updated_at": "2014-07-21T09:34:18Z",
            "pushed_at": "2014-07-29T17:00:20Z",
            "git_url": "git://github.com/ankoh/core-drawer-panel.git",
            "ssh_url": "git@github.com:ankoh/core-drawer-panel.git",
            "clone_url": "https://github.com/ankoh/core-drawer-panel.git",
            "svn_url": "https://github.com/ankoh/core-drawer-panel",
            "homepage": null,
            "size": 1803,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T08:42:54Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214196919",
        "type": "WatchEvent",
        "actor": {
          "id": 6487764,
          "login": "nikkuang",
          "gravatar_id": "9c308fa47e69fdbbe62dd107d70c719f",
          "url": "https://api.github.com/users/nikkuang",
          "avatar_url": "https://avatars.githubusercontent.com/u/6487764?"
        },
        "repo": {
          "id": 5532320,
          "name": "Polymer/polymer",
          "url": "https://api.github.com/repos/Polymer/polymer"
        },
        "payload": {"action": "started"},
        "public": true,
        "created_at": "2014-08-01T08:11:23Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214187833",
        "type": "ForkEvent",
        "actor": {
          "id": 4539599,
          "login": "jbehuet",
          "gravatar_id": "68f5ce5fc6746fc309847bce166ee303",
          "url": "https://api.github.com/users/jbehuet",
          "avatar_url": "https://avatars.githubusercontent.com/u/4539599?"
        },
        "repo": {
          "id": 14120695,
          "name": "Polymer/designer",
          "url": "https://api.github.com/repos/Polymer/designer"
        },
        "payload": {"forkee": {
            "id": 22500677,
            "name": "designer",
            "full_name": "jbehuet/designer",
            "owner": {
              "login": "jbehuet",
              "id": 4539599,
              "avatar_url": "https://avatars.githubusercontent.com/u/4539599?v=1",
              "gravatar_id": "68f5ce5fc6746fc309847bce166ee303",
              "url": "https://api.github.com/users/jbehuet",
              "html_url": "https://github.com/jbehuet",
              "followers_url": "https://api.github.com/users/jbehuet/followers",
              "following_url": "https://api.github.com/users/jbehuet/following{/other_user}",
              "gists_url": "https://api.github.com/users/jbehuet/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/jbehuet/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/jbehuet/subscriptions",
              "organizations_url": "https://api.github.com/users/jbehuet/orgs",
              "repos_url": "https://api.github.com/users/jbehuet/repos",
              "events_url": "https://api.github.com/users/jbehuet/events{/privacy}",
              "received_events_url": "https://api.github.com/users/jbehuet/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/jbehuet/designer",
            "description": "Polymer Designer Tool",
            "fork": true,
            "url": "https://api.github.com/repos/jbehuet/designer",
            "forks_url": "https://api.github.com/repos/jbehuet/designer/forks",
            "keys_url": "https://api.github.com/repos/jbehuet/designer/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/jbehuet/designer/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/jbehuet/designer/teams",
            "hooks_url": "https://api.github.com/repos/jbehuet/designer/hooks",
            "issue_events_url": "https://api.github.com/repos/jbehuet/designer/issues/events{/number}",
            "events_url": "https://api.github.com/repos/jbehuet/designer/events",
            "assignees_url": "https://api.github.com/repos/jbehuet/designer/assignees{/user}",
            "branches_url": "https://api.github.com/repos/jbehuet/designer/branches{/branch}",
            "tags_url": "https://api.github.com/repos/jbehuet/designer/tags",
            "blobs_url": "https://api.github.com/repos/jbehuet/designer/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/jbehuet/designer/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/jbehuet/designer/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/jbehuet/designer/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/jbehuet/designer/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/jbehuet/designer/languages",
            "stargazers_url": "https://api.github.com/repos/jbehuet/designer/stargazers",
            "contributors_url": "https://api.github.com/repos/jbehuet/designer/contributors",
            "subscribers_url": "https://api.github.com/repos/jbehuet/designer/subscribers",
            "subscription_url": "https://api.github.com/repos/jbehuet/designer/subscription",
            "commits_url": "https://api.github.com/repos/jbehuet/designer/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/jbehuet/designer/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/jbehuet/designer/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/jbehuet/designer/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/jbehuet/designer/contents/{+path}",
            "compare_url": "https://api.github.com/repos/jbehuet/designer/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/jbehuet/designer/merges",
            "archive_url": "https://api.github.com/repos/jbehuet/designer/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/jbehuet/designer/downloads",
            "issues_url": "https://api.github.com/repos/jbehuet/designer/issues{/number}",
            "pulls_url": "https://api.github.com/repos/jbehuet/designer/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/jbehuet/designer/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/jbehuet/designer/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/jbehuet/designer/labels{/name}",
            "releases_url": "https://api.github.com/repos/jbehuet/designer/releases{/id}",
            "created_at": "2014-08-01T08:03:14Z",
            "updated_at": "2014-08-01T06:45:05Z",
            "pushed_at": "2014-07-31T17:59:54Z",
            "git_url": "git://github.com/jbehuet/designer.git",
            "ssh_url": "git@github.com:jbehuet/designer.git",
            "clone_url": "https://github.com/jbehuet/designer.git",
            "svn_url": "https://github.com/jbehuet/designer",
            "homepage": "polymer-project.org/tools/designer/",
            "size": 2158,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T08:03:14Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214174263",
        "type": "PullRequestEvent",
        "actor": {
          "id": 566185,
          "login": "Noxer",
          "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
          "url": "https://api.github.com/users/Noxer",
          "avatar_url": "https://avatars.githubusercontent.com/u/566185?"
        },
        "repo": {
          "id": 17386215,
          "name": "Polymer/core-ajax",
          "url": "https://api.github.com/repos/Polymer/core-ajax"
        },
        "payload": {
          "action": "opened",
          "number": 15,
          "pull_request": {
            "url": "https://api.github.com/repos/Polymer/core-ajax/pulls/15",
            "id": 19197199,
            "html_url": "https://github.com/Polymer/core-ajax/pull/15",
            "diff_url": "https://github.com/Polymer/core-ajax/pull/15.diff",
            "patch_url": "https://github.com/Polymer/core-ajax/pull/15.patch",
            "issue_url": "https://api.github.com/repos/Polymer/core-ajax/issues/15",
            "number": 15,
            "state": "open",
            "title": "Added possibility to send request when Body changes",
            "user": {
              "login": "Noxer",
              "id": 566185,
              "avatar_url": "https://avatars.githubusercontent.com/u/566185?v=1",
              "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
              "url": "https://api.github.com/users/Noxer",
              "html_url": "https://github.com/Noxer",
              "followers_url": "https://api.github.com/users/Noxer/followers",
              "following_url": "https://api.github.com/users/Noxer/following{/other_user}",
              "gists_url": "https://api.github.com/users/Noxer/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/Noxer/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/Noxer/subscriptions",
              "organizations_url": "https://api.github.com/users/Noxer/orgs",
              "repos_url": "https://api.github.com/users/Noxer/repos",
              "events_url": "https://api.github.com/users/Noxer/events{/privacy}",
              "received_events_url": "https://api.github.com/users/Noxer/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "You can now specify the `autoBody` attribute which makes `body` behave like `url` and `params` when it is changed.\r\n\r\nCheers,\r\nTim",
            "created_at": "2014-08-01T07:51:26Z",
            "updated_at": "2014-08-01T07:51:26Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": "127959998c9ce4fcb577ff4896e44f7db16b91d2",
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/Polymer/core-ajax/pulls/15/commits",
            "review_comments_url": "https://api.github.com/repos/Polymer/core-ajax/pulls/15/comments",
            "review_comment_url": "https://api.github.com/repos/Polymer/core-ajax/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/Polymer/core-ajax/issues/15/comments",
            "statuses_url": "https://api.github.com/repos/Polymer/core-ajax/statuses/e4a28c26b2cb7be71a45985987f20383f4caf5d8",
            "head": {
              "label": "Noxer:master",
              "ref": "master",
              "sha": "e4a28c26b2cb7be71a45985987f20383f4caf5d8",
              "user": {
                "login": "Noxer",
                "id": 566185,
                "avatar_url": "https://avatars.githubusercontent.com/u/566185?v=1",
                "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
                "url": "https://api.github.com/users/Noxer",
                "html_url": "https://github.com/Noxer",
                "followers_url": "https://api.github.com/users/Noxer/followers",
                "following_url": "https://api.github.com/users/Noxer/following{/other_user}",
                "gists_url": "https://api.github.com/users/Noxer/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/Noxer/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/Noxer/subscriptions",
                "organizations_url": "https://api.github.com/users/Noxer/orgs",
                "repos_url": "https://api.github.com/users/Noxer/repos",
                "events_url": "https://api.github.com/users/Noxer/events{/privacy}",
                "received_events_url": "https://api.github.com/users/Noxer/received_events",
                "type": "User",
                "site_admin": false
              },
              "repo": {
                "id": 22500046,
                "name": "core-ajax",
                "full_name": "Noxer/core-ajax",
                "owner": {
                  "login": "Noxer",
                  "id": 566185,
                  "avatar_url": "https://avatars.githubusercontent.com/u/566185?v=1",
                  "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
                  "url": "https://api.github.com/users/Noxer",
                  "html_url": "https://github.com/Noxer",
                  "followers_url": "https://api.github.com/users/Noxer/followers",
                  "following_url": "https://api.github.com/users/Noxer/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Noxer/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Noxer/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Noxer/subscriptions",
                  "organizations_url": "https://api.github.com/users/Noxer/orgs",
                  "repos_url": "https://api.github.com/users/Noxer/repos",
                  "events_url": "https://api.github.com/users/Noxer/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Noxer/received_events",
                  "type": "User",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/Noxer/core-ajax",
                "description": "Polymer Core Ajax",
                "fork": true,
                "url": "https://api.github.com/repos/Noxer/core-ajax",
                "forks_url": "https://api.github.com/repos/Noxer/core-ajax/forks",
                "keys_url": "https://api.github.com/repos/Noxer/core-ajax/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/Noxer/core-ajax/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/Noxer/core-ajax/teams",
                "hooks_url": "https://api.github.com/repos/Noxer/core-ajax/hooks",
                "issue_events_url": "https://api.github.com/repos/Noxer/core-ajax/issues/events{/number}",
                "events_url": "https://api.github.com/repos/Noxer/core-ajax/events",
                "assignees_url": "https://api.github.com/repos/Noxer/core-ajax/assignees{/user}",
                "branches_url": "https://api.github.com/repos/Noxer/core-ajax/branches{/branch}",
                "tags_url": "https://api.github.com/repos/Noxer/core-ajax/tags",
                "blobs_url": "https://api.github.com/repos/Noxer/core-ajax/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/Noxer/core-ajax/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/Noxer/core-ajax/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/Noxer/core-ajax/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/Noxer/core-ajax/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/Noxer/core-ajax/languages",
                "stargazers_url": "https://api.github.com/repos/Noxer/core-ajax/stargazers",
                "contributors_url": "https://api.github.com/repos/Noxer/core-ajax/contributors",
                "subscribers_url": "https://api.github.com/repos/Noxer/core-ajax/subscribers",
                "subscription_url": "https://api.github.com/repos/Noxer/core-ajax/subscription",
                "commits_url": "https://api.github.com/repos/Noxer/core-ajax/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/Noxer/core-ajax/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/Noxer/core-ajax/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/Noxer/core-ajax/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/Noxer/core-ajax/contents/{+path}",
                "compare_url": "https://api.github.com/repos/Noxer/core-ajax/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/Noxer/core-ajax/merges",
                "archive_url": "https://api.github.com/repos/Noxer/core-ajax/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/Noxer/core-ajax/downloads",
                "issues_url": "https://api.github.com/repos/Noxer/core-ajax/issues{/number}",
                "pulls_url": "https://api.github.com/repos/Noxer/core-ajax/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/Noxer/core-ajax/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/Noxer/core-ajax/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/Noxer/core-ajax/labels{/name}",
                "releases_url": "https://api.github.com/repos/Noxer/core-ajax/releases{/id}",
                "created_at": "2014-08-01T07:42:03Z",
                "updated_at": "2014-07-31T05:59:23Z",
                "pushed_at": "2014-08-01T07:47:27Z",
                "git_url": "git://github.com/Noxer/core-ajax.git",
                "ssh_url": "git@github.com:Noxer/core-ajax.git",
                "clone_url": "https://github.com/Noxer/core-ajax.git",
                "svn_url": "https://github.com/Noxer/core-ajax",
                "homepage": null,
                "size": 1460,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": null,
                "has_issues": false,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "Polymer:master",
              "ref": "master",
              "sha": "7c827ff02e8f18465452d873633a1ea3537589b5",
              "user": {
                "login": "Polymer",
                "id": 2159051,
                "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                "url": "https://api.github.com/users/Polymer",
                "html_url": "https://github.com/Polymer",
                "followers_url": "https://api.github.com/users/Polymer/followers",
                "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                "organizations_url": "https://api.github.com/users/Polymer/orgs",
                "repos_url": "https://api.github.com/users/Polymer/repos",
                "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                "received_events_url": "https://api.github.com/users/Polymer/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 17386215,
                "name": "core-ajax",
                "full_name": "Polymer/core-ajax",
                "owner": {
                  "login": "Polymer",
                  "id": 2159051,
                  "avatar_url": "https://avatars.githubusercontent.com/u/2159051?v=1",
                  "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
                  "url": "https://api.github.com/users/Polymer",
                  "html_url": "https://github.com/Polymer",
                  "followers_url": "https://api.github.com/users/Polymer/followers",
                  "following_url": "https://api.github.com/users/Polymer/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Polymer/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Polymer/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Polymer/subscriptions",
                  "organizations_url": "https://api.github.com/users/Polymer/orgs",
                  "repos_url": "https://api.github.com/users/Polymer/repos",
                  "events_url": "https://api.github.com/users/Polymer/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Polymer/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/Polymer/core-ajax",
                "description": "Polymer Core Ajax",
                "fork": false,
                "url": "https://api.github.com/repos/Polymer/core-ajax",
                "forks_url": "https://api.github.com/repos/Polymer/core-ajax/forks",
                "keys_url": "https://api.github.com/repos/Polymer/core-ajax/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/Polymer/core-ajax/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/Polymer/core-ajax/teams",
                "hooks_url": "https://api.github.com/repos/Polymer/core-ajax/hooks",
                "issue_events_url": "https://api.github.com/repos/Polymer/core-ajax/issues/events{/number}",
                "events_url": "https://api.github.com/repos/Polymer/core-ajax/events",
                "assignees_url": "https://api.github.com/repos/Polymer/core-ajax/assignees{/user}",
                "branches_url": "https://api.github.com/repos/Polymer/core-ajax/branches{/branch}",
                "tags_url": "https://api.github.com/repos/Polymer/core-ajax/tags",
                "blobs_url": "https://api.github.com/repos/Polymer/core-ajax/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/Polymer/core-ajax/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/Polymer/core-ajax/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/Polymer/core-ajax/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/Polymer/core-ajax/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/Polymer/core-ajax/languages",
                "stargazers_url": "https://api.github.com/repos/Polymer/core-ajax/stargazers",
                "contributors_url": "https://api.github.com/repos/Polymer/core-ajax/contributors",
                "subscribers_url": "https://api.github.com/repos/Polymer/core-ajax/subscribers",
                "subscription_url": "https://api.github.com/repos/Polymer/core-ajax/subscription",
                "commits_url": "https://api.github.com/repos/Polymer/core-ajax/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/Polymer/core-ajax/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/Polymer/core-ajax/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/Polymer/core-ajax/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/Polymer/core-ajax/contents/{+path}",
                "compare_url": "https://api.github.com/repos/Polymer/core-ajax/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/Polymer/core-ajax/merges",
                "archive_url": "https://api.github.com/repos/Polymer/core-ajax/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/Polymer/core-ajax/downloads",
                "issues_url": "https://api.github.com/repos/Polymer/core-ajax/issues{/number}",
                "pulls_url": "https://api.github.com/repos/Polymer/core-ajax/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/Polymer/core-ajax/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/Polymer/core-ajax/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/Polymer/core-ajax/labels{/name}",
                "releases_url": "https://api.github.com/repos/Polymer/core-ajax/releases{/id}",
                "created_at": "2014-03-04T01:17:32Z",
                "updated_at": "2014-07-31T05:59:23Z",
                "pushed_at": "2014-07-22T23:15:29Z",
                "git_url": "git://github.com/Polymer/core-ajax.git",
                "ssh_url": "git@github.com:Polymer/core-ajax.git",
                "clone_url": "https://github.com/Polymer/core-ajax.git",
                "svn_url": "https://github.com/Polymer/core-ajax",
                "homepage": null,
                "size": 1460,
                "stargazers_count": 4,
                "watchers_count": 4,
                "language": null,
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 8,
                "mirror_url": null,
                "open_issues_count": 9,
                "forks": 8,
                "open_issues": 9,
                "watchers": 4,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/Polymer/core-ajax/pulls/15"},
              "html": {"href": "https://github.com/Polymer/core-ajax/pull/15"},
              "issue": {"href": "https://api.github.com/repos/Polymer/core-ajax/issues/15"},
              "comments": {"href": "https://api.github.com/repos/Polymer/core-ajax/issues/15/comments"},
              "review_comments": {"href": "https://api.github.com/repos/Polymer/core-ajax/pulls/15/comments"},
              "review_comment": {"href": "https://api.github.com/repos/Polymer/core-ajax/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/Polymer/core-ajax/pulls/15/commits"},
              "statuses": {"href": "https://api.github.com/repos/Polymer/core-ajax/statuses/e4a28c26b2cb7be71a45985987f20383f4caf5d8"}
            },
            "merged": false,
            "mergeable": true,
            "mergeable_state": "clean",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 16,
            "deletions": 1,
            "changed_files": 1
          }
        },
        "public": true,
        "created_at": "2014-08-01T07:51:28Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214169160",
        "type": "ForkEvent",
        "actor": {
          "id": 7989750,
          "login": "DrFritzi",
          "gravatar_id": "cedd40bed515ee37822cc6df174ec4b8",
          "url": "https://api.github.com/users/DrFritzi",
          "avatar_url": "https://avatars.githubusercontent.com/u/7989750?"
        },
        "repo": {
          "id": 17417350,
          "name": "Polymer/paper-input",
          "url": "https://api.github.com/repos/Polymer/paper-input"
        },
        "payload": {"forkee": {
            "id": 22500208,
            "name": "paper-input",
            "full_name": "DrFritzi/paper-input",
            "owner": {
              "login": "DrFritzi",
              "id": 7989750,
              "avatar_url": "https://avatars.githubusercontent.com/u/7989750?v=1",
              "gravatar_id": "cedd40bed515ee37822cc6df174ec4b8",
              "url": "https://api.github.com/users/DrFritzi",
              "html_url": "https://github.com/DrFritzi",
              "followers_url": "https://api.github.com/users/DrFritzi/followers",
              "following_url": "https://api.github.com/users/DrFritzi/following{/other_user}",
              "gists_url": "https://api.github.com/users/DrFritzi/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/DrFritzi/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/DrFritzi/subscriptions",
              "organizations_url": "https://api.github.com/users/DrFritzi/orgs",
              "repos_url": "https://api.github.com/users/DrFritzi/repos",
              "events_url": "https://api.github.com/users/DrFritzi/events{/privacy}",
              "received_events_url": "https://api.github.com/users/DrFritzi/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/DrFritzi/paper-input",
            "description": "",
            "fork": true,
            "url": "https://api.github.com/repos/DrFritzi/paper-input",
            "forks_url": "https://api.github.com/repos/DrFritzi/paper-input/forks",
            "keys_url": "https://api.github.com/repos/DrFritzi/paper-input/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/DrFritzi/paper-input/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/DrFritzi/paper-input/teams",
            "hooks_url": "https://api.github.com/repos/DrFritzi/paper-input/hooks",
            "issue_events_url": "https://api.github.com/repos/DrFritzi/paper-input/issues/events{/number}",
            "events_url": "https://api.github.com/repos/DrFritzi/paper-input/events",
            "assignees_url": "https://api.github.com/repos/DrFritzi/paper-input/assignees{/user}",
            "branches_url": "https://api.github.com/repos/DrFritzi/paper-input/branches{/branch}",
            "tags_url": "https://api.github.com/repos/DrFritzi/paper-input/tags",
            "blobs_url": "https://api.github.com/repos/DrFritzi/paper-input/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/DrFritzi/paper-input/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/DrFritzi/paper-input/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/DrFritzi/paper-input/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/DrFritzi/paper-input/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/DrFritzi/paper-input/languages",
            "stargazers_url": "https://api.github.com/repos/DrFritzi/paper-input/stargazers",
            "contributors_url": "https://api.github.com/repos/DrFritzi/paper-input/contributors",
            "subscribers_url": "https://api.github.com/repos/DrFritzi/paper-input/subscribers",
            "subscription_url": "https://api.github.com/repos/DrFritzi/paper-input/subscription",
            "commits_url": "https://api.github.com/repos/DrFritzi/paper-input/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/DrFritzi/paper-input/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/DrFritzi/paper-input/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/DrFritzi/paper-input/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/DrFritzi/paper-input/contents/{+path}",
            "compare_url": "https://api.github.com/repos/DrFritzi/paper-input/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/DrFritzi/paper-input/merges",
            "archive_url": "https://api.github.com/repos/DrFritzi/paper-input/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/DrFritzi/paper-input/downloads",
            "issues_url": "https://api.github.com/repos/DrFritzi/paper-input/issues{/number}",
            "pulls_url": "https://api.github.com/repos/DrFritzi/paper-input/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/DrFritzi/paper-input/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/DrFritzi/paper-input/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/DrFritzi/paper-input/labels{/name}",
            "releases_url": "https://api.github.com/repos/DrFritzi/paper-input/releases{/id}",
            "created_at": "2014-08-01T07:46:58Z",
            "updated_at": "2014-07-29T00:37:43Z",
            "pushed_at": "2014-07-30T13:55:54Z",
            "git_url": "git://github.com/DrFritzi/paper-input.git",
            "ssh_url": "git@github.com:DrFritzi/paper-input.git",
            "clone_url": "https://github.com/DrFritzi/paper-input.git",
            "svn_url": "https://github.com/DrFritzi/paper-input",
            "homepage": null,
            "size": 2213,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T07:46:58Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }, {
        "id": "2214163954",
        "type": "ForkEvent",
        "actor": {
          "id": 566185,
          "login": "Noxer",
          "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
          "url": "https://api.github.com/users/Noxer",
          "avatar_url": "https://avatars.githubusercontent.com/u/566185?"
        },
        "repo": {
          "id": 17386215,
          "name": "Polymer/core-ajax",
          "url": "https://api.github.com/repos/Polymer/core-ajax"
        },
        "payload": {"forkee": {
            "id": 22500046,
            "name": "core-ajax",
            "full_name": "Noxer/core-ajax",
            "owner": {
              "login": "Noxer",
              "id": 566185,
              "avatar_url": "https://avatars.githubusercontent.com/u/566185?v=1",
              "gravatar_id": "c52fe326f76036209ffa8e36e8ea03aa",
              "url": "https://api.github.com/users/Noxer",
              "html_url": "https://github.com/Noxer",
              "followers_url": "https://api.github.com/users/Noxer/followers",
              "following_url": "https://api.github.com/users/Noxer/following{/other_user}",
              "gists_url": "https://api.github.com/users/Noxer/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/Noxer/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/Noxer/subscriptions",
              "organizations_url": "https://api.github.com/users/Noxer/orgs",
              "repos_url": "https://api.github.com/users/Noxer/repos",
              "events_url": "https://api.github.com/users/Noxer/events{/privacy}",
              "received_events_url": "https://api.github.com/users/Noxer/received_events",
              "type": "User",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/Noxer/core-ajax",
            "description": "Polymer Core Ajax",
            "fork": true,
            "url": "https://api.github.com/repos/Noxer/core-ajax",
            "forks_url": "https://api.github.com/repos/Noxer/core-ajax/forks",
            "keys_url": "https://api.github.com/repos/Noxer/core-ajax/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/Noxer/core-ajax/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/Noxer/core-ajax/teams",
            "hooks_url": "https://api.github.com/repos/Noxer/core-ajax/hooks",
            "issue_events_url": "https://api.github.com/repos/Noxer/core-ajax/issues/events{/number}",
            "events_url": "https://api.github.com/repos/Noxer/core-ajax/events",
            "assignees_url": "https://api.github.com/repos/Noxer/core-ajax/assignees{/user}",
            "branches_url": "https://api.github.com/repos/Noxer/core-ajax/branches{/branch}",
            "tags_url": "https://api.github.com/repos/Noxer/core-ajax/tags",
            "blobs_url": "https://api.github.com/repos/Noxer/core-ajax/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/Noxer/core-ajax/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/Noxer/core-ajax/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/Noxer/core-ajax/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/Noxer/core-ajax/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/Noxer/core-ajax/languages",
            "stargazers_url": "https://api.github.com/repos/Noxer/core-ajax/stargazers",
            "contributors_url": "https://api.github.com/repos/Noxer/core-ajax/contributors",
            "subscribers_url": "https://api.github.com/repos/Noxer/core-ajax/subscribers",
            "subscription_url": "https://api.github.com/repos/Noxer/core-ajax/subscription",
            "commits_url": "https://api.github.com/repos/Noxer/core-ajax/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/Noxer/core-ajax/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/Noxer/core-ajax/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/Noxer/core-ajax/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/Noxer/core-ajax/contents/{+path}",
            "compare_url": "https://api.github.com/repos/Noxer/core-ajax/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/Noxer/core-ajax/merges",
            "archive_url": "https://api.github.com/repos/Noxer/core-ajax/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/Noxer/core-ajax/downloads",
            "issues_url": "https://api.github.com/repos/Noxer/core-ajax/issues{/number}",
            "pulls_url": "https://api.github.com/repos/Noxer/core-ajax/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/Noxer/core-ajax/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/Noxer/core-ajax/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/Noxer/core-ajax/labels{/name}",
            "releases_url": "https://api.github.com/repos/Noxer/core-ajax/releases{/id}",
            "created_at": "2014-08-01T07:42:03Z",
            "updated_at": "2014-07-31T05:59:23Z",
            "pushed_at": "2014-07-22T23:15:29Z",
            "git_url": "git://github.com/Noxer/core-ajax.git",
            "ssh_url": "git@github.com:Noxer/core-ajax.git",
            "clone_url": "https://github.com/Noxer/core-ajax.git",
            "svn_url": "https://github.com/Noxer/core-ajax",
            "homepage": null,
            "size": 1460,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": false,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "public": true
          }},
        "public": true,
        "created_at": "2014-08-01T07:42:04Z",
        "org": {
          "id": 2159051,
          "login": "Polymer",
          "gravatar_id": "a08da340b07b06a9cc2c107a98c8623f",
          "url": "https://api.github.com/orgs/Polymer",
          "avatar_url": "https://avatars.githubusercontent.com/u/2159051?"
        }
      }]);
    }
  };
});
System.register("models/github/EventMapperMOCKDATA2", [], function($__export) {
  "use strict";
  var __moduleName = "models/github/EventMapperMOCKDATA2";
  return {
    setters: [],
    execute: function() {
      $__export('default', [{
        "id": "2249773972",
        "type": "DeleteEvent",
        "actor": {
          "id": 569564,
          "login": "cstump",
          "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
          "url": "https://api.github.com/users/cstump",
          "avatar_url": "https://avatars.githubusercontent.com/u/569564?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "trunk",
          "ref_type": "branch",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T19:50:53Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249472340",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128",
            "id": 40852167,
            "number": 128,
            "title": "Sizmek advertisers 139",
            "user": {
              "login": "mswieboda",
              "id": 2223822,
              "avatar_url": "https://avatars.githubusercontent.com/u/2223822?v=2",
              "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
              "url": "https://api.github.com/users/mswieboda",
              "html_url": "https://github.com/mswieboda",
              "followers_url": "https://api.github.com/users/mswieboda/followers",
              "following_url": "https://api.github.com/users/mswieboda/following{/other_user}",
              "gists_url": "https://api.github.com/users/mswieboda/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mswieboda/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mswieboda/subscriptions",
              "organizations_url": "https://api.github.com/users/mswieboda/orgs",
              "repos_url": "https://api.github.com/users/mswieboda/repos",
              "events_url": "https://api.github.com/users/mswieboda/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mswieboda/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 3,
            "created_at": "2014-08-21T21:27:22Z",
            "updated_at": "2014-08-22T17:05:16Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128",
              "html_url": "https://github.com/centro/centro-media-manager/pull/128",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/128.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/128.patch"
            },
            "body": "[Create and Manage Advertisers in Sizmek](https://centro.mingle.thoughtworks.com/projects/cmp___integration_efforts/cards/139)\r\nSizmek Create/Delete/Update/Get Advertisers\r\n\r\nNote: also renamed a few classes match Sizmek API better\r\n`FindCampaign` => `GetCampaigns` and `CampaignFilter => CampaignsFilter`"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53090095",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128#issuecomment-53090095",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "id": 53090095,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T17:05:16Z",
            "updated_at": "2014-08-22T17:05:16Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/152/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T17:05:16Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249465373",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/132",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/132",
            "id": 40927303,
            "number": 132,
            "title": "Fix ie tc file error",
            "user": {
              "login": "peterwmwong",
              "id": 284734,
              "avatar_url": "https://avatars.githubusercontent.com/u/284734?v=2",
              "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
              "url": "https://api.github.com/users/peterwmwong",
              "html_url": "https://github.com/peterwmwong",
              "followers_url": "https://api.github.com/users/peterwmwong/followers",
              "following_url": "https://api.github.com/users/peterwmwong/following{/other_user}",
              "gists_url": "https://api.github.com/users/peterwmwong/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/peterwmwong/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/peterwmwong/subscriptions",
              "organizations_url": "https://api.github.com/users/peterwmwong/orgs",
              "repos_url": "https://api.github.com/users/peterwmwong/repos",
              "events_url": "https://api.github.com/users/peterwmwong/events{/privacy}",
              "received_events_url": "https://api.github.com/users/peterwmwong/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-08-22T16:50:48Z",
            "updated_at": "2014-08-22T17:01:18Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/132",
              "html_url": "https://github.com/centro/centro-media-manager/pull/132",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/132.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/132.patch"
            },
            "body": "DEPENDS ON: PR #129 \r\n\r\n### Before\r\n\r\n![screen shot 2014-08-22 at 11 50 13 am](https://cloud.githubusercontent.com/assets/284734/4014010/6e38fa3c-2a1c-11e4-9649-7326be0dfb06.png)\r\n\r\n### After\r\n\r\n![screen shot 2014-08-22 at 11 47 06 am](https://cloud.githubusercontent.com/assets/284734/4014003/4a31acec-2a1c-11e4-950f-3b36046e4705.png)\r\n"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53089626",
            "html_url": "https://github.com/centro/centro-media-manager/pull/132#issuecomment-53089626",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132",
            "id": 53089626,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T17:01:17Z",
            "updated_at": "2014-08-22T17:01:17Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/151/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T17:01:18Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249453010",
        "type": "PushEvent",
        "actor": {
          "id": 2223822,
          "login": "mswieboda",
          "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
          "url": "https://api.github.com/users/mswieboda",
          "avatar_url": "https://avatars.githubusercontent.com/u/2223822?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 435037054,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/sizmek-advertisers-139",
          "head": "beb958f7c6c1edd46d3171242c12a48dd342dbb2",
          "before": "78b585edb8bcb35dafc671b5965f60cf6eff9ccc",
          "commits": [{
            "sha": "beb958f7c6c1edd46d3171242c12a48dd342dbb2",
            "author": {
              "email": "matt.swieboda@centro.net",
              "name": "Matt Swieboda"
            },
            "message": "advertiser builder spec forgot get_advertisers.xml, renamed get_campaigns.xml",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/beb958f7c6c1edd46d3171242c12a48dd342dbb2"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T16:54:26Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249446796",
        "type": "PullRequestEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 132,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/132",
            "id": 20183337,
            "html_url": "https://github.com/centro/centro-media-manager/pull/132",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/132.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/132.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132",
            "number": 132,
            "state": "open",
            "locked": false,
            "title": "Fix ie tc file error",
            "user": {
              "login": "peterwmwong",
              "id": 284734,
              "avatar_url": "https://avatars.githubusercontent.com/u/284734?v=2",
              "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
              "url": "https://api.github.com/users/peterwmwong",
              "html_url": "https://github.com/peterwmwong",
              "followers_url": "https://api.github.com/users/peterwmwong/followers",
              "following_url": "https://api.github.com/users/peterwmwong/following{/other_user}",
              "gists_url": "https://api.github.com/users/peterwmwong/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/peterwmwong/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/peterwmwong/subscriptions",
              "organizations_url": "https://api.github.com/users/peterwmwong/orgs",
              "repos_url": "https://api.github.com/users/peterwmwong/repos",
              "events_url": "https://api.github.com/users/peterwmwong/events{/privacy}",
              "received_events_url": "https://api.github.com/users/peterwmwong/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "DEPENDS ON: PR #129 \r\n\r\n### Before\r\n\r\n![screen shot 2014-08-22 at 11 50 13 am](https://cloud.githubusercontent.com/assets/284734/4014010/6e38fa3c-2a1c-11e4-9649-7326be0dfb06.png)\r\n\r\n### After\r\n\r\n![screen shot 2014-08-22 at 11 47 06 am](https://cloud.githubusercontent.com/assets/284734/4014003/4a31acec-2a1c-11e4-950f-3b36046e4705.png)\r\n",
            "created_at": "2014-08-22T16:50:48Z",
            "updated_at": "2014-08-22T16:50:48Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/132/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/132/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/132/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/e20fe7555365dc329baa56e8a4ba7c5143366a12",
            "head": {
              "label": "centro:fix-ie-tc-file-error",
              "ref": "fix-ie-tc-file-error",
              "sha": "e20fe7555365dc329baa56e8a4ba7c5143366a12",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T16:44:46Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 4,
                "forks": 0,
                "open_issues": 4,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "f72f149f6401e7a65b6ffc763ecf6405f0e77246",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T16:44:46Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 4,
                "forks": 0,
                "open_issues": 4,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/132"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/132"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/132"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/132/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/132/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/132/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/e20fe7555365dc329baa56e8a4ba7c5143366a12"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 3,
            "additions": 48,
            "deletions": 16,
            "changed_files": 7
          }
        },
        "public": false,
        "created_at": "2014-08-22T16:50:49Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249436185",
        "type": "CreateEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "fix-ie-tc-file-error",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T16:44:47Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249428233",
        "type": "PushEvent",
        "actor": {
          "id": 271342,
          "login": "mikenichols",
          "gravatar_id": "9a8e6e470fcf3e3112e1fac53737e421",
          "url": "https://api.github.com/users/mikenichols",
          "avatar_url": "https://avatars.githubusercontent.com/u/271342?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 435026494,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/master",
          "head": "f72f149f6401e7a65b6ffc763ecf6405f0e77246",
          "before": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
          "commits": [{
            "sha": "f72f149f6401e7a65b6ffc763ecf6405f0e77246",
            "author": {
              "email": "mike.nichols@cento.net",
              "name": "Mike Nichols"
            },
            "message": "Making repo_manager setup tasks idempotent.",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/f72f149f6401e7a65b6ffc763ecf6405f0e77246"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T16:40:24Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249417591",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128",
            "id": 40852167,
            "number": 128,
            "title": "Sizmek advertisers 139",
            "user": {
              "login": "mswieboda",
              "id": 2223822,
              "avatar_url": "https://avatars.githubusercontent.com/u/2223822?v=2",
              "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
              "url": "https://api.github.com/users/mswieboda",
              "html_url": "https://github.com/mswieboda",
              "followers_url": "https://api.github.com/users/mswieboda/followers",
              "following_url": "https://api.github.com/users/mswieboda/following{/other_user}",
              "gists_url": "https://api.github.com/users/mswieboda/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mswieboda/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mswieboda/subscriptions",
              "organizations_url": "https://api.github.com/users/mswieboda/orgs",
              "repos_url": "https://api.github.com/users/mswieboda/repos",
              "events_url": "https://api.github.com/users/mswieboda/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mswieboda/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 2,
            "created_at": "2014-08-21T21:27:22Z",
            "updated_at": "2014-08-22T16:34:54Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128",
              "html_url": "https://github.com/centro/centro-media-manager/pull/128",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/128.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/128.patch"
            },
            "body": "[Create and Manage Advertisers in Sizmek](https://centro.mingle.thoughtworks.com/projects/cmp___integration_efforts/cards/139)\r\nSizmek Create/Delete/Update/Get Advertisers\r\n\r\nNote: also renamed a few classes match Sizmek API better\r\n`FindCampaign` => `GetCampaigns` and `CampaignFilter => CampaignsFilter`"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53086017",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128#issuecomment-53086017",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "id": 53086017,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T16:34:54Z",
            "updated_at": "2014-08-22T16:34:54Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/150/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T16:34:55Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249406137",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/129",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/129",
            "id": 40856013,
            "number": 129,
            "title": "Fix: IE9 Fix file uploads (T&C and Import/Export)",
            "user": {
              "login": "peterwmwong",
              "id": 284734,
              "avatar_url": "https://avatars.githubusercontent.com/u/284734?v=2",
              "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
              "url": "https://api.github.com/users/peterwmwong",
              "html_url": "https://github.com/peterwmwong",
              "followers_url": "https://api.github.com/users/peterwmwong/followers",
              "following_url": "https://api.github.com/users/peterwmwong/following{/other_user}",
              "gists_url": "https://api.github.com/users/peterwmwong/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/peterwmwong/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/peterwmwong/subscriptions",
              "organizations_url": "https://api.github.com/users/peterwmwong/orgs",
              "repos_url": "https://api.github.com/users/peterwmwong/repos",
              "events_url": "https://api.github.com/users/peterwmwong/events{/privacy}",
              "received_events_url": "https://api.github.com/users/peterwmwong/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 2,
            "created_at": "2014-08-21T22:10:58Z",
            "updated_at": "2014-08-22T16:29:02Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/129",
              "html_url": "https://github.com/centro/centro-media-manager/pull/129",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/129.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/129.patch"
            },
            "body": "[Mingle #204](https://centro.mingle.thoughtworks.com/projects/cmp___global_vendor_directory/cards/204)\r\n\r\n- ~~Handling server errors after submit (T&C duplicate name) is broken~~ Separate defect for this: https://centro.mingle.thoughtworks.com/projects/cmp___global_vendor_directory/cards/209"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53084894",
            "html_url": "https://github.com/centro/centro-media-manager/pull/129#issuecomment-53084894",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129",
            "id": 53084894,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T16:29:02Z",
            "updated_at": "2014-08-22T16:29:02Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/149/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T16:29:02Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249396235",
        "type": "PushEvent",
        "actor": {
          "id": 2223822,
          "login": "mswieboda",
          "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
          "url": "https://api.github.com/users/mswieboda",
          "avatar_url": "https://avatars.githubusercontent.com/u/2223822?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 435013940,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/sizmek-advertisers-139",
          "head": "78b585edb8bcb35dafc671b5965f60cf6eff9ccc",
          "before": "885d91008c22c6335086d38ca2a6891a28dd6fa9",
          "commits": [{
            "sha": "78b585edb8bcb35dafc671b5965f60cf6eff9ccc",
            "author": {
              "email": "matt.swieboda@centro.net",
              "name": "Matt Swieboda"
            },
            "message": "clean up advertiser XmlBuilders",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/78b585edb8bcb35dafc671b5965f60cf6eff9ccc"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T16:23:52Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249386129",
        "type": "PushEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 435009960,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/fix-ie-file-upload",
          "head": "7726f62b85d990a8329c0df23b9928c6054c420a",
          "before": "24fa6c95c5e307229e374a371de36dcb49e101d1",
          "commits": [{
            "sha": "7726f62b85d990a8329c0df23b9928c6054c420a",
            "author": {
              "email": "peter.wm.wong@gmail.com",
              "name": "peterwmwong"
            },
            "message": "UI: Cleanup styles",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/7726f62b85d990a8329c0df23b9928c6054c420a"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T16:18:33Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249334389",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/131",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/131",
            "id": 40920613,
            "number": 131,
            "title": "Add spec:integration task for VCR-disabled testing to other gems",
            "user": {
              "login": "tmertens",
              "id": 2243386,
              "avatar_url": "https://avatars.githubusercontent.com/u/2243386?v=2",
              "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
              "url": "https://api.github.com/users/tmertens",
              "html_url": "https://github.com/tmertens",
              "followers_url": "https://api.github.com/users/tmertens/followers",
              "following_url": "https://api.github.com/users/tmertens/following{/other_user}",
              "gists_url": "https://api.github.com/users/tmertens/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/tmertens/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/tmertens/subscriptions",
              "organizations_url": "https://api.github.com/users/tmertens/orgs",
              "repos_url": "https://api.github.com/users/tmertens/repos",
              "events_url": "https://api.github.com/users/tmertens/events{/privacy}",
              "received_events_url": "https://api.github.com/users/tmertens/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-08-22T15:42:18Z",
            "updated_at": "2014-08-22T15:52:49Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131",
              "html_url": "https://github.com/centro/centro-media-manager/pull/131",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/131.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/131.patch"
            },
            "body": "@cwitthaus @brownierin This one is for you.  It adds a spec:integration task to the integration gems which disables VCR and executes the specs against the real server(s).  Previously it was only added to the adwords_integration gem, this adds it to the rest."
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53078337",
            "html_url": "https://github.com/centro/centro-media-manager/pull/131#issuecomment-53078337",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131",
            "id": 53078337,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T15:52:49Z",
            "updated_at": "2014-08-22T15:52:49Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/148/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:52:49Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249313151",
        "type": "PullRequestEvent",
        "actor": {
          "id": 2243386,
          "login": "tmertens",
          "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
          "url": "https://api.github.com/users/tmertens",
          "avatar_url": "https://avatars.githubusercontent.com/u/2243386?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 131,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131",
            "id": 20179425,
            "html_url": "https://github.com/centro/centro-media-manager/pull/131",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/131.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/131.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131",
            "number": 131,
            "state": "open",
            "locked": false,
            "title": "Add spec:integration task for VCR-disabled testing to other gems",
            "user": {
              "login": "tmertens",
              "id": 2243386,
              "avatar_url": "https://avatars.githubusercontent.com/u/2243386?v=2",
              "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
              "url": "https://api.github.com/users/tmertens",
              "html_url": "https://github.com/tmertens",
              "followers_url": "https://api.github.com/users/tmertens/followers",
              "following_url": "https://api.github.com/users/tmertens/following{/other_user}",
              "gists_url": "https://api.github.com/users/tmertens/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/tmertens/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/tmertens/subscriptions",
              "organizations_url": "https://api.github.com/users/tmertens/orgs",
              "repos_url": "https://api.github.com/users/tmertens/repos",
              "events_url": "https://api.github.com/users/tmertens/events{/privacy}",
              "received_events_url": "https://api.github.com/users/tmertens/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "@cwitthaus @brownierin This one is for you.  It adds a spec:integration task to the integration gems which disables VCR and executes the specs against the real server(s).  Previously it was only added to the adwords_integration gem, this adds it to the rest.",
            "created_at": "2014-08-22T15:42:18Z",
            "updated_at": "2014-08-22T15:42:18Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/131/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/68e2e6dd0c2534f9841719a4d5836aa20587386a",
            "head": {
              "label": "centro:gem-vcr-tasks",
              "ref": "gem-vcr-tasks",
              "sha": "68e2e6dd0c2534f9841719a4d5836aa20587386a",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:41:00Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:41:00Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/131"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/131"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/131/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/131/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/68e2e6dd0c2534f9841719a4d5836aa20587386a"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 88,
            "deletions": 24,
            "changed_files": 10
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:42:18Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249310465",
        "type": "CreateEvent",
        "actor": {
          "id": 2243386,
          "login": "tmertens",
          "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
          "url": "https://api.github.com/users/tmertens",
          "avatar_url": "https://avatars.githubusercontent.com/u/2243386?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "gem-vcr-tasks",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T15:41:00Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249287616",
        "type": "PushEvent",
        "actor": {
          "id": 4668,
          "login": "burrows",
          "gravatar_id": "2f10dbbf43d858001133a9cc11424067",
          "url": "https://api.github.com/users/burrows",
          "avatar_url": "https://avatars.githubusercontent.com/u/4668?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 434969006,
          "size": 7,
          "distinct_size": 1,
          "ref": "refs/heads/master",
          "head": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
          "before": "7bf36ca5c884f280a0b1f0e2a034ca3238277077",
          "commits": [{
            "sha": "61be41c7c7208e184de5ed5f3c904ea4f47c7f55",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate dummy gem / app",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/61be41c7c7208e184de5ed5f3c904ea4f47c7f55"
          }, {
            "sha": "1d4ee7faaf1daef267f2c4a76d81bdc8107febfb",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "update components and specs to use new dummy location",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/1d4ee7faaf1daef267f2c4a76d81bdc8107febfb"
          }, {
            "sha": "04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate template to components dir",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce"
          }, {
            "sha": "b757f9e7364c595498f9c97b18eac527a2e857b6",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "Revert \"relocate template to components dir\"\n\nThis reverts commit 04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce.",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/b757f9e7364c595498f9c97b18eac527a2e857b6"
          }, {
            "sha": "f357aad6de9de7010137d1881b12b94b10b0a253",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate template to components dir",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/f357aad6de9de7010137d1881b12b94b10b0a253"
          }, {
            "sha": "53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "Merge branch 'master' into relocate_dummy_and_template",
            "distinct": false,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37"
          }, {
            "sha": "18ca27f1c20989b3c52dc574fdb781974c96bcfc",
            "author": {
              "email": "corey.burrows@gmail.com",
              "name": "Corey Burrows"
            },
            "message": "Merge pull request #130 from centro/relocate_dummy_and_template\n\nRelocate dummy and template",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/18ca27f1c20989b3c52dc574fdb781974c96bcfc"
          }]
        },
        "public": false,
        "created_at": "2014-08-22T15:29:42Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249287577",
        "type": "PullRequestEvent",
        "actor": {
          "id": 4668,
          "login": "burrows",
          "gravatar_id": "2f10dbbf43d858001133a9cc11424067",
          "url": "https://api.github.com/users/burrows",
          "avatar_url": "https://avatars.githubusercontent.com/u/4668?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "closed",
          "number": 130,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130",
            "id": 20177402,
            "html_url": "https://github.com/centro/centro-media-manager/pull/130",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/130.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/130.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "number": 130,
            "state": "closed",
            "locked": false,
            "title": "Relocate dummy and template",
            "user": {
              "login": "cstump",
              "id": 569564,
              "avatar_url": "https://avatars.githubusercontent.com/u/569564?v=2",
              "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
              "url": "https://api.github.com/users/cstump",
              "html_url": "https://github.com/cstump",
              "followers_url": "https://api.github.com/users/cstump/followers",
              "following_url": "https://api.github.com/users/cstump/following{/other_user}",
              "gists_url": "https://api.github.com/users/cstump/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/cstump/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/cstump/subscriptions",
              "organizations_url": "https://api.github.com/users/cstump/orgs",
              "repos_url": "https://api.github.com/users/cstump/repos",
              "events_url": "https://api.github.com/users/cstump/events{/privacy}",
              "received_events_url": "https://api.github.com/users/cstump/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "This moves the dummy app needed for testing under spec/ and puts the component template under components/ . The latter was renamed to a dotdir so it is out of the way and so scripts like test-all.sh don't have to worry about it. ",
            "created_at": "2014-08-22T15:11:10Z",
            "updated_at": "2014-08-22T15:29:41Z",
            "closed_at": "2014-08-22T15:29:41Z",
            "merged_at": "2014-08-22T15:29:41Z",
            "merge_commit_sha": "18bcd1d1c3e6c79471e9f5f143fdc435d99995a5",
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37",
            "head": {
              "label": "centro:relocate_dummy_and_template",
              "ref": "relocate_dummy_and_template",
              "sha": "53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:29:41Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 2,
                "forks": 0,
                "open_issues": 2,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "7bf36ca5c884f280a0b1f0e2a034ca3238277077",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:29:41Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 2,
                "forks": 0,
                "open_issues": 2,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/130"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/130"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37"}
            },
            "merged": true,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": {
              "login": "burrows",
              "id": 4668,
              "avatar_url": "https://avatars.githubusercontent.com/u/4668?v=2",
              "gravatar_id": "2f10dbbf43d858001133a9cc11424067",
              "url": "https://api.github.com/users/burrows",
              "html_url": "https://github.com/burrows",
              "followers_url": "https://api.github.com/users/burrows/followers",
              "following_url": "https://api.github.com/users/burrows/following{/other_user}",
              "gists_url": "https://api.github.com/users/burrows/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/burrows/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/burrows/subscriptions",
              "organizations_url": "https://api.github.com/users/burrows/orgs",
              "repos_url": "https://api.github.com/users/burrows/repos",
              "events_url": "https://api.github.com/users/burrows/events{/privacy}",
              "received_events_url": "https://api.github.com/users/burrows/received_events",
              "type": "User",
              "site_admin": false
            },
            "comments": 2,
            "review_comments": 0,
            "commits": 6,
            "additions": 18,
            "deletions": 18,
            "changed_files": 57
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:29:41Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249287449",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 4668,
          "login": "burrows",
          "gravatar_id": "2f10dbbf43d858001133a9cc11424067",
          "url": "https://api.github.com/users/burrows",
          "avatar_url": "https://avatars.githubusercontent.com/u/4668?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/130",
            "id": 40917575,
            "number": 130,
            "title": "Relocate dummy and template",
            "user": {
              "login": "cstump",
              "id": 569564,
              "avatar_url": "https://avatars.githubusercontent.com/u/569564?v=2",
              "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
              "url": "https://api.github.com/users/cstump",
              "html_url": "https://github.com/cstump",
              "followers_url": "https://api.github.com/users/cstump/followers",
              "following_url": "https://api.github.com/users/cstump/following{/other_user}",
              "gists_url": "https://api.github.com/users/cstump/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/cstump/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/cstump/subscriptions",
              "organizations_url": "https://api.github.com/users/cstump/orgs",
              "repos_url": "https://api.github.com/users/cstump/repos",
              "events_url": "https://api.github.com/users/cstump/events{/privacy}",
              "received_events_url": "https://api.github.com/users/cstump/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 2,
            "created_at": "2014-08-22T15:11:10Z",
            "updated_at": "2014-08-22T15:29:37Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130",
              "html_url": "https://github.com/centro/centro-media-manager/pull/130",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/130.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/130.patch"
            },
            "body": "This moves the dummy app needed for testing under spec/ and puts the component template under components/ . The latter was renamed to a dotdir so it is out of the way and so scripts like test-all.sh don't have to worry about it. "
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53075137",
            "html_url": "https://github.com/centro/centro-media-manager/pull/130#issuecomment-53075137",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "id": 53075137,
            "user": {
              "login": "burrows",
              "id": 4668,
              "avatar_url": "https://avatars.githubusercontent.com/u/4668?v=2",
              "gravatar_id": "2f10dbbf43d858001133a9cc11424067",
              "url": "https://api.github.com/users/burrows",
              "html_url": "https://github.com/burrows",
              "followers_url": "https://api.github.com/users/burrows/followers",
              "following_url": "https://api.github.com/users/burrows/following{/other_user}",
              "gists_url": "https://api.github.com/users/burrows/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/burrows/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/burrows/subscriptions",
              "organizations_url": "https://api.github.com/users/burrows/orgs",
              "repos_url": "https://api.github.com/users/burrows/repos",
              "events_url": "https://api.github.com/users/burrows/events{/privacy}",
              "received_events_url": "https://api.github.com/users/burrows/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T15:29:37Z",
            "updated_at": "2014-08-22T15:29:37Z",
            "body": "LGTM."
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:29:37Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249271146",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/130",
            "id": 40917575,
            "number": 130,
            "title": "Relocate dummy and template",
            "user": {
              "login": "cstump",
              "id": 569564,
              "avatar_url": "https://avatars.githubusercontent.com/u/569564?v=2",
              "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
              "url": "https://api.github.com/users/cstump",
              "html_url": "https://github.com/cstump",
              "followers_url": "https://api.github.com/users/cstump/followers",
              "following_url": "https://api.github.com/users/cstump/following{/other_user}",
              "gists_url": "https://api.github.com/users/cstump/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/cstump/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/cstump/subscriptions",
              "organizations_url": "https://api.github.com/users/cstump/orgs",
              "repos_url": "https://api.github.com/users/cstump/repos",
              "events_url": "https://api.github.com/users/cstump/events{/privacy}",
              "received_events_url": "https://api.github.com/users/cstump/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-08-22T15:11:10Z",
            "updated_at": "2014-08-22T15:21:50Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130",
              "html_url": "https://github.com/centro/centro-media-manager/pull/130",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/130.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/130.patch"
            },
            "body": "This moves the dummy app needed for testing under spec/ and puts the component template under components/ . The latter was renamed to a dotdir so it is out of the way and so scripts like test-all.sh don't have to worry about it. "
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/53074028",
            "html_url": "https://github.com/centro/centro-media-manager/pull/130#issuecomment-53074028",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "id": 53074028,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-22T15:21:50Z",
            "updated_at": "2014-08-22T15:21:50Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/147/"
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:21:51Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249248766",
        "type": "PullRequestEvent",
        "actor": {
          "id": 569564,
          "login": "cstump",
          "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
          "url": "https://api.github.com/users/cstump",
          "avatar_url": "https://avatars.githubusercontent.com/u/569564?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 130,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130",
            "id": 20177402,
            "html_url": "https://github.com/centro/centro-media-manager/pull/130",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/130.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/130.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130",
            "number": 130,
            "state": "open",
            "locked": false,
            "title": "Relocate dummy and template",
            "user": {
              "login": "cstump",
              "id": 569564,
              "avatar_url": "https://avatars.githubusercontent.com/u/569564?v=2",
              "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
              "url": "https://api.github.com/users/cstump",
              "html_url": "https://github.com/cstump",
              "followers_url": "https://api.github.com/users/cstump/followers",
              "following_url": "https://api.github.com/users/cstump/following{/other_user}",
              "gists_url": "https://api.github.com/users/cstump/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/cstump/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/cstump/subscriptions",
              "organizations_url": "https://api.github.com/users/cstump/orgs",
              "repos_url": "https://api.github.com/users/cstump/repos",
              "events_url": "https://api.github.com/users/cstump/events{/privacy}",
              "received_events_url": "https://api.github.com/users/cstump/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "This moves the dummy app needed for testing under spec/ and puts the component template under components/ . The latter was renamed to a dotdir so it is out of the way and so scripts like test-all.sh don't have to worry about it. ",
            "created_at": "2014-08-22T15:11:10Z",
            "updated_at": "2014-08-22T15:11:10Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37",
            "head": {
              "label": "centro:relocate_dummy_and_template",
              "ref": "relocate_dummy_and_template",
              "sha": "53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:05:31Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "7bf36ca5c884f280a0b1f0e2a034ca3238277077",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-22T15:05:31Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 3,
                "forks": 0,
                "open_issues": 3,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/130"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/130"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/130/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/130/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/53e42ae7a3abca3a58d7fb13c7ee22234e5d1d37"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 6,
            "additions": 18,
            "deletions": 18,
            "changed_files": 57
          }
        },
        "public": false,
        "created_at": "2014-08-22T15:11:10Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2249237126",
        "type": "CreateEvent",
        "actor": {
          "id": 569564,
          "login": "cstump",
          "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
          "url": "https://api.github.com/users/cstump",
          "avatar_url": "https://avatars.githubusercontent.com/u/569564?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "relocate_dummy_and_template",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-22T15:05:31Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2248003350",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/129",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/129",
            "id": 40856013,
            "number": 129,
            "title": "Fix: IE9/10 Fix file uploads (T&C and Import/Export)",
            "user": {
              "login": "peterwmwong",
              "id": 284734,
              "avatar_url": "https://avatars.githubusercontent.com/u/284734?v=2",
              "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
              "url": "https://api.github.com/users/peterwmwong",
              "html_url": "https://github.com/peterwmwong",
              "followers_url": "https://api.github.com/users/peterwmwong/followers",
              "following_url": "https://api.github.com/users/peterwmwong/following{/other_user}",
              "gists_url": "https://api.github.com/users/peterwmwong/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/peterwmwong/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/peterwmwong/subscriptions",
              "organizations_url": "https://api.github.com/users/peterwmwong/orgs",
              "repos_url": "https://api.github.com/users/peterwmwong/repos",
              "events_url": "https://api.github.com/users/peterwmwong/events{/privacy}",
              "received_events_url": "https://api.github.com/users/peterwmwong/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-08-21T22:10:58Z",
            "updated_at": "2014-08-21T22:21:13Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/129",
              "html_url": "https://github.com/centro/centro-media-manager/pull/129",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/129.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/129.patch"
            },
            "body": "[Mingle #204](https://centro.mingle.thoughtworks.com/projects/cmp___global_vendor_directory/cards/204)\r\n\r\n- [ ] Handling server errors after submit (T&C duplicate name) is broken"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/52993166",
            "html_url": "https://github.com/centro/centro-media-manager/pull/129#issuecomment-52993166",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129",
            "id": 52993166,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-21T22:21:13Z",
            "updated_at": "2014-08-21T22:21:13Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/146/"
          }
        },
        "public": false,
        "created_at": "2014-08-21T22:21:14Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247987055",
        "type": "PullRequestEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 129,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/129",
            "id": 20141618,
            "html_url": "https://github.com/centro/centro-media-manager/pull/129",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/129.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/129.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129",
            "number": 129,
            "state": "open",
            "locked": false,
            "title": "Fix: IE9/10 Fix file uploads (T&C and Import/Export)",
            "user": {
              "login": "peterwmwong",
              "id": 284734,
              "avatar_url": "https://avatars.githubusercontent.com/u/284734?v=2",
              "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
              "url": "https://api.github.com/users/peterwmwong",
              "html_url": "https://github.com/peterwmwong",
              "followers_url": "https://api.github.com/users/peterwmwong/followers",
              "following_url": "https://api.github.com/users/peterwmwong/following{/other_user}",
              "gists_url": "https://api.github.com/users/peterwmwong/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/peterwmwong/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/peterwmwong/subscriptions",
              "organizations_url": "https://api.github.com/users/peterwmwong/orgs",
              "repos_url": "https://api.github.com/users/peterwmwong/repos",
              "events_url": "https://api.github.com/users/peterwmwong/events{/privacy}",
              "received_events_url": "https://api.github.com/users/peterwmwong/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "[Mingle #204](https://centro.mingle.thoughtworks.com/projects/cmp___global_vendor_directory/cards/204)\r\n\r\n- [ ] Handling server errors after submit (T&C duplicate name) is broken",
            "created_at": "2014-08-21T22:10:58Z",
            "updated_at": "2014-08-21T22:10:58Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/129/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/129/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/129/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/24fa6c95c5e307229e374a371de36dcb49e101d1",
            "head": {
              "label": "centro:fix-ie-file-upload",
              "ref": "fix-ie-file-upload",
              "sha": "24fa6c95c5e307229e374a371de36dcb49e101d1",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T21:30:40Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 2,
                "forks": 0,
                "open_issues": 2,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "7bf36ca5c884f280a0b1f0e2a034ca3238277077",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T21:30:40Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 2,
                "forks": 0,
                "open_issues": 2,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/129"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/129"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/129"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/129/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/129/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/129/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/24fa6c95c5e307229e374a371de36dcb49e101d1"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 1,
            "additions": 36,
            "deletions": 12,
            "changed_files": 7
          }
        },
        "public": false,
        "created_at": "2014-08-21T22:10:58Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247927686",
        "type": "IssueCommentEvent",
        "actor": {
          "id": 2659360,
          "login": "centrobot",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/users/centrobot",
          "avatar_url": "https://avatars.githubusercontent.com/u/2659360?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "created",
          "issue": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "labels_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/labels{/name}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments",
            "events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/events",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128",
            "id": 40852167,
            "number": 128,
            "title": "Sizmek advertisers 139",
            "user": {
              "login": "mswieboda",
              "id": 2223822,
              "avatar_url": "https://avatars.githubusercontent.com/u/2223822?v=2",
              "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
              "url": "https://api.github.com/users/mswieboda",
              "html_url": "https://github.com/mswieboda",
              "followers_url": "https://api.github.com/users/mswieboda/followers",
              "following_url": "https://api.github.com/users/mswieboda/following{/other_user}",
              "gists_url": "https://api.github.com/users/mswieboda/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mswieboda/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mswieboda/subscriptions",
              "organizations_url": "https://api.github.com/users/mswieboda/orgs",
              "repos_url": "https://api.github.com/users/mswieboda/repos",
              "events_url": "https://api.github.com/users/mswieboda/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mswieboda/received_events",
              "type": "User",
              "site_admin": false
            },
            "labels": [],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 1,
            "created_at": "2014-08-21T21:27:22Z",
            "updated_at": "2014-08-21T21:37:51Z",
            "closed_at": null,
            "pull_request": {
              "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128",
              "html_url": "https://github.com/centro/centro-media-manager/pull/128",
              "diff_url": "https://github.com/centro/centro-media-manager/pull/128.diff",
              "patch_url": "https://github.com/centro/centro-media-manager/pull/128.patch"
            },
            "body": "[Create and Manage Advertisers in Sizmek](https://centro.mingle.thoughtworks.com/projects/cmp___integration_efforts/cards/139)\r\nSizmek Create/Delete/Update/Get Advertisers\r\n\r\nNote: also renamed a few classes match Sizmek API better\r\n`FindCampaign` => `GetCampaigns` and `CampaignFilter => CampaignsFilter`"
          },
          "comment": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/52988554",
            "html_url": "https://github.com/centro/centro-media-manager/pull/128#issuecomment-52988554",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "id": 52988554,
            "user": {
              "login": "centrobot",
              "id": 2659360,
              "avatar_url": "https://avatars.githubusercontent.com/u/2659360?v=2",
              "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
              "url": "https://api.github.com/users/centrobot",
              "html_url": "https://github.com/centrobot",
              "followers_url": "https://api.github.com/users/centrobot/followers",
              "following_url": "https://api.github.com/users/centrobot/following{/other_user}",
              "gists_url": "https://api.github.com/users/centrobot/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/centrobot/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/centrobot/subscriptions",
              "organizations_url": "https://api.github.com/users/centrobot/orgs",
              "repos_url": "https://api.github.com/users/centrobot/repos",
              "events_url": "https://api.github.com/users/centrobot/events{/privacy}",
              "received_events_url": "https://api.github.com/users/centrobot/received_events",
              "type": "User",
              "site_admin": false
            },
            "created_at": "2014-08-21T21:37:51Z",
            "updated_at": "2014-08-21T21:37:51Z",
            "body": "Test PASSed.\nRefer to this link for build results (access rights to CI server needed): \nhttp://jenkins.ourcentro.net/job/Centro%20Media%20Manager%20-%20Pull%20Requests/145/"
          }
        },
        "public": false,
        "created_at": "2014-08-21T21:37:52Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247914123",
        "type": "CreateEvent",
        "actor": {
          "id": 284734,
          "login": "peterwmwong",
          "gravatar_id": "73c7efac6fc4503a27b82e700815093a",
          "url": "https://api.github.com/users/peterwmwong",
          "avatar_url": "https://avatars.githubusercontent.com/u/284734?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "fix-ie-file-upload",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-21T21:30:40Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247907951",
        "type": "PullRequestEvent",
        "actor": {
          "id": 2223822,
          "login": "mswieboda",
          "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
          "url": "https://api.github.com/users/mswieboda",
          "avatar_url": "https://avatars.githubusercontent.com/u/2223822?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "opened",
          "number": 128,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128",
            "id": 20139144,
            "html_url": "https://github.com/centro/centro-media-manager/pull/128",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/128.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/128.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128",
            "number": 128,
            "state": "open",
            "locked": false,
            "title": "Sizmek advertisers 139",
            "user": {
              "login": "mswieboda",
              "id": 2223822,
              "avatar_url": "https://avatars.githubusercontent.com/u/2223822?v=2",
              "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
              "url": "https://api.github.com/users/mswieboda",
              "html_url": "https://github.com/mswieboda",
              "followers_url": "https://api.github.com/users/mswieboda/followers",
              "following_url": "https://api.github.com/users/mswieboda/following{/other_user}",
              "gists_url": "https://api.github.com/users/mswieboda/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/mswieboda/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/mswieboda/subscriptions",
              "organizations_url": "https://api.github.com/users/mswieboda/orgs",
              "repos_url": "https://api.github.com/users/mswieboda/repos",
              "events_url": "https://api.github.com/users/mswieboda/events{/privacy}",
              "received_events_url": "https://api.github.com/users/mswieboda/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "[Create and Manage Advertisers in Sizmek](https://centro.mingle.thoughtworks.com/projects/cmp___integration_efforts/cards/139)\r\nSizmek Create/Delete/Update/Get Advertisers\r\n\r\nNote: also renamed a few classes match Sizmek API better\r\n`FindCampaign` => `GetCampaigns` and `CampaignFilter => CampaignsFilter`",
            "created_at": "2014-08-21T21:27:22Z",
            "updated_at": "2014-08-21T21:27:22Z",
            "closed_at": null,
            "merged_at": null,
            "merge_commit_sha": null,
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/128/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/885d91008c22c6335086d38ca2a6891a28dd6fa9",
            "head": {
              "label": "centro:sizmek-advertisers-139",
              "ref": "sizmek-advertisers-139",
              "sha": "885d91008c22c6335086d38ca2a6891a28dd6fa9",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T21:07:16Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 1,
                "forks": 0,
                "open_issues": 1,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "7bf36ca5c884f280a0b1f0e2a034ca3238277077",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T21:07:16Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 1,
                "forks": 0,
                "open_issues": 1,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/128"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/128"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/128"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/128/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/128/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/128/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/885d91008c22c6335086d38ca2a6891a28dd6fa9"}
            },
            "merged": false,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged_by": null,
            "comments": 0,
            "review_comments": 0,
            "commits": 7,
            "additions": 17282,
            "deletions": 1923,
            "changed_files": 48
          }
        },
        "public": false,
        "created_at": "2014-08-21T21:27:22Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247868950",
        "type": "CreateEvent",
        "actor": {
          "id": 2223822,
          "login": "mswieboda",
          "gravatar_id": "d4d312a34cfa93a577373558f8c34da8",
          "url": "https://api.github.com/users/mswieboda",
          "avatar_url": "https://avatars.githubusercontent.com/u/2223822?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "sizmek-advertisers-139",
          "ref_type": "branch",
          "master_branch": "master",
          "description": "Documentation for platform workflow and cross product requirements",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-21T21:07:17Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247868050",
        "type": "PushEvent",
        "actor": {
          "id": 569564,
          "login": "cstump",
          "gravatar_id": "3ece8879c1ceb0d68f3b58377bf58514",
          "url": "https://api.github.com/users/cstump",
          "avatar_url": "https://avatars.githubusercontent.com/u/569564?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 434352215,
          "size": 6,
          "distinct_size": 6,
          "ref": "refs/heads/trunk",
          "head": "d581d48adb6550b4cc53e56cc776fd1b799aa9c6",
          "before": "e35828d9699d352ce90cf9e1e12dee5974e63df6",
          "commits": [{
            "sha": "61be41c7c7208e184de5ed5f3c904ea4f47c7f55",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate dummy gem / app",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/61be41c7c7208e184de5ed5f3c904ea4f47c7f55"
          }, {
            "sha": "1d4ee7faaf1daef267f2c4a76d81bdc8107febfb",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "update components and specs to use new dummy location",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/1d4ee7faaf1daef267f2c4a76d81bdc8107febfb"
          }, {
            "sha": "04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate template to components dir",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce"
          }, {
            "sha": "b757f9e7364c595498f9c97b18eac527a2e857b6",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "Revert \"relocate template to components dir\"\n\nThis reverts commit 04c623fb7e53cc6ce3fa3ab274e6c66cb942c4ce.",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/b757f9e7364c595498f9c97b18eac527a2e857b6"
          }, {
            "sha": "f357aad6de9de7010137d1881b12b94b10b0a253",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "relocate template to components dir",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/f357aad6de9de7010137d1881b12b94b10b0a253"
          }, {
            "sha": "d581d48adb6550b4cc53e56cc776fd1b799aa9c6",
            "author": {
              "email": "chris.stump@centro.net",
              "name": "Chris Stump"
            },
            "message": "Merge branch 'relocate_dummy_and_template' into trunk",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/d581d48adb6550b4cc53e56cc776fd1b799aa9c6"
          }]
        },
        "public": false,
        "created_at": "2014-08-21T21:06:51Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247855695",
        "type": "DeleteEvent",
        "actor": {
          "id": 2243386,
          "login": "tmertens",
          "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
          "url": "https://api.github.com/users/tmertens",
          "avatar_url": "https://avatars.githubusercontent.com/u/2243386?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "ref": "testing_jenkins_pr",
          "ref_type": "branch",
          "pusher_type": "user"
        },
        "public": false,
        "created_at": "2014-08-21T21:00:48Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247855437",
        "type": "PullRequestEvent",
        "actor": {
          "id": 2243386,
          "login": "tmertens",
          "gravatar_id": "ed8160ecdaeb10c4509f9bd52e610e5a",
          "url": "https://api.github.com/users/tmertens",
          "avatar_url": "https://avatars.githubusercontent.com/u/2243386?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "action": "closed",
          "number": 97,
          "pull_request": {
            "url": "https://api.github.com/repos/centro/centro-media-manager/pulls/97",
            "id": 19638452,
            "html_url": "https://github.com/centro/centro-media-manager/pull/97",
            "diff_url": "https://github.com/centro/centro-media-manager/pull/97.diff",
            "patch_url": "https://github.com/centro/centro-media-manager/pull/97.patch",
            "issue_url": "https://api.github.com/repos/centro/centro-media-manager/issues/97",
            "number": 97,
            "state": "closed",
            "locked": false,
            "title": "Testing PR  do not merge to master",
            "user": {
              "login": "cmeisinger",
              "id": 416120,
              "avatar_url": "https://avatars.githubusercontent.com/u/416120?v=2",
              "gravatar_id": "45080ac51edb5ad418fb70b166baea7b",
              "url": "https://api.github.com/users/cmeisinger",
              "html_url": "https://github.com/cmeisinger",
              "followers_url": "https://api.github.com/users/cmeisinger/followers",
              "following_url": "https://api.github.com/users/cmeisinger/following{/other_user}",
              "gists_url": "https://api.github.com/users/cmeisinger/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/cmeisinger/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/cmeisinger/subscriptions",
              "organizations_url": "https://api.github.com/users/cmeisinger/orgs",
              "repos_url": "https://api.github.com/users/cmeisinger/repos",
              "events_url": "https://api.github.com/users/cmeisinger/events{/privacy}",
              "received_events_url": "https://api.github.com/users/cmeisinger/received_events",
              "type": "User",
              "site_admin": false
            },
            "body": "This is a PR to allow me to test the Jenkins PR builder.",
            "created_at": "2014-08-12T01:37:45Z",
            "updated_at": "2014-08-21T21:00:40Z",
            "closed_at": "2014-08-21T21:00:40Z",
            "merged_at": null,
            "merge_commit_sha": "3341fafcf99682ebcac507bf9e67e31979aa4044",
            "assignee": null,
            "milestone": null,
            "commits_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/97/commits",
            "review_comments_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/97/comments",
            "review_comment_url": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}",
            "comments_url": "https://api.github.com/repos/centro/centro-media-manager/issues/97/comments",
            "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/76aaa4961b54011f4304b4fd6ece3607487834dd",
            "head": {
              "label": "centro:testing_jenkins_pr",
              "ref": "testing_jenkins_pr",
              "sha": "76aaa4961b54011f4304b4fd6ece3607487834dd",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T20:16:41Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "base": {
              "label": "centro:master",
              "ref": "master",
              "sha": "d98c7253980e21d92e8fe0186c1d206e1a1f3820",
              "user": {
                "login": "centro",
                "id": 13479,
                "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                "url": "https://api.github.com/users/centro",
                "html_url": "https://github.com/centro",
                "followers_url": "https://api.github.com/users/centro/followers",
                "following_url": "https://api.github.com/users/centro/following{/other_user}",
                "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                "organizations_url": "https://api.github.com/users/centro/orgs",
                "repos_url": "https://api.github.com/users/centro/repos",
                "events_url": "https://api.github.com/users/centro/events{/privacy}",
                "received_events_url": "https://api.github.com/users/centro/received_events",
                "type": "Organization",
                "site_admin": false
              },
              "repo": {
                "id": 9459622,
                "name": "centro-media-manager",
                "full_name": "centro/centro-media-manager",
                "owner": {
                  "login": "centro",
                  "id": 13479,
                  "avatar_url": "https://avatars.githubusercontent.com/u/13479?v=2",
                  "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
                  "url": "https://api.github.com/users/centro",
                  "html_url": "https://github.com/centro",
                  "followers_url": "https://api.github.com/users/centro/followers",
                  "following_url": "https://api.github.com/users/centro/following{/other_user}",
                  "gists_url": "https://api.github.com/users/centro/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/centro/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/centro/subscriptions",
                  "organizations_url": "https://api.github.com/users/centro/orgs",
                  "repos_url": "https://api.github.com/users/centro/repos",
                  "events_url": "https://api.github.com/users/centro/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/centro/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": true,
                "html_url": "https://github.com/centro/centro-media-manager",
                "description": "Documentation for platform workflow and cross product requirements",
                "fork": false,
                "url": "https://api.github.com/repos/centro/centro-media-manager",
                "forks_url": "https://api.github.com/repos/centro/centro-media-manager/forks",
                "keys_url": "https://api.github.com/repos/centro/centro-media-manager/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/centro/centro-media-manager/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/centro/centro-media-manager/teams",
                "hooks_url": "https://api.github.com/repos/centro/centro-media-manager/hooks",
                "issue_events_url": "https://api.github.com/repos/centro/centro-media-manager/issues/events{/number}",
                "events_url": "https://api.github.com/repos/centro/centro-media-manager/events",
                "assignees_url": "https://api.github.com/repos/centro/centro-media-manager/assignees{/user}",
                "branches_url": "https://api.github.com/repos/centro/centro-media-manager/branches{/branch}",
                "tags_url": "https://api.github.com/repos/centro/centro-media-manager/tags",
                "blobs_url": "https://api.github.com/repos/centro/centro-media-manager/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/centro/centro-media-manager/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/centro/centro-media-manager/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/centro/centro-media-manager/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/centro/centro-media-manager/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/centro/centro-media-manager/languages",
                "stargazers_url": "https://api.github.com/repos/centro/centro-media-manager/stargazers",
                "contributors_url": "https://api.github.com/repos/centro/centro-media-manager/contributors",
                "subscribers_url": "https://api.github.com/repos/centro/centro-media-manager/subscribers",
                "subscription_url": "https://api.github.com/repos/centro/centro-media-manager/subscription",
                "commits_url": "https://api.github.com/repos/centro/centro-media-manager/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/centro/centro-media-manager/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/centro/centro-media-manager/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/centro/centro-media-manager/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/centro/centro-media-manager/contents/{+path}",
                "compare_url": "https://api.github.com/repos/centro/centro-media-manager/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/centro/centro-media-manager/merges",
                "archive_url": "https://api.github.com/repos/centro/centro-media-manager/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/centro/centro-media-manager/downloads",
                "issues_url": "https://api.github.com/repos/centro/centro-media-manager/issues{/number}",
                "pulls_url": "https://api.github.com/repos/centro/centro-media-manager/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/centro/centro-media-manager/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/centro/centro-media-manager/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/centro/centro-media-manager/labels{/name}",
                "releases_url": "https://api.github.com/repos/centro/centro-media-manager/releases{/id}",
                "created_at": "2013-04-15T22:37:14Z",
                "updated_at": "2014-08-19T13:44:34Z",
                "pushed_at": "2014-08-21T20:16:41Z",
                "git_url": "git://github.com/centro/centro-media-manager.git",
                "ssh_url": "git@github.com:centro/centro-media-manager.git",
                "clone_url": "https://github.com/centro/centro-media-manager.git",
                "svn_url": "https://github.com/centro/centro-media-manager",
                "homepage": null,
                "size": 86960,
                "stargazers_count": 1,
                "watchers_count": 1,
                "language": "Ruby",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 1,
                "default_branch": "master"
              }
            },
            "_links": {
              "self": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/97"},
              "html": {"href": "https://github.com/centro/centro-media-manager/pull/97"},
              "issue": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/97"},
              "comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/issues/97/comments"},
              "review_comments": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/97/comments"},
              "review_comment": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/comments/{number}"},
              "commits": {"href": "https://api.github.com/repos/centro/centro-media-manager/pulls/97/commits"},
              "statuses": {"href": "https://api.github.com/repos/centro/centro-media-manager/statuses/76aaa4961b54011f4304b4fd6ece3607487834dd"}
            },
            "merged": false,
            "mergeable": true,
            "mergeable_state": "clean",
            "merged_by": null,
            "comments": 13,
            "review_comments": 0,
            "commits": 1,
            "additions": 1,
            "deletions": 0,
            "changed_files": 1
          }
        },
        "public": false,
        "created_at": "2014-08-21T21:00:40Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }, {
        "id": "2247759041",
        "type": "PushEvent",
        "actor": {
          "id": 19976,
          "login": "sirsean",
          "gravatar_id": "c77ab584a8a6872ec2b2acec076354f7",
          "url": "https://api.github.com/users/sirsean",
          "avatar_url": "https://avatars.githubusercontent.com/u/19976?"
        },
        "repo": {
          "id": 9459622,
          "name": "centro/centro-media-manager",
          "url": "https://api.github.com/repos/centro/centro-media-manager"
        },
        "payload": {
          "push_id": 434309669,
          "size": 1,
          "distinct_size": 1,
          "ref": "refs/heads/trunk",
          "head": "e35828d9699d352ce90cf9e1e12dee5974e63df6",
          "before": "85a4efabc2063b882662c6a057483c6c0a0a0dd1",
          "commits": [{
            "sha": "e35828d9699d352ce90cf9e1e12dee5974e63df6",
            "author": {
              "email": "sirsean@gmail.com",
              "name": "Sean Schulte"
            },
            "message": "We can run unit tests separately from feature tests now.",
            "distinct": true,
            "url": "https://api.github.com/repos/centro/centro-media-manager/commits/e35828d9699d352ce90cf9e1e12dee5974e63df6"
          }]
        },
        "public": false,
        "created_at": "2014-08-21T20:16:42Z",
        "org": {
          "id": 13479,
          "login": "centro",
          "gravatar_id": "864a80ec43c517f08ce8ecf269aaffed",
          "url": "https://api.github.com/orgs/centro",
          "avatar_url": "https://avatars.githubusercontent.com/u/13479?"
        }
      }]);
    }
  };
});
System.register("models/github/EventPayloads", ["../../helpers/model/Model", "./Comment", "./Repo", "./User"], function($__export) {
  "use strict";
  var __moduleName = "models/github/EventPayloads";
  var Model,
      Comment,
      Repo,
      User,
      CommitCommentEvent,
      CreateEvent,
      DeleteEvent;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      Comment = m.default;
    }, function(m) {
      Repo = m.default;
    }, function(m) {
      User = m.default;
    }],
    execute: function() {
      CommitCommentEvent = $__export("CommitCommentEvent", (function($__super) {
        var CommitCommentEvent = function CommitCommentEvent() {
          $traceurRuntime.defaultSuperCall(this, CommitCommentEvent.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(CommitCommentEvent, {}, {}, $__super);
      }(Model)));
      CommitCommentEvent.create((function($) {
        $.hasOne('comment', 'Comment');
        $.hasOne('repository', 'Repo');
        $.hasOne('sender', 'User');
      }));
      CreateEvent = $__export("CreateEvent", (function($__super) {
        var CreateEvent = function CreateEvent() {
          $traceurRuntime.defaultSuperCall(this, CreateEvent.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(CreateEvent, {}, {}, $__super);
      }(Model)));
      CreateEvent.create((function($) {
        $.attr('description', 'string');
        $.attr('masterBranch', 'string');
        $.attr('pusherType', 'string');
        $.attr('ref', 'string');
        $.attr('refType', 'string');
        $.hasOne('repository', 'Repo');
        $.hasOne('sender', 'User');
      }));
      DeleteEvent = $__export("DeleteEvent", (function($__super) {
        var DeleteEvent = function DeleteEvent() {
          $traceurRuntime.defaultSuperCall(this, DeleteEvent.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(DeleteEvent, {}, {}, $__super);
      }(Model)));
      DeleteEvent.create((function($) {
        $.attr('description', 'string');
        $.attr('masterBranch', 'string');
        $.attr('pusherType', 'string');
        $.attr('ref', 'string');
        $.attr('refType', 'string');
        $.hasOne('repository', 'Repo');
        $.hasOne('sender', 'User');
      }));
    }
  };
});
System.register("patchTraceurForIE", [], function($__export) {
  "use strict";
  var __moduleName = "patchTraceurForIE";
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
