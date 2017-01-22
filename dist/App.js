(function () {
'use strict';

var sw = navigator.serviceWorker;
if (sw) {
  sw.register('../serviceWorker.js');
}

/*

Instance properties:

$n = DOM node
$s - spec (see below)
$x - Pool linked list next pointer

Spec properties:

c - create (or render)
u - update (or update)
r - keyed map of unmounted instanced that can be recycled

*/

var isDynamicEmpty = function isDynamicEmpty(v) {
  return v == null || v === true || v === false;
};
var EMPTY_PROPS = {};
var DEADPOOL = {
  push: function push() {},
  pop: function pop() {}
};

// Creates an empty object with no built in properties (ie. `constructor`).
function Hash() {}
Hash.prototype = Object.create(null);

// TODO: Benchmark whether this is slower than Function/Prototype
function Pool() {
  this.map = new Hash();
}

Pool.prototype.push = function (instance) {
  var key = instance.key;
  var map = this.map;

  instance.$x = map[key];
  map[key] = instance;
};

Pool.prototype.pop = function (key) {
  var head = this.map[key];
  if (!head) return;
  this.map[key] = head.$x;
  return head;
};

var recycle = function recycle(instance) {
  instance.$s.r.push(instance);
};
var createTextNode = function createTextNode(value) {
  return document.createTextNode(value);
};

var replaceNode = function replaceNode(oldNode, newNode) {
  var parentNode = oldNode.parentNode;
  if (parentNode) parentNode.replaceChild(newNode, oldNode);
};

function unmountInstance(inst, parentNode) {
  recycle(inst);
  parentNode.removeChild(inst.$n);
}

function removeArrayNodes(array, parentNode, i) {
  while (i < array.length) {
    unmountInstance(array[i++], parentNode);
  }
}

function removeArrayNodesOnlyChild(array, parentNode) {
  var i = 0;

  while (i < array.length) {
    recycle(array[i++]);
  }
  parentNode.textContent = '';
}

function internalRerenderInstance(prevInst, inst) {
  return prevInst.$s === inst.$s && (inst.$s.u(inst, prevInst), true);
}

function renderArrayToParentBefore(parentNode, array, i, markerNode) {
  if (markerNode === null) renderArrayToParent(parentNode, array, i);else renderArrayToParentBeforeNode(parentNode, array, i, markerNode);
}

function renderArrayToParentBeforeNode(parentNode, array, i, beforeNode) {
  while (i < array.length) {
    parentNode.insertBefore((array[i] = internalRender(array[i])).$n, beforeNode);
    ++i;
  }
}

function renderArrayToParent(parentNode, array, i) {
  while (i < array.length) {
    parentNode.appendChild((array[i] = internalRender(array[i])).$n);
    ++i;
  }
}

function rerenderDynamic(isOnlyChild, value, contextNode) {
  var frag = document.createDocumentFragment();
  var node = createDynamic(isOnlyChild, frag, value);
  replaceNode(contextNode, frag);
  return node;
}

function rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, markerNode) {
  var i = 0;
  for (; i < array.length && i < oldArray.length; i++) {
    array[i] = internalRerender(oldArray[i], array[i]);
  }

  if (i < array.length) {
    renderArrayToParentBefore(parentNode, array, i, markerNode);
  } else {
    removeArrayNodes(oldArray, parentNode, i);
  }
}

function rerenderArrayOnlyChild(parentNode, array, oldArray) {
  if (!oldArray.length) {
    renderArrayToParent(parentNode, array, 0);
  } else if (!array.length) {
    removeArrayNodesOnlyChild(oldArray, parentNode);
  } else {
    rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, null);
  }
}

function rerenderArray(array, parentOrMarkerNode, isOnlyChild, oldArray) {
  if (array instanceof Array) {
    return isOnlyChild ? rerenderArrayOnlyChild(parentOrMarkerNode, array, oldArray) : rerenderArrayReconcileWithMinLayout(parentOrMarkerNode.parentNode, array, oldArray, parentOrMarkerNode), parentOrMarkerNode;
  }

  if (isOnlyChild) {
    removeArrayNodesOnlyChild(oldArray, parentOrMarkerNode);
    return createDynamic(true, parentOrMarkerNode, array);
  }

  removeArrayNodes(oldArray, parentOrMarkerNode.parentNode, 0);
}

