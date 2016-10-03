var TICKER = (function () {
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

// https://esbench.com/bench/57f1459d330ab09900a1a1dd
function dynamicType(value) {
  if (value instanceof Object) {
    return value instanceof Array ? 'array' : 'object';
  }

  return value == null || value === true || value === false ? 'empty' : 'text';
}

// Creates an empty object with no built in properties (ie. `constructor`).
function Hash() {}
Hash.prototype = Object.create(null);

var EMPTY_PROPS = new Hash();
var DEADPOOL = {
  push: function push() {},
  pop: function pop() {}
};

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
var createEmptyTextNode = function createEmptyTextNode() {
  return createTextNode('');
};

var replaceNode = function replaceNode(oldNode, newNode) {
  var parentNode = oldNode.parentNode;
  if (parentNode) parentNode.replaceChild(newNode, oldNode);
};

var insertBefore = function insertBefore(parentNode, node, beforeNode) {
  return beforeNode ? parentNode.insertBefore(node, beforeNode) : parentNode.appendChild(node);
};

var unmountInstance = function unmountInstance(inst, parentNode) {
  recycle(inst);
  parentNode.removeChild(inst.$n);
};

var removeArrayNodes = function removeArrayNodes(array, parentNode) {
  var length = array.length;
  var i = 0;

  while (i < length) {
    unmountInstance(array[i++], parentNode);
  }
};

var removeArrayNodesOnlyChild = function removeArrayNodesOnlyChild(array, parentNode) {
  var length = array.length;
  var i = 0;

  while (i < length) {
    recycle(array[i++]);
  }
  parentNode.textContent = '';
};

var internalRerenderInstance = function internalRerenderInstance(inst, prevInst) {
  return prevInst.$s === inst.$s && (inst.$s.u(inst, prevInst), true);
};

var renderArrayToParentBefore = function renderArrayToParentBefore(parentNode, array, length, markerNode) {
  var i = 0;

  while (i < length) {
    insertBefore(parentNode, (array[i] = internalRender(array[i])).$n, markerNode);
    ++i;
  }
};

var renderArrayToParent = function renderArrayToParent(parentNode, array, length) {
  var i = 0;

  while (i < length) {
    parentNode.appendChild((array[i] = internalRender(array[i])).$n);
    ++i;
  }
};

var rerenderArray_reconcileWithMap = function rerenderArray_reconcileWithMap(parentNode, array, oldArray, startIndex, endIndex, oldStartItem, oldStartIndex, oldEndItem, oldEndIndex) {
  var oldListNodeKeyMap = new Map();
  var insertBeforeNode = oldEndItem.$n;
  var item = void 0,
      key = void 0,
      startItem = void 0;

  while (oldStartIndex <= oldEndIndex) {
    item = oldArray[oldStartIndex++];
    oldListNodeKeyMap.set(item.key, item);
  }

  while (startIndex <= endIndex) {
    startItem = array[startIndex];
    key = startItem.key;
    item = oldListNodeKeyMap.get(key);

    if (item) {
      if (item === oldEndItem) insertBeforeNode = insertBeforeNode.nextSibling;
      oldListNodeKeyMap.delete(key);
      startItem = internalRerender(item, startItem);
    } else {
      startItem = internalRender(startItem);
    }
    array[startIndex] = startItem;
    insertBefore(parentNode, startItem.$n, insertBeforeNode);
    ++startIndex;
  }

  oldListNodeKeyMap.forEach(function (value) {
    unmountInstance(value, parentNode);
  });
};

var rerenderArray_afterReconcile = function rerenderArray_afterReconcile(parentNode, array, oldArray, startIndex, startItem, endIndex, endItem, oldStartIndex, oldStartItem, oldEndIndex, oldEndItem, insertBeforeNode) {
  if (oldStartIndex > oldEndIndex) {
    while (startIndex <= endIndex) {
      startItem = array[startIndex];
      insertBefore(parentNode, (array[startIndex] = internalRender(startItem)).$n, insertBeforeNode);
      ++startIndex;
    }
  } else if (startIndex > endIndex) {
    while (oldStartIndex <= oldEndIndex) {
      unmountInstance(oldArray[oldStartIndex++], parentNode);
    }
  } else {
    rerenderArray_reconcileWithMap(parentNode, array, oldArray, startIndex, endIndex, oldStartItem, oldStartIndex, oldEndItem, oldEndIndex);
  }
};

var rerenderArray_reconcile = function rerenderArray_reconcile(parentNode, array, endIndex, oldArray, oldEndIndex, markerNode) {
  var oldStartIndex = 0;
  var startIndex = 0;
  var successful = true;
  var startItem = array[0];
  var oldStartItem = oldArray[0];
  var insertBeforeNode = markerNode;
  var oldEndItem = void 0,
      endItem = void 0,
      node = void 0;
  endIndex--;
  oldEndIndex--;

  outer: while (successful && oldStartIndex <= oldEndIndex && startIndex <= endIndex) {
    successful = false;

    while (oldStartItem.key === startItem.key) {
      array[startIndex] = internalRerender(oldStartItem, startItem);

      oldStartIndex++;startIndex++;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      } else {
        oldStartItem = oldArray[oldStartIndex];
        startItem = array[startIndex];
        successful = true;
      }
    }

    oldEndItem = oldArray[oldEndIndex];
    endItem = array[endIndex];

    while (oldEndItem.key === endItem.key) {
      insertBeforeNode = (array[endIndex] = internalRerender(oldEndItem, endItem)).$n;

      oldEndIndex--;endIndex--;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      } else {
        oldEndItem = oldArray[oldEndIndex];
        endItem = array[endIndex];
        successful = true;
      }
    }

    while (oldStartItem.key === endItem.key) {
      node = (array[endIndex] = internalRerender(oldStartItem, endItem)).$n;

      if (oldEndItem.key !== endItem.key) {
        insertBeforeNode = insertBefore(parentNode, node, insertBeforeNode);
      }
      oldStartIndex++;endIndex--;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      } else {
        oldStartItem = oldArray[oldStartIndex];
        endItem = array[endIndex];
        successful = true;
      }
    }

    while (oldEndItem.key === startItem.key) {
      insertBefore(parentNode, (array[startIndex] = internalRerender(oldEndItem, startItem)).$n, oldStartItem.$n);

      oldEndIndex--;startIndex++;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      } else {
        oldEndItem = oldArray[oldEndIndex];
        startItem = array[startIndex];
        successful = true;
      }
    }
  }

  if (startIndex <= endIndex || oldStartIndex <= oldEndIndex) {
    rerenderArray_afterReconcile(parentNode, array, oldArray, startIndex, startItem, endIndex, endItem, oldStartIndex, oldStartItem, oldEndIndex, oldEndItem, insertBeforeNode);
  }
};

var rerenderArray = function rerenderArray(markerNode, array, oldArray) {
  var parentNode = markerNode.parentNode;
  var length = array.length;
  var oldLength = oldArray.length;
  if (!length) {
    removeArrayNodes(oldArray, parentNode);
  } else if (!oldLength) {
    renderArrayToParentBefore(parentNode, array, length, markerNode);
  } else {
    rerenderArray_reconcile(parentNode, array, length, oldArray, oldLength, markerNode);
  }
};

var rerenderArrayOnlyChild = function rerenderArrayOnlyChild(parentNode, array, oldArray) {
  var length = array.length;
  var oldLength = oldArray.length;
  if (!length) {
    removeArrayNodesOnlyChild(oldArray, parentNode);
  } else if (!oldLength) {
    renderArrayToParent(parentNode, array, length);
  } else {
    rerenderArray_reconcile(parentNode, array, length, oldArray, oldLength, null);
  }
};

var rerenderText = function rerenderText(value, contextNode, isOnlyChild) {
  if (value instanceof Object) {
    return rerenderDynamic(isOnlyChild, value, contextNode);
  }

  contextNode.nodeValue = value == null || value === true || value === false ? '' : value;
  return contextNode;
};

var rerenderDynamic = function rerenderDynamic(isOnlyChild, value, contextNode) {
  var node = createDynamic(isOnlyChild, contextNode.parentNode, value);
  replaceNode(contextNode, node);
  return node;
};

var rerenderInstance = function rerenderInstance(value, node, isOnlyChild, prevValue) {
  var prevRenderedInstance = void 0;
  if (value && internalRerenderInstance(value, prevRenderedInstance = prevValue.$r || prevValue)) {
    value.$r = prevRenderedInstance;
    return node;
  }

  return rerenderDynamic(isOnlyChild, value, node);
};

// TODO: Figure out whether we're using all these arguments
var rerenderComponent = function rerenderComponent(component, props, componentInstance, instance, componentInstanceProp) {
  var newCompInstance = component(props || EMPTY_PROPS);
  if (!internalRerenderInstance(newCompInstance, componentInstance)) {
    replaceNode(componentInstance.$n, (instance[componentInstanceProp] = internalRender(newCompInstance)).$n);
  }
};

var rerenderArrayMaybe = function rerenderArrayMaybe(array, contextNode, isOnlyChild, oldArray) {
  var markerNode = contextNode.xvdomContext;

  if (array instanceof Array) {
    if (isOnlyChild) {
      rerenderArrayOnlyChild(markerNode, array, oldArray);
    } else {
      rerenderArray(markerNode, array, oldArray);
    }
    return contextNode;
  } else {
    if (isOnlyChild) {
      removeArrayNodesOnlyChild(oldArray, markerNode);
      return markerNode.appendChild(createDynamic(true, markerNode, array));
    } else {
      removeArrayNodes(oldArray, markerNode.parentNode);
      return rerenderDynamic(false, array, markerNode);
    }
  }
};

var rerenderStatefulComponent = function rerenderStatefulComponent(component, newProps, api) {
  var _onProps = api._onProps;
  var props = api.props;

  api.props = newProps;

  if (_onProps) componentSend(component, api, _onProps, props);else componentRerender(component, api);
};

var createArray = function createArray(value, parentNode, isOnlyChild) {
  var node = document.createDocumentFragment();
  renderArrayToParent(node, value, value.length);
  node.xvdomContext = isOnlyChild ? parentNode : node.appendChild(createTextNode(''));
  return node;
};

var componentRerender = function componentRerender(component, api) {
  var instance = internalRerender(api._instance, component(api));
  api._instance = instance;
  instance.$n.xvdom = api._parentInst;
};

var componentSend = function componentSend(component, api, actionFn, context) {
  // TODO: process.ENV === 'development', console.error(`Action not found #{action}`);
  if (!actionFn) return;

  var newState = actionFn(api, context);
  if (newState !== api.state) {
    api.state = newState;
    componentRerender(component, api);
  }
};

var createStatefulComponent = function createStatefulComponent(component, props, instance, rerenderFuncProp, componentInstanceProp, actions) {
  var boundActions = new Hash();

  var api = {
    _onProps: actions.onProps,
    _parentInst: instance,

    props: props,
    bindSend: function bindSend(action) {
      return boundActions[action] || (boundActions[action] = function (context) {
        componentSend(component, api, actions[action], context);
      });
    }
  };

  //TODO: process.ENV === 'development', console.error(`Stateful components require atleast an 'onInit' function to provide the initial state (see)`);
  api.state = actions.onInit(api);

  instance[rerenderFuncProp] = rerenderStatefulComponent;
  instance[componentInstanceProp] = api;
  return internalRenderNoRecycle(api._instance = component(api));
};

var createNoStateComponent = function createNoStateComponent(component, props, instance, rerenderFuncProp, componentInstanceProp) {
  instance[rerenderFuncProp] = rerenderComponent;
  return internalRenderNoRecycle(instance[componentInstanceProp] = component(props));
};

var createComponent = function createComponent(component, actions, props, instance, rerenderFuncProp, componentInstanceProp) {
  var createFn = actions ? createStatefulComponent : createNoStateComponent;
  return createFn(component, props || EMPTY_PROPS, instance, rerenderFuncProp, componentInstanceProp, actions);
};

var internalRenderNoRecycle = function internalRenderNoRecycle(instance) {
  var node = instance.$s.c(instance);
  instance.$n = node;
  node.xvdom = instance;
  return node;
};

var internalRender = function internalRender(instance) {
  var spec = instance.$s;
  var recycledInstance = spec.r.pop(instance.key);
  if (recycledInstance) {
    spec.u(instance, recycledInstance);
    return recycledInstance;
  } else {
    internalRenderNoRecycle(instance);
    return instance;
  }
};

var CREATE_BY_TYPE = {
  text: createTextNode,
  object: internalRenderNoRecycle,
  array: createArray,
  empty: createEmptyTextNode
};

