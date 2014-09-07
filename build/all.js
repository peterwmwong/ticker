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
System.register("models/github/GithubEventMapper", ["helpers/AttrMunger", "helpers/load"], function($__export) {
  "use strict";
  var $__20;
  var __moduleName = "models/github/GithubEventMapper";
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
System.register("models/github/GithubRepo", ["../../helpers/model/Model"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubRepo";
  var Model,
      GithubRepo;
  return {
    setters: [function(m) {
      Model = m.default;
    }],
    execute: function() {
      GithubRepo = (function($__super) {
        var GithubRepo = function GithubRepo() {
          $traceurRuntime.defaultSuperCall(this, GithubRepo.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(GithubRepo, {}, {}, $__super);
      }(Model));
      GithubRepo.create((function($) {
        $.attr('name', 'string');
        $.attr('url', 'string');
      }));
      $__export('default', GithubRepo);
    }
  };
});
System.register("models/github/GithubUserMapper", ["helpers/AttrMunger", "helpers/load"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubUserMapper";
  var AttrMunger,
      loadJSON;
  return {
    setters: [function(m) {
      AttrMunger = m.default;
    }, function(m) {
      loadJSON = m.loadJSON;
    }],
    execute: function() {
      $__export('default', {query: (function(array, $__23) {
          var q = $__23.q;
          return (loadJSON(("https://api.github.com/search/users?q=" + q))).then((function(data) {
            return (data && data.items) && array.$replace(array.$class.loadAll(AttrMunger.camelize(data.items)));
          }));
        })});
    }
  };
});
System.register("models/github/GithubUser", ["../../helpers/model/Model", "./GithubUserMapper"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubUser";
  var Model,
      GithubUserMapper,
      GithubUser;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      GithubUserMapper = m.default;
    }],
    execute: function() {
      GithubUser = (function($__super) {
        var GithubUser = function GithubUser() {
          $traceurRuntime.defaultSuperCall(this, GithubUser.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(GithubUser, {}, {}, $__super);
      }(Model));
      GithubUser.create((function($) {
        $.mapper = GithubUserMapper;
        $.attr('avatarUrl', 'string');
        $.attr('gravatarId', 'string');
        $.attr('login', 'string');
        $.attr('url', 'string');
      }));
      $__export('default', GithubUser);
    }
  };
});
System.register("models/github/GithubEvent", ["../../helpers/model/Model", "./GithubEventMapper", "./GithubUser", "./GithubRepo"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubEvent";
  var Model,
      GithubEventMapper,
      GithubUser,
      GithubRepo,
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
    }],
    execute: function() {
      GithubEvent = (function($__super) {
        var GithubEvent = function GithubEvent() {
          $traceurRuntime.defaultSuperCall(this, GithubEvent.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(GithubEvent, {}, {}, $__super);
      }(Model));
      GithubEvent.create((function($) {
        $.mapper = GithubEventMapper;
        $.attr('type', 'string');
        $.attr('payload', 'identity');
        $.attr('createdAt', 'datetime');
        $.hasOne('actor', 'GithubUser');
        $.hasOne('repo', 'GithubRepo');
      }));
      $__export('default', GithubEvent);
    }
  };
});
System.register("models/EventStream", ["helpers/AttrMunger", "../helpers/model/Model", "./github/GithubEvent", "./github/GithubUser"], function($__export) {
  "use strict";
  var __moduleName = "models/EventStream";
  var AttrMunger,
      Model,
      GithubEvent,
      GithubUser,
      EventStream,
      GithubEventStream;
  return {
    setters: [function(m) {
      AttrMunger = m.default;
    }, function(m) {
      Model = m.default;
    }, function(m) {
      GithubEvent = m.default;
    }, function(m) {
      GithubUser = m.default;
    }],
    execute: function() {
      EventStream = (function($__super) {
        var EventStream = function EventStream() {
          $traceurRuntime.defaultSuperCall(this, EventStream.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(EventStream, {
          name: function() {
            throw 'Implement me';
          },
          events: function() {
            throw 'Implement me';
          }
        }, {}, $__super);
      }(Model));
      EventStream.create((function($) {
        $.attr('type', 'string');
        $.attr('config', 'identity');
        $.mapper = {query: (function(array, $__26) {
            var term = $__26.term;
            return GithubUser.query({q: term}).$promise.then((function(users) {
              return array.$replace(users.map((function(user) {
                return GithubEventStream.load({
                  id: user.id,
                  config: {
                    type: 'users',
                    users: user.login
                  }
                });
              })));
            }));
          })};
      }));
      GithubEventStream = $__export("GithubEventStream", (function($__super) {
        var GithubEventStream = function GithubEventStream() {
          $traceurRuntime.defaultSuperCall(this, GithubEventStream.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(GithubEventStream, {
          get name() {
            return this.config[this.config.type];
          },
          events: function() {
            return GithubEvent.query(this.config);
          }
        }, {}, $__super);
      }(EventStream)));
      $__export('default', EventStream);
    }
  };
});
System.register("models/User", ["../helpers/model/Model", "./EventStream"], function($__export) {
  "use strict";
  var __moduleName = "models/User";
  var Model,
      EventStream,
      User;
  return {
    setters: [function(m) {
      Model = m.default;
    }, function(m) {
      EventStream = m.default;
    }],
    execute: function() {
      User = (function($__super) {
        var User = function User() {
          $traceurRuntime.defaultSuperCall(this, User.prototype, arguments);
        };
        return ($traceurRuntime.createClass)(User, {eventStreams: function() {
            return EventStream.query();
          }}, {}, $__super);
      }(Model));
      User.create((function($) {
        $.attr('login', 'string');
        $.attr('name', 'string');
        $.hasMany('eventStreams', 'EventStream');
      }));
      $__export('default', User);
    }
  };
});
System.register("helpers/session", ["../models/User", "../models/EventStream"], function($__export) {
  "use strict";
  var $__29;
  var __moduleName = "helpers/session";
  var User,
      GithubEventStream,
      mockGithubES,
      MOCKUSER;
  return ($__29 = {}, Object.defineProperty($__29, "setters", {
    value: [function(m) {
      User = m.default;
    }, function(m) {
      GithubEventStream = m.GithubEventStream;
    }],
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__29, "execute", {
    value: function() {
      mockGithubES = (function() {
        var nextId = 1;
        return (function(type, value) {
          var $__29,
              $__30;
          return GithubEventStream.load(($__30 = {}, Object.defineProperty($__30, "id", {
            value: nextId++,
            configurable: true,
            enumerable: true,
            writable: true
          }), Object.defineProperty($__30, "type", {
            value: 'github',
            configurable: true,
            enumerable: true,
            writable: true
          }), Object.defineProperty($__30, "config", {
            value: ($__29 = {}, Object.defineProperty($__29, "type", {
              value: type,
              configurable: true,
              enumerable: true,
              writable: true
            }), Object.defineProperty($__29, type, {
              value: value,
              configurable: true,
              enumerable: true,
              writable: true
            }), $__29),
            configurable: true,
            enumerable: true,
            writable: true
          }), $__30));
        });
      })();
      MOCKUSER = User.load({
        id: 1,
        login: 'peterwmwong',
        name: 'Peter Wong'
      });
      MOCKUSER.addEventStreams(mockGithubES('users', 'polymer'), mockGithubES('repos', 'centro/centro-media-manager'), mockGithubES('users', 'googlewebcomponents'), mockGithubES('repos', 'google/traceur-compiler'), mockGithubES('users', 'arv'), mockGithubES('users', 'johnjbarton'), mockGithubES('users', 'guybedford'), mockGithubES('users', 'ebidel'), mockGithubES('users', 'addyosmani'), mockGithubES('users', 'esprehn'), mockGithubES('users', 'abarth'), mockGithubES('users', 'theefer'), mockGithubES('users', 'btford'), mockGithubES('users', 'tbosch'), mockGithubES('users', 'vojtajina'), mockGithubES('users', 'eisenbergeffect'), mockGithubES('repos', 'jscs-dev/node-jscs'), mockGithubES('repos', 'jshint/jshint'), mockGithubES('repos', 'facebook/react'));
      $__export('default', {user: MOCKUSER});
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__29);
});
System.register("elements/ticker-app", ["../helpers/session"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-app";
  var session;
  return {
    setters: [function(m) {
      session = m.default;
    }],
    execute: function() {
      Polymer('ticker-app', {
        selectedEventStream: null,
        isSearching: false,
        searchText: '',
        session: session,
        ready: function() {
          this.selectedEventStream = session.user.eventStreams[0];
        },
        selectedEventStreamChanged: function(_, selectedEventStream) {
          if (selectedEventStream) {
            this.events = selectedEventStream.events();
          }
        },
        onCloseSearch: function() {
          this.isSearching = false;
        },
        onSearchSelect: function(event, selectedEventStream) {
          this.selectedEventStream = selectedEventStream;
          this.onCloseSearch();
        },
        onSelectSearch: function() {
          this.isSearching = true;
          this.$.drawerPanel.closeDrawer();
        },
        onSelectEventStream: function(event) {
          this.isSearching = false;
          this.selectedEventStream = event.target.templateInstance.model.eventStream;
          this.$.drawerPanel.closeDrawer();
        },
        onOpenDrawer: function() {
          this.$.drawerPanel.openDrawer();
        },
        onRefresh: function() {
          this.events = this.selectedEventStream.events();
        }
      });
    }
  };
});
System.register("elements/ticker-search", ["../models/EventStream"], function($__export) {
  "use strict";
  var __moduleName = "elements/ticker-search";
  var EventStream;
  return {
    setters: [function(m) {
      EventStream = m.default;
    }],
    execute: function() {
      Polymer('ticker-search', {
        searchText: '',
        results: [],
        suggestions: [],
        searchTextChanged: function(_, searchText) {
          var $__31 = this;
          this.job('search', (function() {
            if ($__31.searchText)
              $__31.searchResults = EventStream.query({term: $__31.searchText});
          }), 100);
        },
        onClearSearch: function() {
          this.searchText = '';
          this.searchResults = [];
        },
        onCloseSearch: function() {
          this.fire('ticker-search-close');
        },
        onSearchResultSelected: function(event) {
          this.fire('ticker-search-select', event.target.templateInstance.model.searchResult);
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
              $__32 = 1; $__32 < arguments.length; $__32++)
            args[$__32 - 1] = arguments[$__32];
        },
        get: function(model) {
          for (var args = [],
              $__33 = 1; $__33 < arguments.length; $__33++)
            args[$__33 - 1] = arguments[$__33];
        },
        create: function(model) {
          for (var args = [],
              $__34 = 1; $__34 < arguments.length; $__34++)
            args[$__34 - 1] = arguments[$__34];
        },
        update: function(model) {
          for (var args = [],
              $__35 = 1; $__35 < arguments.length; $__35++)
            args[$__35 - 1] = arguments[$__35];
        },
        delete: function(model) {
          for (var args = [],
              $__36 = 1; $__36 < arguments.length; $__36++)
            args[$__36 - 1] = arguments[$__36];
        }
      });
    }
  };
});
System.register("models/github/GithubComment", ["../../helpers/model/Model", "./GithubUser"], function($__export) {
  "use strict";
  var __moduleName = "models/github/GithubComment";
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
          $traceurRuntime.defaultSuperCall(this, GithubComment.prototype, arguments);
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
          $traceurRuntime.defaultSuperCall(this, CommitCommentEvent.prototype, arguments);
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
        $.hasOne('repository', 'GithubRepo');
        $.hasOne('sender', 'GithubUser');
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
        $.hasOne('repository', 'GithubRepo');
        $.hasOne('sender', 'GithubUser');
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