function rerenderText(value, contextNode, isOnlyChild) {
  if (!(value instanceof Object)) {

    contextNode.nodeValue = isDynamicEmpty(value) ? '' : value;
    return contextNode;
  }
}

function rerenderInstance(value, node, isOnlyChild, prevValue) {
  var prevRenderedInstance = void 0;
  if (value && internalRerenderInstance(prevRenderedInstance = prevValue.$r || prevValue, value)) {
    // TODO: What is $r? Is this trying to track the original rendered instnace?
    value.$r = prevRenderedInstance;
    return node;
  }
}

function StatefulComponent(render, props, instance, actions) {
  this._boundActions = new Hash();
  this._parentInst = instance;
  this.actions = actions;
  this.props = props;
  this.render = render;
  this.bindSend = this.bindSend.bind(this);
  this.state = actions.onInit(this);
  this.$n = internalRenderNoRecycle(this._instance = render(this));
}

StatefulComponent.prototype.updateProps = function (newProps) {
  var props = this.props;

  this.props = newProps;

  if (this.actions.onProps) this.send('onProps', props);else this.rerender();

  return this;
};

StatefulComponent.prototype.bindSend = function (action) {
  return this._boundActions[action] || (this._boundActions[action] = this.send.bind(this, action));
};

StatefulComponent.prototype.send = function (actionName, context) {
  var newState = void 0;
  var actionFn = this.actions[actionName];
  // TODO: process.ENV === 'development', console.error(`Action not found #{action}`);
  if (!actionFn || (newState = actionFn(this, context)) == this.state) return;

  this.state = newState;
  this.rerender();
};

StatefulComponent.prototype.rerender = function () {
  var instance = internalRerender(this._instance, this.render(this));
  this._instance = instance;
  instance.$n.xvdom = this._parentInst;
};

function createStatefulComponent(component, props, instance, actions) {
  return new StatefulComponent(component, props, instance, actions);
}

function createStatelessComponent(component, props) {
  var instance = component(props);
  internalRenderNoRecycle(instance);
  return instance;
}

function createComponent(component, actions, props, parentInstance) {
  var result = (actions ? createStatefulComponent : createStatelessComponent)(component, props || EMPTY_PROPS, parentInstance, actions);

  return result;
}

function updateComponent(component, actions, props, componentInstance) {
  var result = actions ? componentInstance.updateProps(props) : internalRerender(componentInstance, component(props));

  return result;
}

function internalRenderNoRecycle(instance) {
  var node = instance.$s.c(instance);
  instance.$n = node;
  node.xvdom = instance;
  return node;
}

function internalRender(instance) {
  var spec = instance.$s;
  var recycledInstance = spec.r.pop(instance.key);
  if (recycledInstance) {
    spec.u(instance, recycledInstance);
    return recycledInstance;
  }

  internalRenderNoRecycle(instance);
  return instance;
}

function createDynamic(isOnlyChild, parentNode, value) {
  return value instanceof Array ? (renderArrayToParent(parentNode, value, 0), isOnlyChild ? parentNode : parentNode.appendChild(createTextNode(''))) : parentNode.appendChild(value instanceof Object ? internalRenderNoRecycle(value) : createTextNode(isDynamicEmpty(value) ? '' : value));
}

function updateDynamic(isOnlyChild, oldValue, value, contextNode) {
  return (oldValue instanceof Object ? oldValue instanceof Array ? rerenderArray(value, contextNode, isOnlyChild, oldValue) : rerenderInstance(value, contextNode, isOnlyChild, oldValue) : rerenderText(value, contextNode, isOnlyChild)) || rerenderDynamic(isOnlyChild, value, contextNode);
}

function internalRerender(prevInstance, instance) {
  if (internalRerenderInstance(prevInstance, instance)) return prevInstance;

  replaceNode(prevInstance.$n, (instance = internalRender(instance)).$n);
  recycle(prevInstance);
  return instance;
}

var render = function render(instance) {
  return internalRender(instance).$n;
};
var rerender = function rerender(node, instance) {
  return internalRerender(node.xvdom, instance).$n;
};
var unmount = function unmount(node) {
  unmountInstance(node.xvdom, node.parentNode);
};