function createDynamic(isOnlyChild, parentNode, value) {
  return CREATE_BY_TYPE[dynamicType(value)](value, parentNode, isOnlyChild);
}

var UPDATE_BY_TYPE = {
  text: rerenderText,
  object: rerenderInstance,
  array: rerenderArrayMaybe,
  empty: rerenderText
};

var updateDynamic = function updateDynamic(isOnlyChild, oldValue, value, contextNode) {
  return UPDATE_BY_TYPE[dynamicType(oldValue)](value, contextNode, isOnlyChild, oldValue);
};

var render = function render(instance) {
  return internalRender(instance).$n;
};

var internalRerender = function internalRerender(prevInstance, instance) {
  if (internalRerenderInstance(instance, prevInstance)) return prevInstance;

  instance = internalRender(instance);
  replaceNode(prevInstance.$n, instance.$n);
  recycle(prevInstance);
  return instance;
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
  updateDynamic: updateDynamic,
  Pool: Pool,
  DEADPOOL: DEADPOOL
};

// Internal API

var _xvdomEl$3 = xvdom.el;
var _xvdomSpec$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$3('img');

    _n.className = 'Avatar';
    inst.b = _n;
    _n.onerror = inst.a;
    _n.src = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onerror = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.src = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
var onerror = function onerror(_ref) {
  var target = _ref.target;
  target.src = EMPTY_IMAGE;
};

var Avatar = (function (_ref2) {
  var avatarUrl = _ref2.avatarUrl;
  return {
    $s: _xvdomSpec$3,
    a: onerror,
    c: avatarUrl + 'v=3&s=32'
  };
});

var _xvdomEl$4 = xvdom.el;
var _xvdomSpec$4 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('i');

    inst.b = _n;
    _n.className = inst.a;
    _n.onclick = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.onclick = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Icon = (function (_ref) {
  var className = _ref.className;
  var name = _ref.name;
  var onClick = _ref.onClick;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 'med' : _ref$size;
  return {
    $s: _xvdomSpec$4,
    a: 'Icon Icon--' + size + ' octicon octicon-' + name + ' ' + className + ' t-center',
    c: onClick
  };
});