var xvdom = {
  createComponent: createComponent,
  createDynamic: createDynamic,
  el: function el(tag) {
    return document.createElement(tag);
  },
  render: render,
  rerender: rerender,
  unmount: unmount,
  updateComponent: updateComponent,
  updateDynamic: updateDynamic,
  Pool: Pool,
  DEADPOOL: DEADPOOL
};

// Internal API

var loadJSON = function loadJSON(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    var accessToken = localStorage.getItem('ticker:token:github');
    xhr.open('GET', url);
    if (accessToken) xhr.setRequestHeader('Authorization', 'token ' + accessToken);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onerror = reject;
    xhr.onload = function () {
      var response = xhr.response;
      if (response) {
        resolve(typeof response === 'string' ? JSON.parse(response) : response);
      } else {
        reject(new Error('loadJSON: empty response'));
      }
    };
  });
};

loadJSON.setAccessToken = function (accessToken) {
  localStorage.setItem('ticker:token:github', accessToken);
};

/*

Cross-session, Key-Value, LRU expunging storage.

*/

var REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
var registry = void 0;
try {
  registry = JSON.parse(localStorage.getItem(REGISTRY_KEY));
} catch (e) {} // eslint-disable-line no-empty

if (!registry) localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry = []));

var removeLRUItem = function removeLRUItem() {
  var lruKey = registry.pop();
  if (lruKey) {
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, false); // eslint-disable-line no-use-before-define
  }
};

var safeSetItem = function safeSetItem(key, value) {
  var remainingTries = registry.length;
  while (remainingTries--) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e) {
      removeLRUItem();
    }
  }
  
};

var updateRegistryKey = function updateRegistryKey(key, isAdd) {
  var keyIndex = registry.indexOf(key);
  if (keyIndex >= 0) registry.splice(keyIndex, 1);
  if (isAdd) registry.unshift(key);

  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
};

var updateLRUItem = function updateLRUItem(key) {
  updateRegistryKey(key, true);
};

var storage = {
  getItem: function getItem(key) {
    var value = localStorage.getItem(key);
    if (value) updateLRUItem(key);
    return value;
  },
  setItem: function setItem(key, value) {
    safeSetItem(key, value);
    updateLRUItem(key);
    return value;
  },
  getItemObj: function getItemObj(key) {
    var valueString = this.getItem(key);

    var value = valueString && JSON.parse(valueString);

    return value;
  },
  setItemObj: function setItemObj(key, value) {
    this.setItem(key, JSON.stringify(value));

    return value;
  }
};

var identity = function identity(o) {
  return o;
};
var fromCache = function fromCache(cacheKey) {
  return storage.getItemObj(cacheKey);
};
var load = function load(_ref) {
  var url = _ref.url,
      cache = _ref.cache,
      _ref$transform = _ref.transform,
      transform = _ref$transform === undefined ? identity : _ref$transform;
  return loadJSON(url).then(transform).then(!cache ? identity : function (obj) {
    return storage.setItemObj(cache, obj);
  });
};

var model = (function (_ref2) {
  var g = _ref2.get,
      q = _ref2.query;
  return {
    localGet: function localGet(options) {
      return fromCache(g(options).cache);
    },
    get: function get(options) {
      return load(g(options));
    },
    localQuery: function localQuery(options) {
      return fromCache(q(options).cache);
    },
    query: function query(options) {
      return load(q(options));
    }
  };
});

var DB = model({
  get: function get() {
    return {
      // TODO: Figure out IndexDB as it may allow for ~50MB amount data
      // cache: `okDB`,
      url: '../static/db.json'
    };
  }
});

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();













var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var LAST_LOGIN_ID_STORAGE_KEY = 'ok:lastLoggedInUserId';
var fb = function fb(id) {
  return firebase.database().ref('users/' + id);
};
var store = function store(user) {
  return storage.setItemObj('ok:' + user.id, user);
};