var _xvdomCreateComponent$2 = xvdom.createComponent;
var _xvdomCreateDynamic$2 = xvdom.createDynamic;
var _xvdomEl$2 = xvdom.el;
var _xvdomUpdateDynamic$2 = xvdom.updateDynamic;
var _xvdomSpec4$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('div');

    inst.b = _n;
    _n.className = inst.a;
    _n.hidden = inst.c;

    _n.appendChild(inst.e = _xvdomCreateDynamic$2(true, _n, inst.d));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.hidden = v;
      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$2(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('a'),
        _n2,
        _n3;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;

    _n.appendChild(inst.e = _xvdomCreateDynamic$2(false, _n, inst.d));

    _n2 = _xvdomEl$2('div');
    _n2.className = 'l-margin-l3';

    _n2.appendChild(inst.g = _xvdomCreateDynamic$2(false, _n2, inst.f));

    _n3 = _xvdomEl$2('div');
    _n3.className = 't-light t-font-size-14 c-gray-dark';
    inst.i = _n3;
    _n3.textContent = inst.h;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$2(false, pInst.d, pInst.d = inst.d, pInst.e);
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic$2(false, pInst.f, pInst.f = inst.f, pInst.g);
    }

    v = inst.h;

    if (v !== pInst.h) {
      pInst.i.textContent = v;
      pInst.h = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$2 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$2(Icon, Icon.state, {
      name: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Icon, {
        name: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$2 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$2(Avatar, Avatar.state, {
      avatarUrl: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Avatar, {
        avatarUrl: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
function renderItem(el) {
  var item = this.item;
  var context = this.context;
  var listClass = this.listClass;

  var _item = item(el, context);

  var href = _item.href;
  var key = _item.key;
  var avatarUrl = _item.avatarUrl;
  var icon = _item.icon;
  var text = _item.text;
  var secondaryText = _item.secondaryText;

  return {
    $s: _xvdomSpec3$2,
    a: listClass,
    c: href,
    d: avatarUrl ? {
      $s: _xvdomSpec$2,
      a: avatarUrl
    } : {
      $s: _xvdomSpec2$2,
      a: icon
    },
    f: text,
    h: secondaryText,
    key: key
  };
}

var List = (function (_ref) {
  var className = _ref.className;
  var context = _ref.context;
  var list = _ref.list;
  var item = _ref.item;
  var itemClass = _ref.itemClass;
  var transform = _ref.transform;

  var listClass = 'List-item layout horizontal center t-normal ' + (itemClass || '');
  list = list || [];
  if (transform) list = transform(list);
  return {
    $s: _xvdomSpec4$2,
    a: className,
    c: !list.length,
    d: list.map(renderItem, { item: item, context: context, listClass: listClass })
  };
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

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _xvdomCreateDynamic$3 = xvdom.createDynamic;
var _xvdomEl$5 = xvdom.el;
var _xvdomUpdateDynamic$3 = xvdom.updateDynamic;
var _xvdomSpec$5 = {
  c: function c(inst) {
    var _n = _xvdomEl$5('a'),
        _n2;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    _n2 = _xvdomEl$5('span');
    _n2.className = 'c-gray-dark t-light';
    inst.e = _n2;
    _n2.textContent = inst.d;

    _n.appendChild(_n2);

    _n.appendChild(inst.g = _xvdomCreateDynamic$3(false, _n, inst.f));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.e.textContent = v;
      pInst.d = v;
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic$3(false, pInst.f, pInst.f = inst.f, pInst.g);
    }
  },
  r: xvdom.DEADPOOL
};
var SourceName = (function (_ref) {
  var className = _ref.className;
  var displayName = _ref.displayName;

  var _displayName$split = displayName.split('/');

  var _displayName$split2 = slicedToArray(_displayName$split, 2);

  var owner = _displayName$split2[0];
  var repo = _displayName$split2[1];

  return {
    $s: _xvdomSpec$5,
    a: 't-normal ' + (className || ''),
    c: '#github/' + displayName,
    d: repo ? owner + '/' : '',
    f: repo || owner
  };
});

var compare = (function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
});

var _xvdomCreateComponent$1 = xvdom.createComponent;
var _xvdomCreateDynamic$1 = xvdom.createDynamic;
var _xvdomEl$1 = xvdom.el;
var _xvdomUpdateDynamic$1 = xvdom.updateDynamic;
var _xvdomSpec4$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div');

    inst.b = _n;
    _n.className = inst.a;

    _n.appendChild(inst.d = _xvdomCreateDynamic$1(true, _n, inst.c));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$1(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div'),
        _n2;

    _n.className = 'List-item List-item--noDivider layout horizontal center';
    inst.b = _n;
    _n.onclick = inst.a;
    _n2 = _xvdomCreateComponent$1(Icon, Icon.state, {
      name: 'mark-github'
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('span');
    _n2.className = 'l-margin-l4';
    _n2.textContent = 'Login with GitHub';

    _n.appendChild(_n2);

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
var _xvdomSpec2$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div'),
        _n2,
        _n3;

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--noDivider layout horizontal center';
    _n3 = _xvdomCreateComponent$1(Avatar, Avatar.state, {
      avatarUrl: inst.a
    }, inst, 'b', 'c');

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$1('span');
    _n3.className = 'l-margin-l4';
    inst.e = _n3;
    _n3.textContent = inst.d;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--header';

    _n2.appendChild(document.createTextNode(('REPOSITORIES') || ''));

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$1(List, List.state, {
      item: inst.f,
      itemClass: 'List-item--noDivider',
      list: inst.g,
      transform: inst.h
    }, inst, 'i', 'j');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--header';

    _n2.appendChild(document.createTextNode(('USERS / ORGS') || ''));

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$1(List, List.state, {
      item: inst.k,
      itemClass: 'List-item--noDivider',
      list: inst.l,
      transform: inst.m
    }, inst, 'n', 'o');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('a');
    _n2.className = 'List-item List-item--header l-padding-b4';
    inst.q = _n2;
    _n2.onclick = inst.p;

    _n2.appendChild(document.createTextNode(('LOGOUT') || ''));

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Avatar, {
        avatarUrl: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.e.textContent = v;
      pInst.d = v;
    }

    if (inst.g !== pInst.g || inst.f !== pInst.f || inst.h !== pInst.h) {
      pInst.i(List, {
        item: inst.f,
        itemClass: 'List-item--noDivider',
        list: inst.g,
        transform: inst.h
      }, pInst.j, pInst, 'j');
      pInst.f = inst.f;
      pInst.g = inst.g;
      pInst.h = inst.h;
    }

    if (inst.l !== pInst.l || inst.k !== pInst.k || inst.m !== pInst.m) {
      pInst.n(List, {
        item: inst.k,
        itemClass: 'List-item--noDivider',
        list: inst.l,
        transform: inst.m
      }, pInst.o, pInst, 'o');
      pInst.k = inst.k;
      pInst.l = inst.l;
      pInst.m = inst.m;
    }

    v = inst.p;

    if (v !== pInst.p) {
      pInst.q.onclick = v;
      pInst.p = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$1 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$1(SourceName, SourceName.state, {
      displayName: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(SourceName, {
        displayName: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var userAvatarUrl = function userAvatarUrl(username) {
  return 'https://github.com/' + username + '.png?size=32';
};
var sort = function sort(a, b) {
  return compare(a.sortKey, b.sortKey);
};
var renderData = function renderData(_ref) {
  var id = _ref.id;

  var _id$split = id.split('/');

  var _id$split2 = slicedToArray(_id$split, 2);

  var owner = _id$split2[0];
  var name = _id$split2[1];

  return {
    id: id,
    avatarUrl: userAvatarUrl(owner),
    sortKey: (name || owner).toLowerCase()
  };
};
var sortSources = function sortSources(sources) {
  return sources.map(renderData).sort(sort);
};

var item = function item(_ref2) {
  var id = _ref2.id;
  var avatarUrl = _ref2.avatarUrl;
  return {
    href: '#github/' + id,
    avatarUrl: avatarUrl,
    key: id,
    text: {
      $s: _xvdomSpec$1,
      a: id
    }
  };
};

var logout = function logout() {
  window.localStorage.clear();
  window.location.reload();
};

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
var lazyRenderContents = false;
var AppDrawer = (function (_ref3) {
  var user = _ref3.user;
  var enabled = _ref3.enabled;
  var onLogin = _ref3.onLogin;

  lazyRenderContents = enabled || lazyRenderContents;
  var enabledClass = enabled ? 'is-enabled' : '';
  var renderedClass = lazyRenderContents ? 'is-rendered' : '';
  return {
    $s: _xvdomSpec4$1,
    a: 'AppDrawer fixed scroll ' + enabledClass + ' ' + renderedClass,
    c: lazyRenderContents && (user ? {
      $s: _xvdomSpec2$1,
      a: userAvatarUrl(user.githubUsername),
      d: user.githubUsername,
      f: item,
      g: user.sources.github.repos,
      h: sortSources,
      k: item,
      l: user.sources.github.users,
      m: sortSources,
      p: logout
    } : {
      $s: _xvdomSpec3$1,
      a: onLogin
    })
  };
});

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
    return JSON.parse(this.getItem(key) || null);
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
  var url = _ref.url;
  var cache = _ref.cache;
  var _ref$transform = _ref.transform;
  var transform = _ref$transform === undefined ? identity : _ref$transform;
  return loadJSON(url).then(transform).then(!cache ? identity : function (obj) {
    return storage.setItemObj(cache, obj);
  });
};

var model = (function (_ref2) {
  var g = _ref2.get;
  var q = _ref2.query;
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

var GithubRepo = model({
  query: function query(_ref) {
    var term = _ref.term;
    var id = _ref.id;
    return term != null ? {
      url: 'https://api.github.com/search/repositories?q=' + term + '&per_page=5',
      transform: function transform(d) {
        return d.items;
      }
    } : id ? { url: 'https://api.github.com/users/' + id + '/repos' } : null;
  }
});

var GithubUser = model({
  query: function query(_ref) {
    var term = _ref.term;
    return {
      url: 'https://api.github.com/search/users?q=' + term + '&per_page=5',
      transform: function transform(d) {
        return d.items;
      }
    };
  }
});

var _xvdomCreateComponent$3 = xvdom.createComponent;
var _xvdomEl$6 = xvdom.el;
var _xvdomSpec2$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$6('div'),
        _n2,
        _n3,
        _n4;

    inst.b = _n;
    _n.className = inst.a;
    _n2 = _xvdomEl$6('div');
    _n2.className = 'AppSearch-searchInputContainer';
    _n3 = _xvdomEl$6('div');
    _n3.className = 'AppSearch-inkdrop fit';

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$6('div');
    _n3.className = 'AppSearch-searchBar layout horizontal';
    _n4 = _xvdomEl$6('input');
    _n4.className = 'AppSearch-searchInput flex l-padding-h4';
    inst.d = _n4;
    _n4.oninput = inst.c;
    _n4.placeholder = 'Search repositories or users\u2026';
    _n4.type = 'text';
    if (inst.e != null) _n4.value = inst.e;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$3(List, List.state, {
      className: 'AppSearch-searchResults',
      item: inst.f,
      itemClass: 'List-item--noDivider',
      list: inst.g
    }, inst, 'h', 'i');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.oninput = v;
      pInst.c = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      if (pInst.d.value !== v) {
        pInst.d.value = v;
      }

      pInst.e = v;
    }

    if (inst.f !== pInst.f || inst.g !== pInst.g) {
      pInst.h(List, {
        className: 'AppSearch-searchResults',
        item: inst.f,
        itemClass: 'List-item--noDivider',
        list: inst.g
      }, pInst.i, pInst, 'i');
      pInst.f = inst.f;
      pInst.g = inst.g;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$6 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$3(SourceName, SourceName.state, {
      displayName: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(SourceName, {
        displayName: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var item$1 = function item$1(_ref) {
  var avatar_url = _ref.avatar_url;
  var full_name = _ref.full_name;
  var id = _ref.id;
  var login = _ref.login;
  var owner = _ref.owner;
  return {
    href: '#github/' + (login || full_name),
    avatarUrl: avatar_url || owner && owner.avatar_url,
    key: id,
    text: {
      $s: _xvdomSpec$6,
      a: login || full_name
    }
  };
};

var AppSearch = function AppSearch(_ref2) {
  var enabled = _ref2.props.enabled;
  var _ref2$state = _ref2.state;
  var searchResults = _ref2$state.searchResults;
  var term = _ref2$state.term;
  var bindSend = _ref2.bindSend;
  return {
    $s: _xvdomSpec2$3,
    a: 'AppSearch l-padding-2 fixed fixed--top ' + (enabled ? 'is-enabled' : ''),
    c: bindSend('onSearchInput'),
    e: term,
    f: item$1,
    g: searchResults
  };
};

var onInit$1 = function onInit$1() {
  return { term: '', searchResults: [] };
};

AppSearch.state = {
  onInit: onInit$1,
  onProps: onInit$1,
  onSearchInput: function onSearchInput(_ref3, event) {
    var state = _ref3.state;
    var bindSend = _ref3.bindSend;
    return _extends({}, state, {
      curSearch: (clearTimeout(state.curSearch), setTimeout(bindSend('doSearch'), 300)),
      term: event.target.value
    });
  },
  doSearch: function doSearch(_ref4) {
    var state = _ref4.state;
    var bindSend = _ref4.bindSend;
    return Promise.all([GithubRepo.query(state), GithubUser.query(state)]).then(bindSend('onSearchResults')), _extends({}, state, { curSearch: null });
  },
  onSearchResults: function onSearchResults(_ref5, _ref6) {
    var state = _ref5.state;

    var _ref7 = slicedToArray(_ref6, 2);

    var repos = _ref7[0];
    var users = _ref7[1];
    return _extends({}, state, {
      searchResults: (repos || []).concat(users || []).sort(function (a, b) {
        return b.score - a.score;
      }).slice(0, 5)
    });
  }
};

var MIN_MS = 1000 * 60;
var HOUR_MS = MIN_MS * 60;
var DAY_MS = HOUR_MS * 24;
var WEEK_MS = DAY_MS * 7;

var timeAgoNow = Date.now();
// Update every 5 min
setInterval(function () {
  return timeAgoNow = Date.now();
}, MIN_MS * 5);

var timeAgo = (function (dateTime) {
  var diffms = timeAgoNow - dateTime;
  return diffms > WEEK_MS ? ~~(diffms / WEEK_MS) + ' weeks' : diffms > DAY_MS ? ~~(diffms / DAY_MS) + ' days' : diffms > HOUR_MS ? ~~(diffms / HOUR_MS) + ' hours' : diffms > MIN_MS ? ~~(diffms / MIN_MS) + ' minutes' : '1 minute';
});

var _xvdomCreateComponent$8 = xvdom.createComponent;
var _xvdomCreateDynamic$7 = xvdom.createDynamic;
var _xvdomEl$10 = xvdom.el;
var _xvdomUpdateDynamic$7 = xvdom.updateDynamic;
var _xvdomSpec$11 = {
  c: function c(inst) {
    var _n = _xvdomEl$10('a'),
        _n2,
        _n3,
        _n4;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    _n2 = _xvdomCreateComponent$8(Avatar, Avatar.state, {
      avatarUrl: inst.d
    }, inst, 'e', 'f');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$10('div');
    _n2.className = 'l-margin-l2';
    _n3 = _xvdomEl$10('div');
    _n3.className = 't-normal';

    _n3.appendChild(inst.h = _xvdomCreateDynamic$7(false, _n3, inst.g));

    _n4 = _xvdomEl$10('span');
    _n4.className = 'c-gray-dark l-margin-l1 t-light';
    inst.j = _n4;
    _n4.textContent = inst.i;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$10('div');
    _n3.className = 'c-gray-dark t-font-size-10';
    inst.l = _n3;
    _n3.textContent = inst.k;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e(Avatar, {
        avatarUrl: inst.d
      }, pInst.f, pInst, 'f');
      pInst.d = inst.d;
    }

    if (inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateDynamic$7(false, pInst.g, pInst.g = inst.g, pInst.h);
    }

    v = inst.i;

    if (v !== pInst.i) {
      pInst.j.textContent = v;
      pInst.i = v;
    }

    v = inst.k;

    if (v !== pInst.k) {
      pInst.l.textContent = v;
      pInst.k = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Actor = (function (_ref) {
  var _ref$user = _ref.user;
  var login = _ref$user.login;
  var avatar_url = _ref$user.avatar_url;
  var action = _ref.action;
  var actionDate = _ref.actionDate;
  var className = _ref.className;
  return {
    $s: _xvdomSpec$11,
    a: 'layout horizontal center ' + className,
    c: '#github/' + login,
    d: avatar_url,
    g: login,
    i: action || '',
    k: timeAgo(Date.parse(actionDate)) + ' ago'
  };
});

var _xvdomCreateComponent$7 = xvdom.createComponent;
var _xvdomCreateDynamic$6 = xvdom.createDynamic;
var _xvdomEl$9 = xvdom.el;
var _xvdomUpdateDynamic$6 = xvdom.updateDynamic;
var _xvdomSpec2$7 = {
  c: function c(inst) {
    var _n = _xvdomEl$9('div'),
        _n2;

    _n.appendChild(inst.b = _xvdomCreateDynamic$6(false, _n, inst.a));

    _n2 = _xvdomCreateComponent$7(Actor, Actor.state, {
      action: inst.c,
      actionDate: inst.d,
      className: 'l-padding-l4',
      user: inst.e
    }, inst, 'f', 'g');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$6(false, pInst.a, pInst.a = inst.a, pInst.b);
    }

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.e !== pInst.e) {
      pInst.f(Actor, {
        action: inst.c,
        actionDate: inst.d,
        className: 'l-padding-l4',
        user: inst.e
      }, pInst.g, pInst, 'g');
      pInst.c = inst.c;
      pInst.d = inst.d;
      pInst.e = inst.e;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$10 = {
  c: function c(inst) {
    var _n = _xvdomEl$9('a'),
        _n2;

    _n.className = 'layout horizontal center l-padding-b4';
    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$7(Icon, Icon.state, {
      name: inst.c
    }, inst, 'd', 'e');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$9('div');
    _n2.className = 'flex l-padding-l2 t-truncate t-normal';
    inst.g = _n2;
    _n2.textContent = inst.f;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d(Icon, {
        name: inst.c
      }, pInst.e, pInst, 'e');
      pInst.c = inst.c;
    }

    v = inst.f;

    if (v !== pInst.f) {
      pInst.g.textContent = v;
      pInst.f = v;
    }
  },
  r: xvdom.DEADPOOL
};
var issuePRIcon = function issuePRIcon(_ref) {
  var pull_request = _ref.pull_request;
  return '' + (pull_request ? 'git-pull-request' : 'issue-opened');
};

var issuePRSubject = function issuePRSubject(_ref2) {
  var pull_request = _ref2.pull_request;
  var issue = _ref2.issue;
  return (pull_request || issue).title;
};

var issuePRSubjectUrl = function issuePRSubjectUrl(_ref3) {
  var name = _ref3.repo.name;
  var _ref3$payload = _ref3.payload;
  var number = _ref3$payload.number;
  var issue = _ref3$payload.issue;
  var pull_request = _ref3$payload.pull_request;
  return issue ? '#github/' + name + '?issues/' + (number || issue.number) : '#github/' + name + '?pulls/' + (number || pull_request.number);
};

var getSummary = function getSummary(event) {
  var payload = event.payload;

  switch (event.type) {
    case 'IssuesEvent':
    case 'PullRequestEvent':
      return {
        actorsAction: payload.action + ' this issue.',
        subjectIcon: issuePRIcon(payload),
        subject: issuePRSubject(payload),
        subjectUrl: issuePRSubjectUrl(event)
      };

    case 'ReleaseEvent':
      return {
        actorsAction: 'published this release.',
        subjectIcon: 'versions',
        subject: payload.release.name || payload.release.tag_name
      };

    case 'CreateEvent':
    case 'DeleteEvent':
      return {
        actorsAction: (event.type === 'CreateEvent' ? 'created' : 'deleted') + ' this ' + payload.ref_type + '.',
        subjectIcon: 'git-branch',
        subject: payload.ref_type === 'branch' ? payload.ref : event.repo.name
      };

    case 'IssueCommentEvent':
    case 'PullRequestReviewCommentEvent':
      return {
        actorsAction: 'commented…',
        subjectIcon: issuePRIcon(payload),
        subject: issuePRSubject(payload),
        subjectUrl: issuePRSubjectUrl(event)
      };

    case 'CommitCommentEvent':
      return {
        actorsAction: 'commented…',
        subjectIcon: 'git-commit',
        subject: payload.comment.commit_id,
        subjectUrl: '#github/' + event.repo.name + '?commits/' + payload.comment.commit_id
      };

    case 'PushEvent':
      return {
        actorsAction: 'pushed ' + payload.commits.length + ' commits...',
        subjectIcon: 'git-branch',
        subject: payload.ref.replace(/.*\//, '')
      };

    case 'TeamAddEvent':
      return {
        actorsAction: 'added the ' + payload.team.name + ' team.',
        subjectIcon: 'git-branch'
      };

    case 'ForkEvent':
      return { actorsAction: 'forked this repository.' };

    default:
      return {};
  }
};

var EventSummary = (function (_ref4) {
  var event = _ref4.event;

  var _getSummary = getSummary(event);

  var actorsAction = _getSummary.actorsAction;
  var subject = _getSummary.subject;
  var subjectIcon = _getSummary.subjectIcon;
  var subjectUrl = _getSummary.subjectUrl;

  return {
    $s: _xvdomSpec2$7,
    a: subject && {
      $s: _xvdomSpec$10,
      a: subjectUrl,
      c: subjectIcon,
      f: subject
    },
    c: actorsAction,
    d: event.created_at,
    e: event.actor
  };
});

var loadScript = (function (src, globalProp) {
  return new Promise(function (resolve) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = function () {
      resolve(globalProp && window[globalProp]);
    };
    document.head.appendChild(s);
  });
});

var syntaxPromises = {};

var loadSyntax = function loadSyntax(lang) {
  return syntaxPromises[lang] || (syntaxPromises[lang] = loadScript('../vendor/highlightjs/languages/' + lang + '.min.js'));
};

var loadHighlight = (function (lang) {
  return loadSyntax(lang).then(function () {
    return window.hljs;
  });
});

var FNAME_TO_SYNTAX = {
  'Gemfile.lock': 'ruby',
  'Gemfile': 'ruby',
  'Rakefile': 'ruby'
};

var EXT_TO_SYNTAX = {
  babelrc: 'json',
  eslintrc: 'json',
  gemspec: 'ruby',
  html: 'xml',
  js: 'javascript',
  jsx: 'javascript',
  md: 'markdown',
  rb: 'ruby',
  ts: 'typescript',
  yml: 'yaml',
  sh: 'bash'
};

var getSyntaxForFile = (function (fname) {
  var ext = (/\.([^.]*)$/.exec(fname) || [])[1];
  return ext ? EXT_TO_SYNTAX[ext] || ext : FNAME_TO_SYNTAX[fname];
});

var ALL_LANGUAGES = {
  "1c": true,
  "accesslog": true,
  "actionscript": true,
  "apache": true,
  "applescript": true,
  "arduino": true,
  "armasm": true,
  "asciidoc": true,
  "aspectj": true,
  "autohotkey": true,
  "autoit": true,
  "avrasm": true,
  "axapta": true,
  "bash": true,
  "basic": true,
  "brainfuck": true,
  "cal": true,
  "capnproto": true,
  "ceylon": true,
  "clojure-repl": true,
  "clojure": true,
  "cmake": true,
  "coffeescript": true,
  "cos": true,
  "cpp": true,
  "crmsh": true,
  "crystal": true,
  "cs": true,
  "csp": true,
  "css": true,
  "d": true,
  "dart": true,
  "delphi": true,
  "diff": true,
  "django": true,
  "dns": true,
  "dockerfile": true,
  "dos": true,
  "dts": true,
  "dust": true,
  "elixir": true,
  "elm": true,
  "erb": true,
  "erlang-repl": true,
  "erlang": true,
  "fix": true,
  "fortran": true,
  "fsharp": true,
  "gams": true,
  "gauss": true,
  "gcode": true,
  "gherkin": true,
  "glsl": true,
  "go": true,
  "golo": true,
  "gradle": true,
  "groovy": true,
  "haml": true,
  "handlebars": true,
  "haskell": true,
  "haxe": true,
  "hsp": true,
  "htmlbars": true,
  "http": true,
  "inform7": true,
  "ini": true,
  "irpf90": true,
  "java": true,
  "javascript": true,
  "json": true,
  "julia": true,
  "kotlin": true,
  "lasso": true,
  "less": true,
  "lisp": true,
  "livecodeserver": true,
  "livescript": true,
  "lua": true,
  "makefile": true,
  "markdown": true,
  "mathematica": true,
  "matlab": true,
  "maxima": true,
  "mel": true,
  "mercury": true,
  "mipsasm": true,
  "mizar": true,
  "mojolicious": true,
  "monkey": true,
  "nginx": true,
  "nimrod": true,
  "nix": true,
  "nsis": true,
  "objectivec": true,
  "ocaml": true,
  "openscad": true,
  "oxygene": true,
  "parser3": true,
  "perl": true,
  "pf": true,
  "php": true,
  "powershell": true,
  "processing": true,
  "profile": true,
  "prolog": true,
  "protobuf": true,
  "puppet": true,
  "python": true,
  "q": true,
  "qml": true,
  "r": true,
  "rib": true,
  "roboconf": true,
  "rsl": true,
  "ruby": true,
  "ruleslanguage": true,
  "rust": true,
  "scala": true,
  "scheme": true,
  "scilab": true,
  "scss": true,
  "smali": true,
  "smalltalk": true,
  "sml": true,
  "sqf": true,
  "sql": true,
  "stan": true,
  "stata": true,
  "step21": true,
  "stylus": true,
  "swift": true,
  "tcl": true,
  "tex": true,
  "thrift": true,
  "tp": true,
  "twig": true,
  "typescript": true,
  "vala": true,
  "vbnet": true,
  "vbscript-html": true,
  "vbscript": true,
  "verilog": true,
  "vhdl": true,
  "vim": true,
  "x86asm": true,
  "xl": true,
  "xml": true,
  "xquery": true,
  "yaml": true,
  "zephir": true
};

var getSyntaxForLanguage = function getSyntaxForLanguage(lang) {
  var syntax = EXT_TO_SYNTAX[lang] || lang;
  return ALL_LANGUAGES[syntax] && syntax;
};

var renderer = new window.marked.Renderer();
renderer.link = function (href, title, text) {
  return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
};

window.marked.setOptions({
  renderer: renderer,
  highlight: function highlight(code, lang, callback) {
    var syntax = getSyntaxForLanguage(lang);
    if (!syntax) return callback(null, code);

    loadHighlight(syntax).then(function (hljs) {
      callback(null, hljs.highlight(syntax, code).value);
    });
  }
});

var marked = (function (content, cb) {
  var result = null;
  if (content) {
    window.marked(content, function (err, r) {
      if (result === null) {
        result = r;
      } else {
        cb(r);
      }
    });
  }
  result = result || '';
  return result;
});

var _xvdomEl$11 = xvdom.el;
var _xvdomSpec$12 = {
  c: function c(inst) {
    var _n = _xvdomEl$11('div');

    inst.b = _n;
    _n.className = inst.a;
    _n.innerHTML = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.innerHTML = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Markup = function Markup(_ref) {
  var className = _ref.props.className;
  var state = _ref.state;
  return {
    $s: _xvdomSpec$12,
    a: 'Markup ' + className,
    c: state
  };
};

var onInit$2 = function onInit$2(_ref2) {
  var content = _ref2.props.content;
  var bindSend = _ref2.bindSend;
  return content ? marked(content, bindSend('loadMarkup')) : '';
};

Markup.state = {
  onInit: onInit$2,
  onProps: onInit$2,
  loadMarkup: function loadMarkup(component, contentHTML) {
    return contentHTML;
  }
};

var _xvdomCreateComponent$6 = xvdom.createComponent;
var _xvdomCreateDynamic$5 = xvdom.createDynamic;
var _xvdomEl$8 = xvdom.el;
var _xvdomUpdateDynamic$5 = xvdom.updateDynamic;
var _xvdomSpec3$4 = {
  c: function c(inst) {
    var _n = _xvdomEl$8('div'),
        _n2,
        _n3;

    _n.className = 'Card EventCard';
    _n2 = _xvdomCreateComponent$6(SourceName, SourceName.state, {
      className: 'Card-title',
      displayName: inst.a
    }, inst, 'b', 'c');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$8('div');
    _n2.className = 'Card-content';
    _n3 = _xvdomCreateComponent$6(EventSummary, EventSummary.state, {
      event: inst.d
    }, inst, 'e', 'f');

    _n2.appendChild(_n3);

    _n2.appendChild(inst.h = _xvdomCreateDynamic$5(false, _n2, inst.g));

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(SourceName, {
        className: 'Card-title',
        displayName: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }

    if (inst.d !== pInst.d) {
      pInst.e(EventSummary, {
        event: inst.d
      }, pInst.f, pInst, 'f');
      pInst.d = inst.d;
    }

    if (inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateDynamic$5(false, pInst.g, pInst.g = inst.g, pInst.h);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$6 = {
  c: function c(inst) {
    var _n = _xvdomEl$8('a'),
        _n2;

    _n.className = 'layout horizontal center l-padding-l4 l-padding-t4';
    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$6(Icon, Icon.state, {
      className: 'l-padding-r2 icon-24',
      name: 'git-commit'
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    _n.appendChild(inst.f = _xvdomCreateDynamic$5(false, _n, inst.e));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$5(false, pInst.e, pInst.e = inst.e, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$9 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$6(Markup, Markup.state, {
      className: 'l-padding-l4 l-padding-t4',
      content: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Markup, {
        className: 'l-padding-l4 l-padding-t4',
        content: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var renderEventAction = function renderEventAction(event) {
  switch (event.type) {
    case 'IssueCommentEvent':
    case 'PullRequestReviewCommentEvent':
    case 'CommitCommentEvent':
      return {
        $s: _xvdomSpec$9,
        a: event.payload.comment.body
      };

    case 'PushEvent':
      return event.payload.commits.map(function (_ref) {
        var sha = _ref.sha;
        var message = _ref.message;
        return {
          $s: _xvdomSpec2$6,
          a: '#github/' + event.repo.name + '?commits/' + sha,
          e: message,
          key: sha
        };
      });
  }
};

var EventCard = (function (_ref2) {
  var event = _ref2.event;
  return {
    $s: _xvdomSpec3$4,
    a: event.repo.name,
    d: event,
    g: renderEventAction(event)
  };
});

var _xvdomCreateDynamic$8 = xvdom.createDynamic;
var _xvdomEl$12 = xvdom.el;
var _xvdomUpdateDynamic$8 = xvdom.updateDynamic;
var _xvdomSpec$13 = {
  c: function c(inst) {
    var _n = _xvdomEl$12('div');

    _n.appendChild(inst.b = _xvdomCreateDynamic$8(true, _n, inst.a));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$8(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var ChunkedArrayRender = function ChunkedArrayRender(_ref) {
  var render$$1 = _ref.props.render;
  var state = _ref.state;
  return {
    $s: _xvdomSpec$13,
    a: state.map(render$$1)
  };
};

var renderSome = function renderSome(array, bindSend) {
  return window.setTimeout(bindSend('renderAll'), 100), array.slice(0, 3);
};

ChunkedArrayRender.state = {
  onInit: function onInit(_ref2) {
    var array = _ref2.props.array;
    var bindSend = _ref2.bindSend;
    return renderSome(array, bindSend);
  },

  onProps: function onProps(_ref3, _ref4) {
    var _ref3$props = _ref3.props;
    var array = _ref3$props.array;
    var arrayKey = _ref3$props.arrayKey;
    var render$$1 = _ref3$props.render;
    var bindSend = _ref3.bindSend;
    var prevArrayKey = _ref4.arrayKey;
    return arrayKey === prevArrayKey ? array : renderSome(array, bindSend);
  },

  renderAll: function renderAll(_ref5) {
    var array = _ref5.props.array;
    return array;
  }
};

var GithubEvent = model({
  query: function query(_ref) {
    var type = _ref.type;
    var id = _ref.id;
    return {
      cache: 'ticker:GithubEvent:' + type + '/' + id,
      url: 'https://api.github.com/' + type + '/' + id + '/events'
    };
  }
});

var modelStateComponent = (function (modelOrGetter, type, Component) {
  var onInit = function onInit(_ref) {
    var props = _ref.props;
    var bindSend = _ref.bindSend;

    var Model = typeof modelOrGetter === 'function' ? modelOrGetter(props) : modelOrGetter;
    Model[type](props).then(bindSend('onLoadModel'));
    return Model[type === 'get' ? 'localGet' : 'localQuery'](props);
  };
  Component.state = {
    onInit: onInit,
    onProps: onInit,
    onLoadModel: function onLoadModel(component, model) {
      return model;
    }
  };
  return Component;
});

var _xvdomCreateComponent$5 = xvdom.createComponent;
var _xvdomSpec2$5 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$5(ChunkedArrayRender, ChunkedArrayRender.state, {
      array: inst.a,
      arrayKey: inst.b,
      render: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(ChunkedArrayRender, {
        array: inst.a,
        arrayKey: inst.b,
        render: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$8 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$5(EventCard, EventCard.state, {
      event: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(EventCard, {
        event: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: new xvdom.Pool()
};
var EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

var filterEvents = function filterEvents(_ref) {
  var type = _ref.type;
  return !EVENT_TYPES_TO_HIDE[type];
};

var renderEvent = function renderEvent(event) {
  return {
    $s: _xvdomSpec$8,
    a: event,
    key: event.id
  };
};

var EventsView = modelStateComponent(GithubEvent, 'query', function (_ref2) {
  var id = _ref2.props.id;
  var state = _ref2.state;
  return {
    $s: _xvdomSpec2$5,
    a: (state || []).filter(filterEvents),
    b: id,
    c: renderEvent
  };
});

var _xvdomCreateComponent$9 = xvdom.createComponent;
var _xvdomSpec$14 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$9(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst, 'e', 'f');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e(List, {
        className: 'Card',
        context: inst.a,
        item: inst.b,
        list: inst.c,
        transform: inst.d
      }, pInst.f, pInst, 'f');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
    }
  },
  r: xvdom.DEADPOOL
};
var compareRepos = function compareRepos(a, b) {
  return compare(a.name, b.name);
};
var sortRepos = function sortRepos(repos) {
  return repos.sort(compareRepos);
};
var item$2 = function item$2(_ref, id) {
  var name = _ref.name;
  var description = _ref.description;
  return {
    href: '#github/' + id + '/' + name,
    icon: 'repo',
    key: name,
    text: name,
    secondaryText: description
  };
};

var UserReposView = modelStateComponent(GithubRepo, 'query', function (_ref2) {
  var id = _ref2.props.id;
  var state = _ref2.state;
  return {
    $s: _xvdomSpec$14,
    a: id,
    b: item$2,
    c: state,
    d: sortRepos
  };
});

var _xvdomCreateDynamic$9 = xvdom.createDynamic;
var _xvdomEl$13 = xvdom.el;
var _xvdomUpdateDynamic$9 = xvdom.updateDynamic;
var _xvdomSpec2$9 = {
  c: function c(inst) {
    var _n = _xvdomEl$13('div');

    _n.className = 'Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal';

    _n.appendChild(inst.b = _xvdomCreateDynamic$9(true, _n, inst.a));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$9(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$16 = {
  c: function c(inst) {
    var _n = _xvdomEl$13('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;

    _n.appendChild(inst.e = _xvdomCreateDynamic$9(true, _n, inst.d));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$9(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
function renderTab(tabId) {
  var tabs = this.tabs;
  var selected = this.selected;
  var hrefPrefix = this.hrefPrefix;
  var _tabs$tabId = tabs[tabId];
  var href = _tabs$tabId.href;
  var title = _tabs$tabId.title;

  return {
    $s: _xvdomSpec$16,
    a: 'Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ' + (selected === tabId ? 'is-selected' : ''),
    c: '' + hrefPrefix + (href || tabId),
    d: title || tabId,
    key: tabId
  };
}

var Tabs = (function (props) {
  return {
    $s: _xvdomSpec2$9,
    a: Object.keys(props.tabs).map(renderTab, props)
  };
});

var _xvdomCreateComponent$11 = xvdom.createComponent;
var _xvdomCreateDynamic$10 = xvdom.createDynamic;
var _xvdomEl$14 = xvdom.el;
var _xvdomUpdateDynamic$10 = xvdom.updateDynamic;
var _xvdomSpec$17 = {
  c: function c(inst) {
    var _n = _xvdomEl$14('div'),
        _n2,
        _n3,
        _n4;

    inst.b = _n;
    _n.className = inst.a;
    _n2 = _xvdomEl$14('div');
    inst.d = _n2;
    _n2.className = inst.c;
    _n3 = _xvdomEl$14('div');
    _n3.className = 'layout horizontal center-center l-height14';

    _n3.appendChild(inst.f = _xvdomCreateDynamic$10(false, _n3, inst.e));

    _n4 = _xvdomEl$14('div');
    _n4.className = 'l-padding-r0 t-truncate t-font-size-20 flex';
    inst.h = _n4;
    _n4.textContent = inst.g;

    _n3.appendChild(_n4);

    _n4 = _xvdomCreateComponent$11(Icon, Icon.state, {
      className: 't-bold c-white l-padding-h4',
      name: 'search',
      onClick: inst.i,
      size: 'small'
    }, inst, 'j', 'k');

    _n3.appendChild(_n4);

    _n3.appendChild(inst.m = _xvdomCreateDynamic$10(false, _n3, inst.l));

    _n2.appendChild(_n3);

    _n2.appendChild(inst.o = _xvdomCreateDynamic$10(false, _n2, inst.n));

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.className = v;
      pInst.c = v;
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$10(false, pInst.e, pInst.e = inst.e, pInst.f);
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.h.textContent = v;
      pInst.g = v;
    }

    if (inst.i !== pInst.i) {
      pInst.j(Icon, {
        className: 't-bold c-white l-padding-h4',
        name: 'search',
        onClick: inst.i,
        size: 'small'
      }, pInst.k, pInst, 'k');
      pInst.i = inst.i;
    }

    if (inst.l !== pInst.l) {
      pInst.m = _xvdomUpdateDynamic$10(false, pInst.l, pInst.l = inst.l, pInst.m);
    }

    if (inst.n !== pInst.n) {
      pInst.o = _xvdomUpdateDynamic$10(false, pInst.n, pInst.n = inst.n, pInst.o);
    }
  },
  r: xvdom.DEADPOOL
};
var showSearch = function showSearch() {
  App.showSearch();
};

var AppToolbar = function AppToolbar(_ref) {
  var _ref$props = _ref.props;
  var title = _ref$props.title;
  var secondary = _ref$props.secondary;
  var left = _ref$props.left;
  var right = _ref$props.right;
  var scrollClass = _ref.state.scrollClass;
  return {
    $s: _xvdomSpec$17,
    a: 'AppToolbar ' + (secondary ? 'AppToolbar--withSecondary' : ''),
    c: 'AppToolbar-bar fixed fixed--top c-white bg-purple ' + scrollClass,
    e: left,
    g: title,
    i: showSearch,
    l: right,
    n: secondary
  };
};

var getScrollState = function getScrollState(prevScrollTop) {
  var scrollTop = document.body ? document.body.scrollTop : 0;
  var isScrollingDown = scrollTop > 56 && scrollTop - prevScrollTop > 0;
  return {
    scrollTop: scrollTop,
    scrollClass: isScrollingDown ? ' is-scrolling-down' : ''
  };
};

AppToolbar.state = {
  onInit: function onInit(_ref2) {
    var bindSend = _ref2.bindSend;
    return requestAnimationFrame(function () {
      return document.body.onscroll = bindSend('onScroll');
    }), getScrollState(0);
  },

  onScroll: function onScroll(_ref3) {
    var scrollTop = _ref3.state.scrollTop;
    return getScrollState(scrollTop);
  }
};

var _xvdomCreateComponent$10 = xvdom.createComponent;
var _xvdomSpec4$3 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$10(Tabs, Tabs.state, {
      hrefPrefix: inst.a,
      selected: inst.b,
      tabs: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(Tabs, {
        hrefPrefix: inst.a,
        selected: inst.b,
        tabs: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$5 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$10(Icon, Icon.state, {
      className: inst.a,
      name: 'bookmark',
      onClick: inst.b,
      size: 'small'
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(Icon, {
        className: inst.a,
        name: 'bookmark',
        onClick: inst.b,
        size: 'small'
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$8 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$10(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'three-bars',
      onClick: inst.a,
      size: 'small'
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Icon, {
        className: 'c-white l-padding-h4',
        name: 'three-bars',
        onClick: inst.a,
        size: 'small'
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$15 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$10(AppToolbar, AppToolbar.state, {
      left: inst.a,
      right: inst.b,
      secondary: inst.c,
      title: inst.d
    }, inst, 'e', 'f');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e(AppToolbar, {
        left: inst.a,
        right: inst.b,
        secondary: inst.c,
        title: inst.d
      }, pInst.f, pInst, 'f');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
    }
  },
  r: xvdom.DEADPOOL
};
var showDrawer = function showDrawer() {
  App.showDrawer();
};

var RepoUserToolbar = (function (_ref) {
  var id = _ref.id;
  var tab = _ref.tab;
  var TABS = _ref.TABS;
  var isBookmarked = _ref.isBookmarked;
  var onBookmark = _ref.onBookmark;
  return {
    $s: _xvdomSpec$15,
    a: {
      $s: _xvdomSpec2$8,
      a: showDrawer
    },
    b: {
      $s: _xvdomSpec3$5,
      a: 'c-white l-padding-l2 l-padding-r4 ' + (isBookmarked ? '' : 'c-opacity-50'),
      b: function b() {
        onBookmark(id);
      }
    },
    c: {
      $s: _xvdomSpec4$3,
      a: '#github/' + id + '?',
      b: tab,
      c: TABS
    },
    d: id
  };
});

var fb = function fb(id) {
  return new Firebase('https://ticker-dev.firebaseio.com/users/' + id);
};
var store = function store(user) {
  return storage.setItemObj('ticker:User:' + user.id, user);
};

var User = {
  localGet: function localGet(id) {
    return storage.getItemObj('ticker:User:' + id);
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

var FIREBASEURL = 'https://ticker-dev.firebaseio.com';
var LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
var currentUser = null;

var loadFirebase = function loadFirebase() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      loadScript('../vendor/firebase/firebase.js').then(resolve);
    }, 500);
  });
};

var authWithFirebase = function authWithFirebase() {
  return new Promise(function (resolve, reject) {
    new Firebase(FIREBASEURL).onAuth(function (authData) {
      if (authData && authData.github) resolve(authData);else reject('Firebase auth failed');
    });
  });
};

var getOrCreateUser = function getOrCreateUser(_ref) {
  var _ref$github = _ref.github;
  var id = _ref$github.id;
  var username = _ref$github.username;
  var accessToken = _ref$github.accessToken;
  return (
    // Give load access tokens to use for any third-party API requests.
    // For right now, just Github.
    // TODO(pwong): Split out access tokens into a seperate module?
    loadJSON.setAccessToken(accessToken),

    // Get or create user information
    User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(function () {
      return User.save({ id: id, username: username, sources: [] });
    }).then(function (user) {
      return storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id), currentUser = user;
    })
  );
};

var authWithOAuthPopup = function authWithOAuthPopup() {
  return new Promise(function (resolve, reject) {
    new Firebase(FIREBASEURL).authWithOAuthPopup('github', function (error, github) {
      if (error) reject();else resolve(github);
    });
  }).then(getOrCreateUser);
};

var getPreviousUser = function getPreviousUser() {
  var lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  if (lastUserId) return User.localGet(lastUserId);
};

var userListener = function userListener() {};
var toggleSource = function toggleSource(type, id) {
  if (!currentUser) return;
  var _currentUser = currentUser;
  var _currentUser$sources = _currentUser.sources;
  var github = _currentUser$sources.github;
  var list = _currentUser$sources.github[type];

  var index = list.map(function (s) {
    return s.id;
  }).indexOf(id);
  if (index > -1) {
    list.splice(index, 1);
    github[type] = [].concat(toConsumableArray(list));
  } else {
    github[type] = list.concat({ id: id });
  }

  User.save(currentUser).then(function (user) {
    currentUser = user;
    userListener(currentUser);
  });
};

var toggleUserSource = toggleSource.bind(null, 'users');
var toggleRepoSource = toggleSource.bind(null, 'repos');

var getCurrentUser = function getCurrentUser() {
  var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

  userListener = cb;
  if (currentUser) return currentUser;

  loadFirebase().then(authWithFirebase).then(getOrCreateUser).catch(function () {
    return null;
  }).then(userListener);

  var prevUser = getPreviousUser();
  if (prevUser) return prevUser;
};

var _xvdomCreateComponent$4 = xvdom.createComponent;
var _xvdomCreateDynamic$4 = xvdom.createDynamic;
var _xvdomEl$7 = xvdom.el;
var _xvdomUpdateDynamic$4 = xvdom.updateDynamic;
var _xvdomSpec3$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$7('div'),
        _n2;

    _n.className = 'l-padding-b2';
    _n2 = _xvdomCreateComponent$4(RepoUserToolbar, RepoUserToolbar.state, {
      TABS: inst.a,
      id: inst.b,
      isBookmarked: inst.c,
      onBookmark: inst.d,
      tab: inst.e
    }, inst, 'f', 'g');

    _n.appendChild(_n2);

    _n.appendChild(inst.i = _xvdomCreateDynamic$4(false, _n, inst.h));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.e !== pInst.e) {
      pInst.f(RepoUserToolbar, {
        TABS: inst.a,
        id: inst.b,
        isBookmarked: inst.c,
        onBookmark: inst.d,
        tab: inst.e
      }, pInst.g, pInst, 'g');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
      pInst.e = inst.e;
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateDynamic$4(false, pInst.h, pInst.h = inst.h, pInst.i);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$4 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$4(UserReposView, UserReposView.state, {
      id: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(UserReposView, {
        id: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$7 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$4(EventsView, EventsView.state, {
      id: inst.a,
      type: 'users'
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(EventsView, {
        id: inst.a,
        type: 'users'
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var TABS = {
  news: {
    title: 'News',
    view: function view(id) {
      return {
        $s: _xvdomSpec$7,
        a: id
      };
    }
  },
  repos: {
    title: 'Repos',
    view: function view(id) {
      return {
        $s: _xvdomSpec2$4,
        a: id
      };
    }
  }
};

var isBookmarked = function isBookmarked(user, id) {
  return user && user.sources.github.users.find(function (s) {
    return s.id === id;
  });
};

var UserView = (function (_ref) {
  var id = _ref.id;
  var user = _ref.user;
  var _ref$viewUrl = _ref.viewUrl;
  var viewUrl = _ref$viewUrl === undefined ? 'news' : _ref$viewUrl;
  return {
    $s: _xvdomSpec3$3,
    a: TABS,
    b: id,
    c: isBookmarked(user, id),
    d: toggleUserSource,
    e: viewUrl,
    h: TABS[viewUrl].view(id)
  };
});

var GithubCommit = model({
  get: function get(_ref) {
    var repo = _ref.repo;
    var commitId = _ref.commitId;
    return {
      url: 'https://api.github.com/repos/' + repo + '/commits/' + commitId
    };
  }
});

var _xvdomEl$18 = xvdom.el;
var _xvdomSpec$21 = {
  c: function c(inst) {
    var _n = _xvdomEl$18('pre');

    _n.className = 'Code';
    inst.b = _n;
    _n.innerHTML = inst.a;
    _n.textContent = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.innerHTML = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.textContent = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Code = function Code(_ref) {
  var code = _ref.props.code;
  var state = _ref.state;
  return {
    $s: _xvdomSpec$21,
    a: state,
    c: code || ''
  };
};

Code.state = {
  onInit: function onInit(_ref2) {
    var _ref2$props = _ref2.props;
    var code = _ref2$props.code;
    var syntax = _ref2$props.syntax;
    var bindSend = _ref2.bindSend;

    if (code && syntax) loadHighlight(syntax).then(bindSend('highlight'));
    return '';
  },
  highlight: function highlight(_ref3, hljs) {
    var _ref3$props = _ref3.props;
    var syntax = _ref3$props.syntax;
    var code = _ref3$props.code;
    return hljs.highlight(syntax, code).value;
  }
};

var _xvdomCreateComponent$14 = xvdom.createComponent;
var _xvdomCreateDynamic$13 = xvdom.createDynamic;
var _xvdomEl$17 = xvdom.el;
var _xvdomUpdateDynamic$13 = xvdom.updateDynamic;
var _xvdomSpec2$12 = {
  c: function c(inst) {
    var _n = _xvdomEl$17('div');

    _n.appendChild(inst.b = _xvdomCreateDynamic$13(true, _n, inst.a));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$13(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$20 = {
  c: function c(inst) {
    var _n = _xvdomEl$17('div'),
        _n2,
        _n3;

    _n.className = 'Card';
    _n2 = _xvdomEl$17('div');
    _n2.className = 'Card-title layout horizontal center t-no-wrap l-padding-r0';
    _n3 = _xvdomEl$17('div');
    _n3.className = 'c-gray-dark t-truncate';
    inst.b = _n3;
    _n3.textContent = inst.a;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$17('div');
    _n3.className = 't-normal l-padding-r1 t-truncate';
    inst.d = _n3;
    _n3.textContent = inst.c;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$17('div');
    _n3.className = 'flex';

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$17('div');
    _n3.className = 'Pill bg-green c-green';
    inst.f = _n3;
    _n3.textContent = inst.e;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$17('div');
    _n3.className = 'Pill bg-red c-red';
    inst.h = _n3;
    _n3.textContent = inst.g;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$14(Code, Code.state, {
      code: inst.i,
      syntax: 'diff'
    }, inst, 'j', 'k');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.textContent = v;
      pInst.c = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.f.textContent = v;
      pInst.e = v;
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.h.textContent = v;
      pInst.g = v;
    }

    if (inst.i !== pInst.i) {
      pInst.j(Code, {
        code: inst.i,
        syntax: 'diff'
      }, pInst.k, pInst, 'k');
      pInst.i = inst.i;
    }
  },
  r: xvdom.DEADPOOL
};
var PATH_REGEX = /^(.*\/)?([^\/]+)$/;

var renderFile = function renderFile(_ref) {
  var additions = _ref.additions;
  var deletions = _ref.deletions;
  var filename = _ref.filename;
  var patch = _ref.patch;

  var _PATH_REGEX$exec = PATH_REGEX.exec(filename);

  var _PATH_REGEX$exec2 = slicedToArray(_PATH_REGEX$exec, 3);

  var path = _PATH_REGEX$exec2[1];
  var fname = _PATH_REGEX$exec2[2];

  return {
    $s: _xvdomSpec$20,
    a: path,
    c: fname,
    e: '+' + additions,
    g: '\u2013' + deletions,
    i: patch,
    key: filename
  };
};

var DiffFiles = (function (_ref2) {
  var files = _ref2.files;
  return {
    $s: _xvdomSpec2$12,
    a: files.map(renderFile)
  };
});

var _xvdomCreateComponent$13 = xvdom.createComponent;
var _xvdomCreateDynamic$12 = xvdom.createDynamic;
var _xvdomEl$16 = xvdom.el;
var _xvdomUpdateDynamic$12 = xvdom.updateDynamic;
var _xvdomSpec3$7 = {
  c: function c(inst) {
    var _n = _xvdomEl$16('a'),
        _n2;

    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$13(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'chevron-left',
      size: 'small'
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$11 = {
  c: function c(inst) {
    var _n = _xvdomEl$16('div'),
        _n2,
        _n3,
        _n4,
        _n5;

    _n2 = _xvdomCreateComponent$13(AppToolbar, AppToolbar.state, {
      left: inst.a,
      title: inst.b
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    _n2 = _xvdomEl$16('div');
    _n2.className = 'Card Card--fullBleed';

    _n2.appendChild(inst.f = _xvdomCreateDynamic$12(false, _n2, inst.e));

    _n3 = _xvdomEl$16('div');
    _n3.className = 'Card-content';
    _n4 = _xvdomEl$16('div');
    _n4.className = 'layout horizontal center l-margin-b4';
    _n5 = _xvdomCreateComponent$13(Actor, Actor.state, {
      actionDate: inst.g,
      className: 'flex',
      user: inst.h
    }, inst, 'i', 'j');

    _n4.appendChild(_n5);

    _n5 = _xvdomEl$16('div');
    _n5.className = 't-font-size-12 l-margin-h2';
    inst.l = _n5;
    _n5.textContent = inst.k;

    _n4.appendChild(_n5);

    _n5 = _xvdomEl$16('div');
    _n5.className = 'Pill bg-green c-green';
    inst.n = _n5;
    _n5.textContent = inst.m;

    _n4.appendChild(_n5);

    _n5 = _xvdomEl$16('div');
    _n5.className = 'Pill bg-red c-red';
    inst.p = _n5;
    _n5.textContent = inst.o;

    _n4.appendChild(_n5);

    _n3.appendChild(_n4);

    _n4 = _xvdomEl$16('pre');
    _n4.className = 't-white-space-normal t-word-break-word';
    inst.r = _n4;
    _n4.textContent = inst.q;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$13(DiffFiles, DiffFiles.state, {
      files: inst.s
    }, inst, 't', 'u');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(AppToolbar, {
        left: inst.a,
        title: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$12(false, pInst.e, pInst.e = inst.e, pInst.f);
    }

    if (inst.g !== pInst.g || inst.h !== pInst.h) {
      pInst.i(Actor, {
        actionDate: inst.g,
        className: 'flex',
        user: inst.h
      }, pInst.j, pInst, 'j');
      pInst.g = inst.g;
      pInst.h = inst.h;
    }

    v = inst.k;

    if (v !== pInst.k) {
      pInst.l.textContent = v;
      pInst.k = v;
    }

    v = inst.m;

    if (v !== pInst.m) {
      pInst.n.textContent = v;
      pInst.m = v;
    }

    v = inst.o;

    if (v !== pInst.o) {
      pInst.p.textContent = v;
      pInst.o = v;
    }

    v = inst.q;

    if (v !== pInst.q) {
      pInst.r.textContent = v;
      pInst.q = v;
    }

    if (inst.s !== pInst.s) {
      pInst.t(DiffFiles, {
        files: inst.s
      }, pInst.u, pInst, 'u');
      pInst.s = inst.s;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$19 = {
  c: function c(inst) {
    var _n = _xvdomEl$16('div'),
        _n2;

    _n.className = 'Card-title';
    _n2 = _xvdomEl$16('h1');
    _n2.className = 't-word-break-word l-margin-t4 l-margin-b0';
    inst.b = _n2;
    _n2.textContent = inst.a;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var COMMIT_PLACEHOLDER = {
  files: [],
  commit: {
    message: '',
    committer: {
      date: 0
    }
  },
  committer: {
    avatar_url: '',
    login: ''
  },
  stats: {
    additions: 0,
    deletions: 0
  }
};

var getCommitTitleMessage = function getCommitTitleMessage(message) {
  var _$exec = /.*/g.exec(message);

  var _$exec2 = slicedToArray(_$exec, 1);

  var title = _$exec2[0];

  return title === message ? { title: '', message: message } : { title: title, message: message.substr(title.length) };
};

var CommitView = modelStateComponent(GithubCommit, 'get', function (_ref) {
  var _ref$props = _ref.props;
  var repo = _ref$props.repo;
  var commitId = _ref$props.commitId;
  var state = _ref.state;

  var _ref2 = state || COMMIT_PLACEHOLDER;

  var files = _ref2.files;
  var commit = _ref2.commit;
  var committer = _ref2.committer;
  var stats = _ref2.stats;

  var _getCommitTitleMessag = getCommitTitleMessage(commit.message);

  var title = _getCommitTitleMessag.title;
  var message = _getCommitTitleMessag.message;

  return {
    $s: _xvdomSpec2$11,
    a: {
      $s: _xvdomSpec3$7,
      a: '#github/' + repo
    },
    b: commitId,
    e: title && {
      $s: _xvdomSpec$19,
      a: title
    },
    g: commit.committer.date,
    h: committer || { login: commit.committer.name },
    k: files.length + ' files changed',
    m: '+' + stats.additions,
    o: '\u2013' + stats.deletions,
    q: message,
    s: files
  };
});

var _xvdomCreateDynamic$14 = xvdom.createDynamic;
var _xvdomEl$20 = xvdom.el;
var _xvdomUpdateDynamic$14 = xvdom.updateDynamic;
var _xvdomSpec2$13 = {
  c: function c(inst) {
    var _n = _xvdomEl$20('div'),
        _n2,
        _n3;

    _n.className = 'Card Card--fullBleed';
    _n2 = _xvdomEl$20('div');
    _n2.className = 'Card-content layout horizontal l-padding-v2';
    _n3 = _xvdomEl$20('div');
    _n3.className = 'flex';

    _n3.appendChild(inst.b = _xvdomCreateDynamic$14(true, _n3, inst.a));

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$20('a');
    _n3.className = 'u-link';

    _n3.appendChild(inst.d = _xvdomCreateDynamic$14(true, _n3, inst.c));

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$14(true, pInst.a, pInst.a = inst.a, pInst.b);
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$14(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$23 = {
  c: function c(inst) {
    var _n = _xvdomEl$20('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;

    _n.appendChild(inst.e = _xvdomCreateDynamic$14(true, _n, inst.d));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$14(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var repoName = function repoName(repo) {
  return repo.split('/')[1];
};
var pathURL = function pathURL(pathArray, i) {
  return pathArray.slice(0, i).map(function (a) {
    return '/' + a;
  }).join('');
};

var PathNavigator = (function (_ref) {
  var pathURLPrefix = _ref.pathURLPrefix;
  var pathArray = _ref.pathArray;
  var repo = _ref.repo;
  var sha = _ref.sha;
  return {
    $s: _xvdomSpec2$13,
    a: [repoName(repo)].concat(toConsumableArray(pathArray)).map(function (component, i) {
      return {
        $s: _xvdomSpec$23,
        a: 'PathNavigator-path ' + (i === pathArray.length ? '' : 'u-link'),
        c: pathURLPrefix + sha + pathURL(pathArray, i),
        d: component,
        key: i
      };
    }),
    c: sha
  };
});

var _xvdomCreateComponent$16 = xvdom.createComponent;
var _xvdomEl$21 = xvdom.el;
var _xvdomSpec2$14 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$16(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(List, {
        className: 'Card',
        context: inst.a,
        item: inst.b,
        list: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$24 = {
  c: function c(inst) {
    var _n = _xvdomEl$21('div'),
        _n2;

    _n.className = 'Card l-padding-t4';
    _n2 = _xvdomCreateComponent$16(Code, Code.state, {
      code: inst.a,
      syntax: inst.b
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(Code, {
        code: inst.a,
        syntax: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var TYPE_TO_ICON = {
  file: 'file-code',
  dir: 'file-directory'
};

var sortFiles = function sortFiles(a, b) {
  return compare(a.type, b.type) || compare(a.name, b.name);
};

var item$3 = function item$3(_ref, context) {
  var name = _ref.name;
  var type = _ref.type;
  var path = _ref.path;
  return {
    href: '' + context + path,
    icon: TYPE_TO_ICON[type],
    key: name,
    text: name
  };
};

var PathContents = (function (_ref2) {
  var repo = _ref2.repo;
  var sha = _ref2.sha;
  var contents = _ref2.contents;
  return contents && contents.isFile ? {
    $s: _xvdomSpec$24,
    a: contents.value.content,
    b: getSyntaxForFile(contents.value.name)
  } : {
    $s: _xvdomSpec2$14,
    a: '#github/' + repo + '?code/' + sha + '/',
    b: item$3,
    c: contents && contents.value.sort(sortFiles)
  };
});

var decode = atob;

// Safari/Firefox: atob() cannot handle newlines
try {
  atob('\n');
} catch (e) {
  decode = function decode(content) {
    return atob(content.replace(/\n/g, ''));
  };
}

var atob$1 = decode;

var addTransformedFileProperties = function addTransformedFileProperties(fileContents) {
  return fileContents.parentPath = fileContents.path.replace(/[^\/]+$/, ''), fileContents.content = atob$1(fileContents.content), fileContents;
};

var createGithubFileContent = function createGithubFileContent(contents) {
  return contents.constructor === Array ? { isFile: false, value: contents } : { isFile: true, value: addTransformedFileProperties(contents) };
};

var GithubFileContents = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    var _ref$sha = _ref.sha;
    var sha = _ref$sha === undefined ? 'master' : _ref$sha;
    var _ref$pathArray = _ref.pathArray;
    var pathArray = _ref$pathArray === undefined ? [] : _ref$pathArray;
    return {
      url: 'https://api.github.com/repos/' + repo + '/contents/' + pathArray.join('/') + '?ref=' + sha,
      transform: createGithubFileContent
    };
  }
});

var _xvdomCreateComponent$15 = xvdom.createComponent;
var _xvdomEl$19 = xvdom.el;
var _xvdomSpec$22 = {
  c: function c(inst) {
    var _n = _xvdomEl$19('div'),
        _n2;

    _n2 = _xvdomCreateComponent$15(PathNavigator, PathNavigator.state, {
      pathArray: inst.a,
      pathURLPrefix: inst.b,
      repo: inst.c,
      sha: inst.d
    }, inst, 'e', 'f');

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$15(PathContents, PathContents.state, {
      contents: inst.g,
      repo: inst.h,
      sha: inst.i
    }, inst, 'j', 'k');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e(PathNavigator, {
        pathArray: inst.a,
        pathURLPrefix: inst.b,
        repo: inst.c,
        sha: inst.d
      }, pInst.f, pInst, 'f');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
    }

    if (inst.h !== pInst.h || inst.g !== pInst.g || inst.i !== pInst.i) {
      pInst.j(PathContents, {
        contents: inst.g,
        repo: inst.h,
        sha: inst.i
      }, pInst.k, pInst, 'k');
      pInst.g = inst.g;
      pInst.h = inst.h;
      pInst.i = inst.i;
    }
  },
  r: xvdom.DEADPOOL
};
var CodeView = modelStateComponent(GithubFileContents, 'query', function (_ref) {
  var _ref$props = _ref.props;
  var repo = _ref$props.repo;
  var _ref$props$pathArray = _ref$props.pathArray;
  var pathArray = _ref$props$pathArray === undefined ? [] : _ref$props$pathArray;
  var _ref$props$sha = _ref$props.sha;
  var sha = _ref$props$sha === undefined ? 'master' : _ref$props$sha;
  var contents = _ref.state;
  return {
    $s: _xvdomSpec$22,
    a: pathArray,
    b: '#github/' + repo + '?code/',
    c: repo,
    d: sha,
    g: contents,
    h: repo,
    i: sha
  };
});

var GithubIssue = model({
  get: function get(_ref) {
    var repo = _ref.repo;
    var id = _ref.id;
    return {
      cache: 'ticker:GithubIssue:' + repo + id,
      url: 'https://api.github.com/repos/' + repo + '/issues/' + id
    };
  },
  query: function query(_ref2) {
    var repo = _ref2.repo;
    return {
      url: 'https://api.github.com/repos/' + repo + '/issues'
    };
  }
});

var GithubPull = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls'
    };
  }
});

var _xvdomCreateComponent$17 = xvdom.createComponent;
var _xvdomSpec$25 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$17(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst, 'e', 'f');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e(List, {
        className: 'Card',
        context: inst.a,
        item: inst.b,
        list: inst.c,
        transform: inst.d
      }, pInst.f, pInst, 'f');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
    }
  },
  r: xvdom.DEADPOOL
};
var compareCreatedAt = function compareCreatedAt(a, b) {
  return compare(b.created_at, a.created_at);
};
var sortIssues = function sortIssues(issues) {
  return issues.sort(compareCreatedAt);
};
var item$4 = function item$4(_ref, id) {
  var base = _ref.base;
  var number = _ref.number;
  var title = _ref.title;
  var created_at = _ref.created_at;
  var user = _ref.user;
  return {
    href: '#github/' + id + '?' + (base ? 'pulls' : 'issues') + '/' + number,
    avatarUrl: user.avatar_url,
    key: number,
    text: title,
    secondaryText: '#' + number + ' opened ' + timeAgo(Date.parse(created_at)) + ' ago by ' + user.login
  };
};

var IssuesPullsView = modelStateComponent(function (_ref2) {
  var modelClass = _ref2.modelClass;
  return modelClass;
}, 'query', function (_ref3) {
  var repo = _ref3.props.repo;
  var state = _ref3.state;
  return {
    $s: _xvdomSpec$25,
    a: repo,
    b: item$4,
    c: state,
    d: sortIssues
  };
});

var GithubRepoReadme = model({
  get: function get(_ref) {
    var id = _ref.id;
    return {
      url: 'https://api.github.com/repos/' + id + '/readme',
      transform: function transform(_ref2) {
        var content = _ref2.content;
        return atob$1(content);
      }
    };
  }
});

var _xvdomCreateComponent$18 = xvdom.createComponent;
var _xvdomEl$22 = xvdom.el;
var _xvdomSpec$26 = {
  c: function c(inst) {
    var _n = _xvdomEl$22('div'),
        _n2;

    _n.className = 'Card l-margin-t2';
    _n2 = _xvdomCreateComponent$18(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.a
    }, inst, 'b', 'c');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(Markup, {
        className: 'Card-content',
        content: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var ReadmeView = modelStateComponent(GithubRepoReadme, 'get', function (_ref) {
  var state = _ref.state;
  return {
    $s: _xvdomSpec$26,
    a: state
  };
});

var GithubIssueComment = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    var issue = _ref.issue;

    return {
      url: 'https://api.github.com/repos/' + repo + '/issues/' + issue.number + '/comments'
    };
  }
});

var _xvdomCreateComponent$20 = xvdom.createComponent;
var _xvdomCreateDynamic$16 = xvdom.createDynamic;
var _xvdomEl$24 = xvdom.el;
var _xvdomUpdateDynamic$16 = xvdom.updateDynamic;
var _xvdomSpec2$16 = {
  c: function c(inst) {
    var _n = _xvdomEl$24('div'),
        _n2,
        _n3,
        _n4;

    _n2 = _xvdomEl$24('div');
    _n2.className = 'Card Card--fullBleed';
    _n3 = _xvdomEl$24('div');
    _n3.className = 'Card-title';
    _n4 = _xvdomEl$24('h1');
    _n4.className = 't-word-break-word l-margin-v0';
    inst.b = _n4;
    _n4.textContent = inst.a;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n3 = _xvdomCreateComponent$20(Actor, Actor.state, {
      actionDate: inst.c,
      className: 'Card-content',
      user: inst.d
    }, inst, 'e', 'f');

    _n2.appendChild(_n3);

    _n3 = _xvdomCreateComponent$20(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.g
    }, inst, 'h', 'i');

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n.appendChild(inst.k = _xvdomCreateDynamic$16(false, _n, inst.j));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c || inst.d !== pInst.d) {
      pInst.e(Actor, {
        actionDate: inst.c,
        className: 'Card-content',
        user: inst.d
      }, pInst.f, pInst, 'f');
      pInst.c = inst.c;
      pInst.d = inst.d;
    }

    if (inst.g !== pInst.g) {
      pInst.h(Markup, {
        className: 'Card-content',
        content: inst.g
      }, pInst.i, pInst, 'i');
      pInst.g = inst.g;
    }

    if (inst.j !== pInst.j) {
      pInst.k = _xvdomUpdateDynamic$16(false, pInst.j, pInst.j = inst.j, pInst.k);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$28 = {
  c: function c(inst) {
    var _n = _xvdomEl$24('div'),
        _n2;

    _n.className = 'Card';
    inst.b = _n;
    _n.id = inst.a;
    _n2 = _xvdomCreateComponent$20(Actor, Actor.state, {
      actionDate: inst.c,
      className: 'Card-content',
      user: inst.d
    }, inst, 'e', 'f');

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent$20(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.g
    }, inst, 'h', 'i');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.id = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c || inst.d !== pInst.d) {
      pInst.e(Actor, {
        actionDate: inst.c,
        className: 'Card-content',
        user: inst.d
      }, pInst.f, pInst, 'f');
      pInst.c = inst.c;
      pInst.d = inst.d;
    }

    if (inst.g !== pInst.g) {
      pInst.h(Markup, {
        className: 'Card-content',
        content: inst.g
      }, pInst.i, pInst, 'i');
      pInst.g = inst.g;
    }
  },
  r: xvdom.DEADPOOL
};
var IssuePullInfo = modelStateComponent(GithubIssueComment, 'query', function (_ref) {
  var issue = _ref.props.issue;
  var issueComments = _ref.state;
  return {
    $s: _xvdomSpec2$16,
    a: issue.title,
    c: issue.created_at,
    d: issue.user,
    g: issue.body,
    j: issueComments && issueComments.map(function (_ref2) {
      var id = _ref2.id;
      var user = _ref2.user;
      var body = _ref2.body;
      var created_at = _ref2.created_at;
      return {
        $s: _xvdomSpec$28,
        a: id,
        c: created_at,
        d: user,
        g: body,
        key: id
      };
    })
  };
});

var GithubPullCommit = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    var id = _ref.id;
    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls/' + id + '/commits'
    };
  }
});

var _xvdomCreateComponent$21 = xvdom.createComponent;
var _xvdomSpec$29 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$21(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst, 'e', 'f');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e(List, {
        className: 'Card',
        context: inst.a,
        item: inst.b,
        list: inst.c,
        transform: inst.d
      }, pInst.f, pInst, 'f');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
    }
  },
  r: xvdom.DEADPOOL
};
var sortCreatedAt = function sortCreatedAt(a, b) {
  return compare(b.created_at, a.created_at);
};
var sort$1 = function sort$1(commits) {
  return commits.sort(sortCreatedAt);
};

var item$5 = function item$5(_ref, repo) {
  var sha = _ref.sha;
  var author = _ref.author;
  var _ref$commit = _ref.commit;
  var name = _ref$commit.author.name;
  var committer = _ref$commit.committer;
  var message = _ref$commit.message;
  return {
    href: '#github/' + repo + '?commits/' + sha,
    avatarUrl: author && author.avatar_url,
    icon: 'person',
    key: sha,
    text: message,
    secondaryText: 'committed ' + timeAgo(Date.parse(committer.date)) + ' ago by ' + (author ? author.login : name)
  };
};

var PullCommitsView = modelStateComponent(GithubPullCommit, 'query', function (_ref2) {
  var repo = _ref2.props.repo;
  var commits = _ref2.state;
  return {
    $s: _xvdomSpec$29,
    a: repo,
    b: item$5,
    c: commits,
    d: sort$1
  };
});

var GithubPullFile = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    var id = _ref.id;

    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls/' + id + '/files'
    };
  }
});

var _xvdomCreateComponent$22 = xvdom.createComponent;
var _xvdomSpec$30 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$22(DiffFiles, DiffFiles.state, {
      files: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(DiffFiles, {
        files: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var PullDiffView = modelStateComponent(GithubPullFile, 'query', function (_ref) {
  var state = _ref.state;
  return {
    $s: _xvdomSpec$30,
    a: state || []
  };
});

var _xvdomCreateComponent$19 = xvdom.createComponent;
var _xvdomCreateDynamic$15 = xvdom.createDynamic;
var _xvdomEl$23 = xvdom.el;
var _xvdomUpdateDynamic$15 = xvdom.updateDynamic;
var _xvdomSpec6$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$23('a'),
        _n2;

    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$19(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'chevron-left',
      size: 'small'
    }, inst, 'c', 'd');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$23('div'),
        _n2;

    _n2 = _xvdomCreateComponent$19(AppToolbar, AppToolbar.state, {
      left: inst.a,
      secondary: inst.b,
      title: inst.c
    }, inst, 'd', 'e');

    _n.appendChild(_n2);

    _n.appendChild(inst.g = _xvdomCreateDynamic$15(false, _n, inst.f));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(AppToolbar, {
        left: inst.a,
        secondary: inst.b,
        title: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic$15(false, pInst.f, pInst.f = inst.f, pInst.g);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4$5 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$19(Tabs, Tabs.state, {
      hrefPrefix: inst.a,
      selected: inst.b,
      tabs: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(Tabs, {
        hrefPrefix: inst.a,
        selected: inst.b,
        tabs: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$8 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$19(PullDiffView, PullDiffView.state, {
      id: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(PullDiffView, {
        id: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$15 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$19(PullCommitsView, PullCommitsView.state, {
      id: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(PullCommitsView, {
        id: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$27 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$19(IssuePullInfo, IssuePullInfo.state, {
      issue: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(IssuePullInfo, {
        issue: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var TABS$2 = {
  info: {
    title: 'Info',
    view: function view(repo, id, issue) {
      return {
        $s: _xvdomSpec$27,
        a: issue,
        b: repo
      };
    }
  },
  commits: {
    title: 'Commits',
    view: function view(repo, id) {
      return {
        $s: _xvdomSpec2$15,
        a: id,
        b: repo
      };
    }
  },
  diff: {
    title: 'Diff',
    view: function view(repo, id) {
      return {
        $s: _xvdomSpec3$8,
        a: id,
        b: repo
      };
    }
  }
};

var IssuePullView = modelStateComponent(GithubIssue, 'get', function (_ref) {
  var _ref$props = _ref.props;
  var id = _ref$props.id;
  var repo = _ref$props.repo;
  var _ref$props$tab = _ref$props.tab;
  var tab = _ref$props$tab === undefined ? 'info' : _ref$props$tab;
  var issue = _ref.state;
  return {
    $s: _xvdomSpec5$1,
    a: {
      $s: _xvdomSpec6$1,
      a: '#github/' + repo
    },
    b: issue && issue.pull_request && {
      $s: _xvdomSpec4$5,
      a: '#github/' + repo + '?pulls/' + id + '/',
      b: tab,
      c: TABS$2
    },
    c: (issue && issue.pull_request ? 'PR' : 'Issue') + ' #' + id + ': ' + (issue ? issue.title : ''),
    f: issue && TABS$2[tab].view(repo, id, issue)
  };
});

var _xvdomCreateComponent$12 = xvdom.createComponent;
var _xvdomCreateDynamic$11 = xvdom.createDynamic;
var _xvdomEl$15 = xvdom.el;
var _xvdomUpdateDynamic$11 = xvdom.updateDynamic;
var _xvdomSpec9 = {
  c: function c(inst) {
    var _n = _xvdomEl$15('div');

    _n.appendChild(inst.b = _xvdomCreateDynamic$11(true, _n, inst.a));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$11(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec8 = {
  c: function c(inst) {
    var _n = _xvdomEl$15('div'),
        _n2;

    _n.className = 'l-padding-b2';
    _n2 = _xvdomCreateComponent$12(RepoUserToolbar, RepoUserToolbar.state, {
      TABS: inst.a,
      id: inst.b,
      isBookmarked: inst.c,
      onBookmark: inst.d,
      tab: inst.e
    }, inst, 'f', 'g');

    _n.appendChild(_n2);

    _n.appendChild(inst.i = _xvdomCreateDynamic$11(false, _n, inst.h));

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.e !== pInst.e) {
      pInst.f(RepoUserToolbar, {
        TABS: inst.a,
        id: inst.b,
        isBookmarked: inst.c,
        onBookmark: inst.d,
        tab: inst.e
      }, pInst.g, pInst, 'g');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
      pInst.d = inst.d;
      pInst.e = inst.e;
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateDynamic$11(false, pInst.h, pInst.h = inst.h, pInst.i);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec7 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(CommitView, CommitView.state, {
      commitId: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(CommitView, {
        commitId: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec6 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(IssuePullView, IssuePullView.state, {
      id: inst.a,
      repo: inst.b,
      tab: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(IssuePullView, {
        id: inst.a,
        repo: inst.b,
        tab: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(IssuesPullsView, IssuesPullsView.state, {
      modelClass: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(IssuesPullsView, {
        modelClass: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4$4 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(IssuesPullsView, IssuesPullsView.state, {
      modelClass: inst.a,
      repo: inst.b
    }, inst, 'c', 'd');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c(IssuesPullsView, {
        modelClass: inst.a,
        repo: inst.b
      }, pInst.d, pInst, 'd');
      pInst.a = inst.a;
      pInst.b = inst.b;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$6 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(CodeView, CodeView.state, {
      pathArray: inst.a,
      repo: inst.b,
      sha: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(CodeView, {
        pathArray: inst.a,
        repo: inst.b,
        sha: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$10 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(EventsView, EventsView.state, {
      id: inst.a,
      type: 'repos'
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(EventsView, {
        id: inst.a,
        type: 'repos'
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$18 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent$12(ReadmeView, ReadmeView.state, {
      id: inst.a
    }, inst, 'b', 'c');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b(ReadmeView, {
        id: inst.a
      }, pInst.c, pInst, 'c');
      pInst.a = inst.a;
    }
  },
  r: xvdom.DEADPOOL
};
var TABS$1 = {
  readme: {
    title: 'Readme',
    view: function view(id) {
      return {
        $s: _xvdomSpec$18,
        a: id
      };
    }
  },
  news: {
    title: 'News',
    view: function view(id) {
      return {
        $s: _xvdomSpec2$10,
        a: id
      };
    }

  },
  code: {
    title: 'Code',
    view: function view(id, head, tail) {
      return {
        $s: _xvdomSpec3$6,
        a: tail,
        b: id,
        c: head
      };
    }
  },
  pulls: {
    title: 'Pull Requests',
    view: function view(repo) {
      return {
        $s: _xvdomSpec4$4,
        a: GithubPull,
        b: repo
      };
    }
  },
  issues: {
    title: 'Issues',
    view: function view(repo) {
      return {
        $s: _xvdomSpec5,
        a: GithubIssue,
        b: repo
      };
    }
  }
};

var stripURLEnding = function stripURLEnding(url) {
  return url.replace(/\/\s*$/, '');
};

var isBookmarked$1 = function isBookmarked$1(user, id) {
  return user && user.sources.github.repos.find(function (s) {
    return s.id === id;
  });
};

var RepoView = (function (_ref) {
  var id = _ref.id;
  var user = _ref.user;
  var _ref$viewUrl = _ref.viewUrl;
  var viewUrl = _ref$viewUrl === undefined ? 'news' : _ref$viewUrl;

  var _stripURLEnding$split = stripURLEnding(viewUrl).split('/');

  var _stripURLEnding$split2 = toArray(_stripURLEnding$split);

  var tab = _stripURLEnding$split2[0];
  var head = _stripURLEnding$split2[1];

  var tail = _stripURLEnding$split2.slice(2);
  // TODO: Temporary wrapper <div> to workaround xvdom dynamic stateful component
  //       rerendering bug


  return {
    $s: _xvdomSpec9,
    a: (tab === 'issues' || tab === 'pulls') && head ? {
      $s: _xvdomSpec6,
      a: head,
      b: id,
      c: tail[0]
    } : tab === 'commits' && head ? {
      $s: _xvdomSpec7,
      a: head,
      b: id
    } : {
      $s: _xvdomSpec8,
      a: TABS$1,
      b: id,
      c: isBookmarked$1(user, id),
      d: toggleRepoSource,
      e: tab,
      h: TABS$1[tab].view(id, head, tail)
    }
  };
});

var _xvdomCreateComponent = xvdom.createComponent;
var _xvdomCreateDynamic = xvdom.createDynamic;
var _xvdomEl = xvdom.el;
var _xvdomUpdateDynamic = xvdom.updateDynamic;
var _xvdomSpec4 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent(App, App.state, null, inst, 'a', 'b');

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec3 = {
  c: function c(inst) {
    var _n = _xvdomEl('body'),
        _n2;

    inst.b = _n;
    _n.className = inst.a;

    _n.appendChild(inst.d = _xvdomCreateDynamic(false, _n, inst.c));

    _n2 = _xvdomEl('div');
    inst.f = _n2;
    _n2.className = inst.e;
    _n2.onclick = inst.g;

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent(AppSearch, AppSearch.state, {
      enabled: inst.h
    }, inst, 'i', 'j');

    _n.appendChild(_n2);

    _n2 = _xvdomCreateComponent(AppDrawer, AppDrawer.state, {
      enabled: inst.k,
      onLogin: inst.l,
      user: inst.m
    }, inst, 'n', 'o');

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(false, pInst.c, pInst.c = inst.c, pInst.d);
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.f.className = v;
      pInst.e = v;
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.f.onclick = v;
      pInst.g = v;
    }

    if (inst.h !== pInst.h) {
      pInst.i(AppSearch, {
        enabled: inst.h
      }, pInst.j, pInst, 'j');
      pInst.h = inst.h;
    }

    if (inst.l !== pInst.l || inst.k !== pInst.k || inst.m !== pInst.m) {
      pInst.n(AppDrawer, {
        enabled: inst.k,
        onLogin: inst.l,
        user: inst.m
      }, pInst.o, pInst, 'o');
      pInst.k = inst.k;
      pInst.l = inst.l;
      pInst.m = inst.m;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent(RepoView, RepoView.state, {
      id: inst.a,
      user: inst.b,
      viewUrl: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(RepoView, {
        id: inst.a,
        user: inst.b,
        viewUrl: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent(UserView, UserView.state, {
      id: inst.a,
      user: inst.b,
      viewUrl: inst.c
    }, inst, 'd', 'e');

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d(UserView, {
        id: inst.a,
        user: inst.b,
        viewUrl: inst.c
      }, pInst.e, pInst, 'e');
      pInst.a = inst.a;
      pInst.b = inst.b;
      pInst.c = inst.c;
    }
  },
  r: xvdom.DEADPOOL
};
var APP_CLASS = 'App ' + (window.navigator.standalone ? 'is-apple-standalone' : '');

var App = function App(_ref) {
  var _ref$state = _ref.state;
  var user = _ref$state.user;
  var hasSearch = _ref$state.hasSearch;
  var hasDrawer = _ref$state.hasDrawer;
  var view = _ref$state.view;
  var viewId = _ref$state.viewId;
  var viewUrl = _ref$state.viewUrl;
  var bindSend = _ref.bindSend;
  return {
    $s: _xvdomSpec3,
    a: APP_CLASS,
    c: view === 'user' ? {
      $s: _xvdomSpec,
      a: viewId,
      b: user,
      c: viewUrl
    } : {
      $s: _xvdomSpec2,
      a: viewId,
      b: user,
      c: viewUrl
    },
    e: 'App-backdrop fixed ' + (hasSearch || hasDrawer ? 'is-enabled' : ''),
    g: bindSend('disableOverlay'),
    h: hasSearch,
    k: hasDrawer,
    l: bindSend('login'),
    m: user
  };
};

var stateFromHash = function stateFromHash(hash) {
  var _hash$split = hash.split('?');

  var _hash$split2 = slicedToArray(_hash$split, 2);

  var appUrl = _hash$split2[0];
  var viewUrl = _hash$split2[1];

  var viewId = appUrl.slice(8);
  return {
    hasSearch: false,
    hasDrawer: false,
    view: /\//.test(viewId) ? 'repo' : 'user',
    viewId: viewId,
    viewUrl: viewUrl
  };
};

App.state = {
  onInit: function onInit(_ref2) {
    var bindSend = _ref2.bindSend;

    App.showDrawer = bindSend('enableDrawer');
    App.showSearch = bindSend('enableSearch');
    window.onhashchange = bindSend('onHashChange');
    return _extends({
      user: getCurrentUser(bindSend('onUserChange'))
    }, stateFromHash(window.location.hash));
  },

  onHashChange: function onHashChange(_ref3) {
    var state = _ref3.state;

    document.body.scrollTop = 0;
    return _extends({}, state, stateFromHash(window.location.hash));
  },

  enableSearch: function enableSearch(_ref4) {
    var state = _ref4.state;
    return _extends({}, state, { hasSearch: true, hasDrawer: false });
  },
  enableDrawer: function enableDrawer(_ref5) {
    var state = _ref5.state;
    return _extends({}, state, { hasSearch: false, hasDrawer: true });
  },
  disableOverlay: function disableOverlay(_ref6) {
    var state = _ref6.state;
    return _extends({}, state, { hasSearch: false, hasDrawer: false });
  },
  onUserChange: function onUserChange(_ref7, user) {
    var state = _ref7.state;
    return _extends({}, state, { user: user });
  },

  login: function login(_ref8) {
    var state = _ref8.state;
    var bindSend = _ref8.bindSend;
    return authWithOAuthPopup().then(bindSend('onUserChange')), state;
  }
};

document.body = xvdom.render({
  $s: _xvdomSpec4
});

return App;

}());