var User = {
  current: function current() {
    var lastLoginId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
    if (!lastLoginId) return;
    return this.localGet(lastLoginId);
  },

  setCurrent: function setCurrent(id) {
    return storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id);
  },
  unsetCurrent: function unsetCurrent() {
    var user = this.current();
    if (!user) return;
    storage.setItemObj('ok:' + user.id, '');
    storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, '');
  },

  localGet: function localGet(id) {
    return storage.getItemObj('ok:' + id);
  },
  save: function save(user) {
    return new Promise(function (resolve, reject) {
      fb(user.id).set(user, function (err) {
        if (err) return reject(err);
        resolve(store(_extends({}, user)));
      });
    });
  },
  get: function get(id) {
    return new Promise(function (resolve, reject) {
      fb(id).once('value', function (data) {
        var val = data.val();
        if (!val) return reject("Couldn't find User");
        resolve(store(val));
      });
    });
  }
};

var _this = undefined;

var _xvdomCreateComponent = xvdom.createComponent;
var _xvdomCreateDynamic = xvdom.createDynamic;
var _xvdomEl = xvdom.el;
var _xvdomUpdateComponent = xvdom.updateComponent;
var _xvdomUpdateDynamic = xvdom.updateDynamic;
var _xvdomSpec10 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent(App, App.state, {
      user: inst.a,
      db: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent(App, App.state, {
        user: pInst.a = inst.a,
        db: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec9 = {
  c: function c(inst) {
    var _n = _xvdomEl('body'),
        _n2;

    _n2 = _xvdomEl('div');
    inst.b = _xvdomCreateDynamic(true, _n2, inst.a);

    _n.appendChild(_n2);

    inst.d = _xvdomCreateDynamic(false, _n, inst.c);
    _n2 = _xvdomEl('button');
    inst.f = _n2;
    _n2.onclick = inst.e;
    inst.h = _xvdomCreateDynamic(true, _n2, inst.g);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic(true, pInst.a, pInst.a = inst.a, pInst.b);
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(false, pInst.c, pInst.c = inst.c, pInst.d);
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.f.onclick = v;
      pInst.e = v;
    }

    if (inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateDynamic(true, pInst.g, pInst.g = inst.g, pInst.h);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec8 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent(OutfitList, OutfitList.state, {
      db: inst.a,
      outfits: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent(OutfitList, OutfitList.state, {
        db: pInst.a = inst.a,
        outfits: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec7 = {
  c: function c(inst) {
    var _n = _xvdomEl('div'),
        _n2,
        _n3;

    _n2 = _xvdomEl('table');
    inst.b = _n2;
    _n2.style = inst.a;
    _n3 = _xvdomEl('tbody');
    inst.d = _xvdomCreateDynamic(true, _n3, inst.c);

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.style = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec6 = {
  c: function c(inst) {
    var _n = (inst.g = _xvdomCreateComponent(OutfitRow, OutfitRow.state, {
      db: inst.a,
      outfitId: inst.b,
      outfit: inst.c,
      selectedOutfitId: inst.d,
      onSelect: inst.e,
      onAddExclusion: inst.f
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.e !== pInst.e || inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateComponent(OutfitRow, OutfitRow.state, {
        db: pInst.a = inst.a,
        outfitId: pInst.b = inst.b,
        outfit: pInst.c = inst.c,
        selectedOutfitId: pInst.d = inst.d,
        onSelect: pInst.e = inst.e,
        onAddExclusion: pInst.f = inst.f
      }, pInst.g);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5 = {
  c: function c(inst) {
    var _n = _xvdomEl('tr'),
        _n2;

    inst.b = _n;
    _n.style = inst.a;
    inst.d = _xvdomCreateDynamic(false, _n, inst.c);
    _n2 = _xvdomEl('td');
    inst.f = _xvdomCreateDynamic(true, _n2, inst.e);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.style = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(false, pInst.c, pInst.c = inst.c, pInst.d);
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic(true, pInst.e, pInst.e = inst.e, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4 = {
  c: function c(inst) {
    var _n = _xvdomEl('div');

    inst.b = _xvdomCreateDynamic(false, _n, inst.a);
    inst.d = _xvdomCreateDynamic(false, _n, inst.c);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic(false, pInst.a, pInst.a = inst.a, pInst.b);
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(false, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3 = {
  c: function c(inst) {
    var _n = _xvdomEl('a');

    _n.href = '#';
    inst.b = _n;
    _n.onclick = inst.a;
    inst.d = _xvdomCreateDynamic(true, _n, inst.c);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onclick = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2 = {
  c: function c(inst) {
    var _n = _xvdomEl('a');

    _n.href = '#';
    inst.b = _n;
    _n.onclick = inst.a;

    _n.appendChild(document.createTextNode(('Remove outfits with these items') || ''));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onclick = v;
      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec = {
  c: function c(inst) {
    var _n = _xvdomEl('td'),
        _n2;

    inst.b = _n;
    _n.itemId = inst.a;
    _n.itemType = inst.c;
    _n.onclick = inst.d;
    _n.style = inst.e;
    _n2 = _xvdomEl('img');
    _n2.style = 'height: 150';
    inst.g = _n2;
    _n2.src = inst.f;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.itemId = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.itemType = v;
      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.b.onclick = v;
      pInst.d = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.b.style = v;
      pInst.e = v;
    }

    v = inst.f;

    if (v !== pInst.f) {
      pInst.g.src = v;
      pInst.f = v;
    }
  },
  r: xvdom.DEADPOOL
};
var PAGE_SIZE = 10;
var SELECTED_ROW_STYLE = 'background: #DDD;';
var SELECTED_CELL_STYLE = 'border: 4px solid black;';
var CATEGORIES = ['Yup', 'Nope', 'Maybe'];
var ITEM_TYPES = ['bottom', 'shirt', 'sweater', 'businessAttire'];
var EMPTY_SELECTED_ITEM_IDS = ITEM_TYPES.reduce(function (obj, type) {
  return obj[type] = 0, obj;
}, {});

var isEmptySelection = function isEmptySelection(selectedItems) {
  return ITEM_TYPES.reduce(function (sum, type) {
    return sum + (selectedItems[type] && 1);
  }, 0) < 2;
};

var OutfitRow = function OutfitRow(_ref) {
  var _ref$props = _ref.props,
      db = _ref$props.db,
      outfitId = _ref$props.outfitId,
      outfit = _ref$props.outfit,
      selectedOutfitId = _ref$props.selectedOutfitId,
      onSelect = _ref$props.onSelect,
      onAddExclusion = _ref$props.onAddExclusion,
      selectedItems = _ref.state.selectedItems,
      bindSend = _ref.bindSend;

  var isSelected = outfitId === selectedOutfitId;
  return {
    $s: _xvdomSpec5,
    a: isSelected ? SELECTED_ROW_STYLE : '',
    c: ITEM_TYPES.map(function (type) {
      var itemId = outfit[type];
      return {
        $s: _xvdomSpec,
        a: itemId,
        c: type,
        d: bindSend('handleSelectItem'),
        e: selectedItems[type] === itemId ? SELECTED_CELL_STYLE : '',
        f: db.items[itemId].closet_image_url
      };
    }),
    e: isSelected && {
      $s: _xvdomSpec4,
      a: !isEmptySelection(selectedItems) && {
        $s: _xvdomSpec2,
        a: bindSend('handleRemoveCombosWithSelected')
      },
      c: CATEGORIES.map(function (cat) {
        return {
          $s: _xvdomSpec3,
          a: function a() {
            return onAddToCategory(outfitId, cat);
          },
          c: cat
        };
      })
    }
  };
};

OutfitRow.state = {
  onInit: function onInit(_ref2) {
    var props = _ref2.props;
    return {
      selectedItems: EMPTY_SELECTED_ITEM_IDS
    };
  },
  onProps: function onProps(_ref3) {
    var _ref3$props = _ref3.props,
        selectedOutfitId = _ref3$props.selectedOutfitId,
        outfit = _ref3$props.outfit,
        outfitId = _ref3$props.outfitId,
        state = _ref3.state;
    return {
      selectedItems: selectedOutfitId === outfitId ? state.selectedItems : EMPTY_SELECTED_ITEM_IDS
    };
  },
  handleSelectItem: function handleSelectItem(_ref4, _ref5) {
    var props = _ref4.props,
        selectedItems = _ref4.state.selectedItems;
    var currentTarget = _ref5.currentTarget;
    var itemId = currentTarget.itemId,
        itemType = currentTarget.itemType;

    setTimeout(function () {
      return props.onSelect(props.outfitId);
    });
    return {
      selectedItems: _extends({}, selectedItems, defineProperty({}, itemType, selectedItems[itemType] === 0 ? +itemId : 0))
    };
  }
};

var OutfitList = function OutfitList(_ref6) {
  var _ref6$props = _ref6.props,
      db = _ref6$props.db,
      outfits = _ref6$props.outfits,
      _ref6$state = _ref6.state,
      page = _ref6$state.page,
      selectedOutfitId = _ref6$state.selectedOutfitId,
      bindSend = _ref6.bindSend;
  return {
    $s: _xvdomSpec7,
    a: { borderCollapse: 'collapse' },
    c: outfits.slice(0, PAGE_SIZE).map(function (outfitId) {
      return {
        $s: _xvdomSpec6,
        a: db,
        b: outfitId,
        c: db.outfits[outfitId],
        d: selectedOutfitId,
        e: bindSend('handleSelectOutfit'),
        f: function f() {}
      };
    })
  };
};

var onInit = function onInit(_ref7) {
  var props = _ref7.props,
      state = _ref7.state;
  return {
    page: 0,
    selectedOutfitId: 0
  };
};

OutfitList.state = {
  onInit: onInit,
  onProps: onInit,

  handleSelectOutfit: function handleSelectOutfit(_ref8, outfitId) {
    var state = _ref8.state;
    return _extends({}, state, {
      selectedOutfitId: outfitId
    });
  },

  handleSelectItem: function handleSelectItem(_ref9, event) {
    var state = _ref9.state;
    var currentTarget = event.currentTarget;

    if (!currentTarget) return;

    var selectedOutfitId = +currentTarget.parentNode.outfitId;
    var selectedItemType = currentTarget.itemType;
    var selectedItem = +currentTarget.itemId;
    var selectedItemIds = void 0;
    if (selectedOutfitId !== state.selectedOutfitId) {
      selectedItemIds = defineProperty({}, selectedItemType, selectedItem);
    } else {
      selectedItemIds = state.selectedItemIds;
      selectedItemIds[selectedItemType] = selectedItemIds[selectedItemType] ? null : selectedItem;
    }

    _this.setState(_extends({}, state, {
      selectedOutfitId: selectedOutfitId,
      selectedItemIds: selectedItemIds
    }));

    event.stopPropagation();
  }
};

function toggleSignIn() {
  if (firebase.auth().currentUser) {
    User.unsetCurrent();
    return firebase.auth().signOut();
  }

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  firebase.auth().signInWithPopup(provider).catch(function (error) {
    return console.error(error);
  });
}

var App = function App(_ref10) {
  var user = _ref10.user,
      db = _ref10.db;
  return {
    $s: _xvdomSpec9,
    a: user && user.displayName,
    c: user && db && {
      $s: _xvdomSpec8,
      a: db,
      b: user.uncategorized
    },
    e: toggleSignIn,
    g: user ? 'Sign out' : 'Sign in'
  };
};

var renderApp = function renderApp(user, db) {
  return {
    $s: _xvdomSpec10,
    a: user,
    b: db
  };
};

firebase.initializeApp({
  apiKey: "AIzaSyB0wl7pEwIcb9VzHluaAQAZhOe1huyPxi8",
  authDomain: "outfit-knockout.firebaseapp.com",
  databaseURL: "https://outfit-knockout.firebaseio.com",
  storageBucket: "outfit-knockout.appspot.com",
  messagingSenderId: "60167804767"
});

DB.get().then(function (db) {
  document.body = xvdom.render(renderApp(User.current(), db));

  firebase.auth().onAuthStateChanged(function (authUser) {
    if (!authUser) return xvdom.rerender(document.body, renderApp(null, null));

    // Get or create user information
    User.get(authUser.uid).catch(function () {
      return User.save({
        // Couldn't find existing user w/authId, so create a new User
        id: authUser.uid,
        displayName: authUser.displayName,
        excludedCombos: {},
        uncategorized: Object.keys(db.outfits),
        yup: [],
        nope: [],
        maybe: []
      });
    }).then(function (user) {
      User.setCurrent(user.id);
      xvdom.rerender(document.body, renderApp(user, db));
    });
  });
});

}());
