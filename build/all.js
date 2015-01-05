System.registerModule("elements/ticker-app.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-app.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  System.get("filters/limitArray.js");
  System.get("filters/timeAgo.js");
  System.get("filters/trueFalseTo.js");
  StatefulPolymer('ticker-app', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-app.js
System.registerModule("elements/ticker-drawer.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-drawer.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-drawer', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-drawer.js
System.registerModule("elements/ticker-github-commit.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-github-commit.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-github-commit', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-github-commit.js
System.registerModule("elements/ticker-login.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-login.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-login', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-login.js
System.registerModule("elements/ticker-search.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-search.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-search', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-search.js
System.registerModule("elements/ticker-source-github-repo.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-source-github-repo.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-source-github-repo', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-source-github-repo.js
System.registerModule("elements/ticker-source-github-user.js", [], function() {
  "use strict";
  var __moduleName = "elements/ticker-source-github-user.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-source-github-user', {state: appState});
  return {};
});
//# sourceURL=elements/ticker-source-github-user.js
System.registerModule("filters/limitArray.js", [], function() {
  "use strict";
  var __moduleName = "filters/limitArray.js";
  function limitArray(array, size) {
    return array && array.slice(0, size);
  }
  var $__default = limitArray;
  PolymerExpressions.prototype.limitArray = limitArray;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=filters/limitArray.js
System.registerModule("filters/timeAgo.js", [], function() {
  "use strict";
  var __moduleName = "filters/timeAgo.js";
  var MIN_MS = 1000 * 60;
  var HOUR_MS = MIN_MS * 60;
  var DAY_MS = HOUR_MS * 24;
  var timeAgoNow = Date.now();
  setTimeout(function() {
    timeAgoNow = Date.now();
  }, MIN_MS * 5);
  function timeAgo(dateTime) {
    var diffms = timeAgoNow - dateTime;
    return diffms > DAY_MS ? (~~(diffms / DAY_MS) + "d") : diffms > HOUR_MS ? (~~(diffms / HOUR_MS) + "h") : diffms > MIN_MS ? (~~(diffms / MIN_MS) + "m") : '1m';
  }
  var $__default = timeAgo;
  PolymerExpressions.prototype.timeAgo = timeAgo;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=filters/timeAgo.js
System.registerModule("filters/trueFalseTo.js", [], function() {
  "use strict";
  var __moduleName = "filters/trueFalseTo.js";
  var $__default = PolymerExpressions.prototype.trueFalseTo = {
    toDOM: (function(isTrue, trueValue, falseValue) {
      return isTrue ? trueValue : falseValue;
    }),
    toModel: (function(newValue, trueValue, falseValue) {
      return newValue === trueValue;
    })
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=filters/trueFalseTo.js
System.registerModule("helpers/KEYCODES.js", [], function() {
  "use strict";
  var __moduleName = "helpers/KEYCODES.js";
  var $__default = {
    SHIFT: 16,
    BACKSPACE: 8,
    ENTER: 13,
    ESC: 27,
    TAB: 9,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/KEYCODES.js
System.registerModule("helpers/MapperUtils.js", [], function() {
  "use strict";
  var __moduleName = "helpers/MapperUtils.js";
  function load(model, data) {
    return data && model.$load(data);
  }
  function loadAll(modelArray, data) {
    return data && modelArray.$replace(modelArray.$class.loadAll(data));
  }
  return {
    get load() {
      return load;
    },
    get loadAll() {
      return loadAll;
    }
  };
});
//# sourceURL=helpers/MapperUtils.js
System.registerModule("helpers/StatefulPolymer.js", [], function() {
  "use strict";
  var __moduleName = "helpers/StatefulPolymer.js";
  var StateChart = System.get("helpers/svengali.js").StateChart;
  var bindInputToState = {
    toDOM: function(val, attr) {
      return this.state[attr];
    },
    toModel: function(val, attr) {
      if (this.state[attr] !== val)
        this._statechart.fire((attr + "Changed"), val);
      if (window.event && window.event.target && window.event.target.value !== this.state[attr])
        window.event.target.value = this.state[attr];
      return this.state[attr];
    }
  };
  function stateFire(statechart, stateEvent, $__1) {
    var currentTarget = $__1.currentTarget;
    var fireArg = currentTarget.getAttribute('fire-arg');
    if (fireArg)
      statechart.fire(stateEvent, currentTarget.templateInstance.model[fireArg]);
    else
      statechart.fire(stateEvent);
  }
  function addFireFuncs(object, statechart) {
    var events = statechart.events;
    for (var i = events.length; i--; )
      object[("stateFire." + events[i])] = stateFire.bind(null, statechart, events[i]);
  }
  function StatefulPolymer(name, options) {
    var stateConfig = options.state;
    var origCreated = options.created;
    options.state = null;
    if (stateConfig instanceof StateChart)
      addFireFuncs(options, stateConfig);
    options.bindInputToState = bindInputToState;
    options.created = function() {
      this._statechart = (stateConfig instanceof StateChart) ? stateConfig : new StateChart(stateConfig);
      addFireFuncs(this, this._statechart);
      this.state = this._statechart.attrs;
      if (origCreated)
        origCreated.call(this);
    };
    window.Polymer(name, options);
  }
  var $__default = StatefulPolymer;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/StatefulPolymer.js
System.registerModule("helpers/is.js", [], function() {
  "use strict";
  var __moduleName = "helpers/is.js";
  var $__default = {
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/is.js
System.registerModule("helpers/isEqual.js", [], function() {
  "use strict";
  var __moduleName = "helpers/isEqual.js";
  var is = System.get("helpers/is.js").default;
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
  var $__default = isEqual;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/isEqual.js
System.registerModule("helpers/load.js", [], function() {
  "use strict";
  var __moduleName = "helpers/load.js";
  var is = System.get("helpers/is.js").default;
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
  var $__default = function loadJSON(url) {
    var response,
        $__2,
        $__3,
        $__4,
        $__5;
    return $traceurRuntime.asyncWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__2 = loadJSON.accessToken;
            $__3 = loadResource("json", url, $__2);
            $ctx.state = 5;
            break;
          case 5:
            Promise.resolve($__3).then($ctx.createCallback(3), $ctx.errback);
            return;
          case 3:
            $__4 = $ctx.value;
            $ctx.state = 2;
            break;
          case 2:
            $__5 = $__4.response;
            response = $__5;
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
  };
  return {
    get loadResource() {
      return loadResource;
    },
    get default() {
      return $__default;
    }
  };
});
//# sourceURL=helpers/load.js
System.registerModule("helpers/singularize.js", [], function() {
  "use strict";
  var __moduleName = "helpers/singularize.js";
  function singularize(word) {
    return word.replace(/s$/, '');
  }
  var $__default = singularize;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/singularize.js
System.registerModule("helpers/svengali.js", [], function() {
  "use strict";
  var __moduleName = "helpers/svengali.js";
  var EMPTY_OBJ = {};
  var nextStateUID = 1;
  var StateChart = function StateChart(rootStateOptions) {
    this.events = [];
    this.attrs = {};
    this.rootState = new State(null, this, rootStateOptions);
  };
  ($traceurRuntime.createClass)(StateChart, {
    goto: function() {
      var path = arguments[0] !== (void 0) ? arguments[0] : '.';
      var params = arguments[1] !== (void 0) ? arguments[1] : {};
      this.rootState.scState.goto(path, {context: params});
    },
    fire: function(eventName) {
      var $__7;
      for (var args = [],
          $__2 = 1; $__2 < arguments.length; $__2++)
        args[$__2 - 1] = arguments[$__2];
      ($__7 = this.rootState.scState).send.apply($__7, $traceurRuntime.spread([eventName], args));
    }
  }, {});
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
  var State = function State(parent, stateChart, $__5) {
    var $__6 = $__5,
        attrs = $__6.attrs,
        enter = $__6.enter,
        exit = $__6.exit,
        events = $__6.events,
        history = $__6.history,
        parallelStates = $__6.parallelStates,
        params = $__6.params,
        states = $__6.states,
        defaultState = $__6.defaultState;
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
    this.defaultState = defaultState;
    var scState = this.scState = statechart.State(name, {
      name: name,
      concurrent: !!parallelStates,
      history: !!history
    });
    if (params)
      scState.canEnter = (function(states, params) {
        return $__0._doCanEnter(params);
      });
    if (defaultState)
      scState.C((function(params) {
        return $__0._doDefaultState(params);
      }));
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
        return scState.addSubstate(new $State($__0, stateChart, states[stateName], stateName).scState);
      }));
  };
  var $State = State;
  ($traceurRuntime.createClass)(State, {
    fire: function(eventName) {
      var $__7;
      for (var args = [],
          $__3 = 1; $__3 < arguments.length; $__3++)
        args[$__3 - 1] = arguments[$__3];
      ($__7 = this.stateChart).fire.apply($__7, $traceurRuntime.spread([eventName], args));
    },
    get isCurrent() {
      return this.scState.__isCurrent__;
    },
    _doDefaultState: function() {
      var params = arguments[0] !== (void 0) ? arguments[0] : {};
      this._currentParams = params;
      return this.defaultState(params);
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
            $__4 = 0; $__4 < arguments.length; $__4++)
          args[$__4] = arguments[$__4];
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
      if (callback) {
        this.scState.event(eventName, callback);
        if (this.stateChart.events.indexOf(eventName) === -1)
          this.stateChart.events.push(eventName);
      }
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
  return {
    get StateChart() {
      return StateChart;
    },
    get reenter() {
      return reenter;
    },
    get goto() {
      return goto;
    },
    get attrValue() {
      return attrValue;
    },
    get State() {
      return State;
    }
  };
});
//# sourceURL=helpers/svengali.js
System.registerModule("models/User.js", [], function() {
  "use strict";
  var __moduleName = "models/User.js";
  var Model = System.get("helpers/model/Model.js").default;
  var Source = System.get("models/sources/Source.js").default;
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
  var User = function User(attrs) {
    this._sources = attrs.sources;
    $traceurRuntime.superConstructor($User).call(this, attrs);
  };
  var $User = User;
  ($traceurRuntime.createClass)(User, {get sources() {
      return this._sources;
    }}, {}, Model);
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
  var $__default = User;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/User.js
System.registerModule("states/appState.js", [], function() {
  "use strict";
  var __moduleName = "states/appState.js";
  var $__0 = System.get("helpers/svengali.js"),
      StateChart = $__0.StateChart,
      goto = $__0.goto;
  var loggedInState = System.get("states/loggedInState.js").default;
  var loggedOutState = System.get("states/loggedOutState.js").default;
  var appState = new StateChart({
    attrs: {
      'firebaseRef': (function() {
        return new window.Firebase(CONFIG.firebaseUrl);
      }),
      'DRAWER_SWIPE_DISABLED': !/Chrome/.test(window.navigator.userAgent) && /AppleWebKit.*Mobile.*Safari/.test(window.navigator.userAgent)
    },
    enter: function() {
      var $__3 = this;
      setTimeout((function() {
        $__3.attrs.firebaseRef.onAuth((function(authData) {
          var github = authData && authData.github;
          if (github)
            $__3.fire('authSuccessful', github.id, github.username, {github: github.accessToken});
          else
            $__3.fire('authFailed');
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
  if (window.CONFIG && window.CONFIG.statechartTrace) {
    appState.rootState.scState.trace = true;
    window.appState = appState;
  }
  var $__default = appState;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/appState.js
System.registerModule("states/githubCommitState.js", [], function() {
  "use strict";
  var __moduleName = "states/githubCommitState.js";
  var GithubCommit = System.get("models/github/GithubCommit.js").default;
  var $__default = {
    params: ['githubCommitURL'],
    attrs: {
      'appOverlayView': (function() {
        return 'overlay-github-commit';
      }),
      'commit': (function($__1) {
        var githubCommitURL = $__1.githubCommitURL;
        return GithubCommit.get(githubCommitURL);
      })
    }
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/githubCommitState.js
System.registerModule("states/loggedInState.js", [], function() {
  "use strict";
  var __moduleName = "states/loggedInState.js";
  var $__0 = System.get("helpers/svengali.js"),
      goto = $__0.goto,
      reenter = $__0.reenter;
  var load = System.get("helpers/load.js").default;
  var githubCommitState = System.get("states/githubCommitState.js").default;
  var sourceState = System.get("states/sourceState.js").default;
  var searchState = System.get("states/searchState.js").default;
  var $__default = {
    params: ['user', 'accessTokens'],
    attrs: {
      'user': (function($__5) {
        var user = $__5.user;
        return user;
      }),
      'accessTokens': (function($__5) {
        var accessTokens = $__5.accessTokens;
        load.accessToken = accessTokens.github;
        return accessTokens;
      })
    },
    parallelStates: {
      'appDrawer': {
        attrs: {'appDrawerOpened': (function($__5) {
            var appDrawerOpened = $__5.appDrawerOpened;
            return !!appDrawerOpened;
          })},
        events: {
          'selectSearch, selectSource': reenter({appDrawerOpened: false}),
          'toggleAppDrawer': function() {
            return reenter({appDrawerOpened: !this.attrs.appDrawerOpened});
          },
          'appDrawerOpenedChanged': (function(appDrawerOpened) {
            return reenter({appDrawerOpened: appDrawerOpened});
          })
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
      },
      'appOverlayView': {
        events: {
          'selectAppOverlayGithubCommit': (function($__5) {
            var url = $__5.url;
            return goto('githubCommit', {githubCommitURL: url});
          }),
          'hideAppOverlay': goto('off')
        },
        states: {
          'off': {},
          'githubCommit': githubCommitState
        }
      }
    }
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/loggedInState.js
System.registerModule("states/loggedOutState.js", [], function() {
  "use strict";
  var __moduleName = "states/loggedOutState.js";
  var goto = System.get("helpers/svengali.js").goto;
  var User = System.get("models/User.js").default;
  var Source = System.get("models/sources/Source.js").default;
  var GithubUserSource = System.get("models/sources/GithubUserSource.js").default;
  var $__default = {states: {
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
      'retrieveUser': {enter: function($__4) {
          var $__5,
              authId,
              githubUsername,
              accessTokens,
              user,
              e;
          return $traceurRuntime.asyncWrap(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__5 = $__4, authId = $__5.authId, githubUsername = $__5.githubUsername, accessTokens = $__5.accessTokens;
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
    }};
  function createUserWithDefaults($__4) {
    var $__5 = $__4,
        id = $__5.id,
        githubUsername = $__5.githubUsername;
    return new User({
      githubUsername: githubUsername,
      id: id,
      sources: [new GithubUserSource({login: "Polymer"}), new GithubUserSource({login: "web-animations"})]
    }).$save().$promise;
  }
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/loggedOutState.js
System.registerModule("states/searchState.js", [], function() {
  "use strict";
  var __moduleName = "states/searchState.js";
  var reenter = System.get("helpers/svengali.js").reenter;
  var Source = System.get("models/sources/Source.js").default;
  var GithubRepoSource = System.get("models/sources/GithubRepoSource.js").default;
  var currentQuery = null;
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
  var $__default = {
    attrs: {
      'appView': 'search',
      'searchText': (function($__3) {
        var searchText = $__3.searchText;
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/searchState.js
System.registerModule("states/sourceState.js", [], function() {
  "use strict";
  var __moduleName = "states/sourceState.js";
  var reenter = System.get("helpers/svengali.js").reenter;
  var $__default = {
    attrs: {
      'appView': function() {
        return ("source-" + this.attrs.source.constructor.name);
      },
      'isSourceFavorited': function() {
        return this.attrs.user.sources.indexOf(this.attrs.source) !== -1;
      },
      'source': function($__1) {
        var s = $__1.source;
        return s || this.attrs.user.sources[7];
      }
    },
    events: {
      'selectSource': (function(source) {
        return reenter({source: source});
      }),
      'toggleFavoriteSource': function() {
        var $__1 = this.attrs,
            user = $__1.user,
            source = $__1.source,
            isSourceFavorited = $__1.isSourceFavorited;
        if (isSourceFavorited) {
          var index = user.sources.indexOf(source);
          if (index !== -1)
            user.sources.splice(index, 1);
        } else {
          if (user.sources.indexOf(source) === -1)
            user.sources.push(source);
        }
        user.$save();
        return reenter({source: source});
      }
    },
    defaultState: function() {
      return this.attrs.source.constructor.name;
    },
    states: {
      'GithubUserSource': {states: {'tab': {
            attrs: {'tab': (function($__1) {
                var tab = $__1.tab;
                return tab || 'updates';
              })},
            events: {'tabChanged': (function(tab) {
                return ['updates', 'repos', 'info'].indexOf(tab) + 1 && reenter({tab: tab});
              })}
          }}},
      'GithubRepoSource': {states: {'tab': {
            attrs: {'tab': (function($__1) {
                var tab = $__1.tab;
                return tab || 'updates';
              })},
            events: {'tabChanged': (function(tab) {
                return ['updates', 'code', 'pullRequests', 'issues', 'info'].indexOf(tab) + 1 && reenter({tab: tab});
              })}
          }}}
    }
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=states/sourceState.js
System.registerModule("elements/cards/ticker-github-events-card.js", [], function() {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-events-card.js";
  var StatefulPolymer = System.get("helpers/StatefulPolymer.js").default;
  var appState = System.get("states/appState.js").default;
  StatefulPolymer('ticker-github-events-card', {state: appState});
  return {};
});
//# sourceURL=elements/cards/ticker-github-events-card.js
System.registerModule("elements/cards/ticker-github-repo.js", [], function() {
  "use strict";
  var __moduleName = "elements/cards/ticker-github-repo.js";
  Polymer('ticker-github-repo', {repoChanged: function(_, repo) {
      var $__0;
      if (repo)
        ($__0 = repo.split('/'), this.repoOwner = $__0[0], this.repoName = $__0[1], $__0);
    }});
  return {};
});
//# sourceURL=elements/cards/ticker-github-repo.js
System.registerModule("helpers/model/IDMap.js", [], function() {
  "use strict";
  var __moduleName = "helpers/model/IDMap.js";
  var nextClassId = 0;
  var models = {};
  var $__default = {
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/model/IDMap.js
System.registerModule("helpers/model/Mapper.js", [], function() {
  "use strict";
  var __moduleName = "helpers/model/Mapper.js";
  var $__default = {
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/model/Mapper.js
System.registerModule("helpers/model/Model.js", [], function() {
  "use strict";
  var __moduleName = "helpers/model/Model.js";
  var IDMap = System.get("helpers/model/IDMap.js").default;
  var isEqual = System.get("helpers/isEqual.js").default;
  var singularize = System.get("helpers/singularize.js").default;
  var $__3 = System.get("helpers/model/attrs.js"),
      IdentityAttr = $__3.IdentityAttr,
      StringAttr = $__3.StringAttr,
      NumberAttr = $__3.NumberAttr,
      BooleanAttr = $__3.BooleanAttr,
      DateAttr = $__3.DateAttr,
      DateTimeAttr = $__3.DateTimeAttr;
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
  var allModels = {};
  var attrRe = /^__attr_(.*)__$/;
  var assocRe = /^__assoc_(.*)__$/;
  var attrTypes = {};
  var capitalize = (function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  var resolve = (function(name) {
    return allModels[name];
  });
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
    var $__19 = desc,
        name = $__19.name,
        inverse = $__19.inverse;
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
    var $__4 = this;
    var name = desc.name;
    var prev = this[name];
    a.forEach(checkAssociatedType.bind(this, desc));
    if (desc.inverse) {
      prev.forEach((function(x) {
        return inverseRemoved.call(x, desc.inverse, $__4);
      }));
      a.forEach((function(x) {
        return inverseAdded.call(x, desc.inverse, $__4);
      }));
    }
    this[("__" + desc.name + "__")] = a;
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyAdd(desc, models, sync) {
    var $__4 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      checkAssociatedType.call($__4, desc, m);
      if (sync && desc.inverse)
        inverseAdded.call(m, desc.inverse, $__4);
      $__4[name].push(m);
    }));
    if (desc.owner && this.$isLoaded)
      setChange.call(this, name, prev);
  }
  function hasManyRemove(desc, models, sync) {
    var $__4 = this;
    var name = desc.name;
    var prev = this[name].slice();
    models.forEach((function(m) {
      var i = $__4[name].indexOf(m);
      if (i >= 0) {
        if (sync && desc.inverse)
          inverseRemoved.call(m, desc.inverse, $__4);
        $__4[name].splice(i, 1);
        if (desc.owner && $__4.$isLoaded)
          setChange.call($__4, name, prev);
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
          var $__20;
          for (var args = [],
              $__10 = 0; $__10 < arguments.length; $__10++)
            args[$__10] = arguments[$__10];
          var $__4 = this;
          if (isBusy) {
            queued = args;
          } else {
            isBusy = true;
            promise = ensurePromise(($__20 = klass.mapper).query.apply($__20, $traceurRuntime.spread($traceurRuntime.spread([this], args))), '$query').then((function() {
              var $__21;
              isBusy = false;
              if (queued)
                ($__21 = $__4).$query.apply($__21, $traceurRuntime.spread(queued));
              return $__4;
            }), (function(error) {
              var $__21;
              isBusy = false;
              if (queued)
                ($__21 = $__4).$query.apply($__21, $traceurRuntime.spread(queued));
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
          var $__20;
          ($__20 = this).splice.apply($__20, $traceurRuntime.spread($traceurRuntime.spread([0, this.length], a)));
          return this;
        },
        enumerable: false,
        configurable: false,
        writable: false
      }
    });
  }
  function mapperGet(model) {
    var $__20;
    for (var args = [],
        $__10 = 1; $__10 < arguments.length; $__10++)
      args[$__10 - 1] = arguments[$__10];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__20 = model.constructor.mapper).get.apply($__20, $traceurRuntime.spread([model], args)), 'mapperGet').then((function() {
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
    var $__20;
    for (var args = [],
        $__11 = 1; $__11 < arguments.length; $__11++)
      args[$__11 - 1] = arguments[$__11];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__20 = model.constructor.mapper).create.apply($__20, $traceurRuntime.spread([model], args)), 'mapperCreate').then((function() {
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
    var $__20;
    for (var args = [],
        $__12 = 1; $__12 < arguments.length; $__12++)
      args[$__12 - 1] = arguments[$__12];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__20 = model.constructor.mapper).update.apply($__20, $traceurRuntime.spread([model], args)), 'mapperUpdate').then((function() {
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
    for (var $__6 = Object.keys(associations)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__7; !($__7 = $__6.next()).done; ) {
      var name = $__7.value;
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
    var $__20;
    for (var args = [],
        $__13 = 1; $__13 < arguments.length; $__13++)
      args[$__13 - 1] = arguments[$__13];
    model.__$isBusy__ = true;
    model.__$promise__ = ensurePromise(($__20 = model.constructor.mapper).delete.apply($__20, $traceurRuntime.spread([model], args)), 'mapperDelete').then((function() {
      model.__$isBusy__ = false;
      mapperDeleteSuccess(model);
    }), (function(error) {
      model.__$isBusy__ = false;
      throw error;
    }));
    return model;
  }
  var Model = function Model() {
    var attrs = arguments[0] !== (void 0) ? arguments[0] : {};
    this.__$sourceState__ = NEW;
    this.__$isBusy__ = false;
    this.changes = {};
    for (var k in attrs)
      if (this.constructor.hasName(k))
        this[k] = attrs[k];
  };
  ($traceurRuntime.createClass)(Model, {
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
            for (var $__6 = assoc[$traceurRuntime.toProperty(Symbol.iterator)](),
                $__7; !($__7 = $__6.next()).done; ) {
              var o = $__7.value;
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
          $__14 = 0; $__14 < arguments.length; $__14++)
        args[$__14] = arguments[$__14];
      if ((!this.$isLoaded && !this.$isEmpty) || this.$isBusy)
        throw (this.$className() + "#$get: cannot get a model in the " + this.$stateString() + " state: " + this);
      return mapperGet.apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
    },
    $save: function() {
      for (var args = [],
          $__15 = 0; $__15 < arguments.length; $__15++)
        args[$__15] = arguments[$__15];
      if ((!this.$isNew && !this.$isLoaded) || this.$isBusy)
        throw (this.$className() + "#$save: cannot save a model in the " + this.$stateString() + " state: " + this);
      (this.$isNew ? mapperCreate : mapperUpdate).apply(null, $traceurRuntime.spread($traceurRuntime.spread([this], args)));
      return this;
    },
    $delete: function() {
      for (var args = [],
          $__16 = 0; $__16 < arguments.length; $__16++)
        args[$__16] = arguments[$__16];
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
            $__17 = 0; $__17 < arguments.length; $__17++)
          args[$__17] = arguments[$__17];
        hasManyAdd.call(this, desc, (1 <= args.length ? args : []), true);
      };
      this.prototype[("remove" + cap)] = function() {
        for (var args = [],
            $__18 = 0; $__18 < arguments.length; $__18++)
          args[$__18] = arguments[$__18];
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
            for (var $__6 = data[$traceurRuntime.toProperty(Symbol.iterator)](),
                $__7; !($__7 = $__6.next()).done; ) {
              o = $__7.value;
              others.push(typeof o === 'object' ? klass.load(o) : IDMap.get(klass, o) || klass.empty(o));
            }
            model[name] = others;
            for (var $__8 = others[$traceurRuntime.toProperty(Symbol.iterator)](),
                $__9; !($__9 = $__8.next()).done; ) {
              o = $__9.value;
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
      var $__4 = this;
      return objects.map((function(o) {
        return $__4.load(o);
      }));
    },
    query: function() {
      var $__20;
      for (var args = [],
          $__17 = 0; $__17 < arguments.length; $__17++)
        args[$__17] = arguments[$__17];
      return ($__20 = this.buildQuery()).$query.apply($__20, $traceurRuntime.spread(args));
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
          $__18 = 0; $__18 < arguments.length; $__18++)
        args[$__18] = arguments[$__18];
      return extendMany(this, args);
    }
  });
  var NEW = Model.NEW = 'new';
  var EMPTY = Model.EMPTY = 'empty';
  var LOADED = Model.LOADED = 'loaded';
  var DELETED = Model.DELETED = 'deleted';
  var NOTFOUND = Model.NOTFOUND = 'notfound';
  Model.toString = Model.className;
  Model.registerAttr('identity', IdentityAttr);
  Model.registerAttr('string', StringAttr);
  Model.registerAttr('number', NumberAttr);
  Model.registerAttr('boolean', BooleanAttr);
  Model.registerAttr('date', DateAttr);
  Model.registerAttr('datetime', DateTimeAttr);
  var $__default = Model;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=helpers/model/Model.js
System.registerModule("helpers/model/attrs.js", [], function() {
  "use strict";
  var __moduleName = "helpers/model/attrs.js";
  var IdentityAttr = {
    coerce: (function(v) {
      return v;
    }),
    serialize: (function(v) {
      return v;
    })
  };
  var StringAttr = {
    coerce: (function(v) {
      return v ? '' + v : v;
    }),
    serialize: (function(s) {
      return s;
    })
  };
  var NumberAttr = {
    coerce: (function(v) {
      return (typeof v === 'string') ? parseFloat(v, 10) : (typeof v === 'number') ? v : null;
    }),
    serialize: (function(v) {
      return v;
    })
  };
  var BooleanAttr = {
    coerce: (function(v) {
      return !!v;
    }),
    serialize: (function(v) {
      return v;
    })
  };
  var DateAttr = {
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
  };
  var noTZRe = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?$/;
  var DateTimeAttr = {
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
  };
  return {
    get IdentityAttr() {
      return IdentityAttr;
    },
    get StringAttr() {
      return StringAttr;
    },
    get NumberAttr() {
      return NumberAttr;
    },
    get BooleanAttr() {
      return BooleanAttr;
    },
    get DateAttr() {
      return DateAttr;
    },
    get DateTimeAttr() {
      return DateTimeAttr;
    }
  };
});
//# sourceURL=helpers/model/attrs.js
System.registerModule("models/github/GithubComment.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubComment.js";
  var Model = System.get("helpers/model/Model.js").default;
  var GithubComment = function GithubComment() {
    $traceurRuntime.superConstructor($GithubComment).apply(this, arguments);
  };
  var $GithubComment = GithubComment;
  ($traceurRuntime.createClass)(GithubComment, {}, {}, Model);
  GithubComment.create((function($) {
    $.attr('url', 'string');
    $.attr('body', 'string');
    $.attr('commit_id', 'string');
    $.attr('line', 'number');
    $.attr('path', 'string');
    $.attr('position', 'number');
    $.attr('created_at', 'datetime');
    $.attr('updated_at', 'datetime');
    $.hasOne('user', 'GithubUser');
  }));
  var $__default = GithubComment;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubComment.js
System.registerModule("models/github/GithubCommit.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubCommit.js";
  var loadJSON = System.get("helpers/load.js").default;
  var load = System.get("helpers/MapperUtils.js").load;
  var Model = System.get("helpers/model/Model.js").default;
  var GithubCommitFile = function GithubCommitFile() {
    $traceurRuntime.superConstructor($GithubCommitFile).apply(this, arguments);
  };
  var $GithubCommitFile = GithubCommitFile;
  ($traceurRuntime.createClass)(GithubCommitFile, {}, {}, Model);
  GithubCommitFile.create((function($) {
    $.attr('filename', 'string');
    $.attr('status', 'string');
    $.attr('additions', 'number');
    $.attr('deletions', 'number');
    $.attr('linesChanged', 'number');
    $.attr('patch', 'string');
  }));
  var GithubCommit = function GithubCommit() {
    $traceurRuntime.superConstructor($GithubCommit).apply(this, arguments);
  };
  var $GithubCommit = GithubCommit;
  ($traceurRuntime.createClass)(GithubCommit, {}, {}, Model);
  GithubCommit.create((function($) {
    $.attr('created_at', 'datetime');
    $.attr('message', 'string');
    $.attr('sha', 'string');
    $.attr('stats', 'identity');
    $.hasOne('author', 'GithubUser');
    $.hasOne('committer', 'GithubUser');
    $.hasMany('files', 'GithubCommitFile');
    $.mapper = {get: (function(model) {
        var json,
            $__3,
            $__4,
            file;
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                Promise.resolve(loadJSON(model.id)).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                json = $ctx.value;
                $ctx.state = 2;
                break;
              case 2:
                json.id = model.id;
                json.message = json.commit.message;
                for ($__3 = json.files[$traceurRuntime.toProperty(Symbol.iterator)](); !($__4 = $__3.next()).done; ) {
                  file = $__4.value;
                  {
                    file.id = file.sha;
                    file.linesChanged = file.changes;
                    delete file.changes;
                  }
                }
                $ctx.state = 8;
                break;
              case 8:
                $ctx.returnValue = load(model, json);
                $ctx.state = 5;
                break;
              case 5:
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, this);
      })};
  }));
  var $__default = GithubCommit;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubCommit.js
System.registerModule("models/github/GithubEvent.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubEvent.js";
  var Model = System.get("helpers/model/Model.js").default;
  var GithubEventMapper = System.get("models/github/GithubEventMapper.js").default;
  var GithubUser = System.get("models/github/GithubUser.js").default;
  var GithubRepo = System.get("models/github/GithubRepo.js").default;
  var GithubIssue = System.get("models/github/GithubIssue.js").default;
  var GithubEvent = function GithubEvent() {
    $traceurRuntime.superConstructor($GithubEvent).apply(this, arguments);
  };
  var $GithubEvent = GithubEvent;
  ($traceurRuntime.createClass)(GithubEvent, {fetchDetails: function() {
      GithubIssue.get();
    }}, {}, Model);
  GithubEvent.create((function($) {
    $.mapper = GithubEventMapper;
    $.attr('type', 'string');
    $.attr('payload', 'identity');
    $.attr('created_at', 'datetime');
    $.hasOne('actor', 'GithubUser');
    $.hasOne('repo', 'GithubRepo');
  }));
  var $__default = GithubEvent;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubEvent.js
System.registerModule("models/github/GithubEventMapper.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubEventMapper.js";
  var loadJSON = System.get("helpers/load.js").default;
  var loadAll = System.get("helpers/MapperUtils.js").loadAll;
  var $__default = {query: (function(array, $__2) {
      var $__3,
          type,
          id,
          $__4,
          $__5,
          $__6;
      return $traceurRuntime.asyncWrap(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__3 = $__2, type = $__3.type, id = $__3.id;
              $ctx.state = 12;
              break;
            case 12:
              $__4 = loadJSON(("https://api.github.com/" + type + "/" + id + "/events"));
              $ctx.state = 5;
              break;
            case 5:
              Promise.resolve($__4).then($ctx.createCallback(3), $ctx.errback);
              return;
            case 3:
              $__5 = $ctx.value;
              $ctx.state = 2;
              break;
            case 2:
              $__6 = loadAll(array, $__5);
              $ctx.state = 7;
              break;
            case 7:
              $ctx.returnValue = $__6;
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, this);
    })};
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubEventMapper.js
System.registerModule("models/github/GithubEventPayloads.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubEventPayloads.js";
  var Model = System.get("helpers/model/Model.js").default;
  var GithubComment = System.get("models/github/GithubComment.js").default;
  var GithubRepo = System.get("models/github/GithubRepo.js").default;
  var GithubUser = System.get("models/github/GithubUser.js").default;
  var CommitCommentEvent = function CommitCommentEvent() {
    $traceurRuntime.superConstructor($CommitCommentEvent).apply(this, arguments);
  };
  var $CommitCommentEvent = CommitCommentEvent;
  ($traceurRuntime.createClass)(CommitCommentEvent, {}, {}, Model);
  CommitCommentEvent.create((function($) {
    $.hasOne('comment', 'GithubComment');
    $.hasOne('repository', 'GithubRepo');
    $.hasOne('sender', 'GithubUser');
  }));
  var CreateEvent = function CreateEvent() {
    $traceurRuntime.superConstructor($CreateEvent).apply(this, arguments);
  };
  var $CreateEvent = CreateEvent;
  ($traceurRuntime.createClass)(CreateEvent, {}, {}, Model);
  CreateEvent.create((function($) {
    $.attr('description', 'string');
    $.attr('masterBranch', 'string');
    $.attr('pusherType', 'string');
    $.attr('ref', 'string');
    $.attr('refType', 'string');
    $.hasOne('repository', 'GithubRepo');
    $.hasOne('sender', 'GithubUser');
  }));
  var DeleteEvent = function DeleteEvent() {
    $traceurRuntime.superConstructor($DeleteEvent).apply(this, arguments);
  };
  var $DeleteEvent = DeleteEvent;
  ($traceurRuntime.createClass)(DeleteEvent, {}, {}, Model);
  DeleteEvent.create((function($) {
    $.attr('description', 'string');
    $.attr('masterBranch', 'string');
    $.attr('pusherType', 'string');
    $.attr('ref', 'string');
    $.attr('refType', 'string');
    $.hasOne('repository', 'GithubRepo');
    $.hasOne('sender', 'GithubUser');
  }));
  return {
    get CommitCommentEvent() {
      return CommitCommentEvent;
    },
    get CreateEvent() {
      return CreateEvent;
    },
    get DeleteEvent() {
      return DeleteEvent;
    }
  };
});
//# sourceURL=models/github/GithubEventPayloads.js
System.registerModule("models/github/GithubIssue.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubIssue.js";
  var loadJSON = System.get("helpers/load.js").default;
  var loadAll = System.get("helpers/MapperUtils.js").loadAll;
  var Model = System.get("helpers/model/Model.js").default;
  var GithubIssue = function GithubIssue() {
    $traceurRuntime.superConstructor($GithubIssue).apply(this, arguments);
  };
  var $GithubIssue = GithubIssue;
  ($traceurRuntime.createClass)(GithubIssue, {}, {}, Model);
  GithubIssue.create((function($) {
    $.attr('created_at', 'datetime');
    $.attr('title', 'string');
    $.attr('body', 'string');
    $.attr('number', 'number');
    $.attr('state', 'string');
    $.hasOne('user', 'GithubUser');
    $.mapper = {query: (function(array, $__3) {
        var repo,
            $__5,
            $__6,
            $__7;
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                repo = $__3.repo;
                $ctx.state = 12;
                break;
              case 12:
                $__5 = loadJSON(("https://api.github.com/repos/" + repo + "/issues"));
                $ctx.state = 5;
                break;
              case 5:
                Promise.resolve($__5).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                $__6 = $ctx.value;
                $ctx.state = 2;
                break;
              case 2:
                $__7 = loadAll(array, $__6);
                $ctx.state = 7;
                break;
              case 7:
                $ctx.returnValue = $__7;
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, this);
      })};
  }));
  var $__default = GithubIssue;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubIssue.js
System.registerModule("models/github/GithubPullRequest.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubPullRequest.js";
  var loadJSON = System.get("helpers/load.js").default;
  var loadAll = System.get("helpers/MapperUtils.js").loadAll;
  var Model = System.get("helpers/model/Model.js").default;
  var GithubEventMapper = System.get("models/github/GithubEventMapper.js").default;
  var GithubIssue = System.get("models/github/GithubIssue.js").default;
  var GithubUser = System.get("models/github/GithubUser.js").default;
  var GithubPullRequest = function GithubPullRequest() {
    $traceurRuntime.superConstructor($GithubPullRequest).apply(this, arguments);
  };
  var $GithubPullRequest = GithubPullRequest;
  ($traceurRuntime.createClass)(GithubPullRequest, {getComments: function() {
      throw 'NOT IMPLEMENTED';
    }}, {}, Model);
  GithubPullRequest.create((function($) {
    $.mapper = {query: (function(array, $__7) {
        var repo,
            $__9,
            $__10,
            $__11;
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                repo = $__7.repo;
                $ctx.state = 12;
                break;
              case 12:
                $__9 = loadJSON(("https://api.github.com/repos/" + repo + "/pulls"));
                $ctx.state = 5;
                break;
              case 5:
                Promise.resolve($__9).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                $__10 = $ctx.value;
                $ctx.state = 2;
                break;
              case 2:
                $__11 = loadAll(array, $__10);
                $ctx.state = 7;
                break;
              case 7:
                $ctx.returnValue = $__11;
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, this);
      })};
    $.attr('created_at', 'datetime');
    $.attr('title', 'string');
    $.attr('body', 'string');
    $.attr('number', 'number');
    $.attr('state', 'string');
    $.hasOne('user', 'GithubUser');
  }));
  var $__default = GithubPullRequest;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubPullRequest.js
System.registerModule("models/github/GithubRepo.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubRepo.js";
  var Model = System.get("helpers/model/Model.js").default;
  var GithubRepoMapper = System.get("models/github/GithubRepoMapper.js").default;
  var GithubRepo = function GithubRepo() {
    $traceurRuntime.superConstructor($GithubRepo).apply(this, arguments);
  };
  var $GithubRepo = GithubRepo;
  ($traceurRuntime.createClass)(GithubRepo, {}, {}, Model);
  GithubRepo.create((function($) {
    $.mapper = GithubRepoMapper;
    $.attr('full_name', 'string');
    $.attr('name', 'string');
    $.attr('url', 'string');
    $.attr('score', 'number');
  }));
  var $__default = GithubRepo;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubRepo.js
System.registerModule("models/github/GithubRepoMapper.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubRepoMapper.js";
  var loadJSON = System.get("helpers/load.js").default;
  var $__1 = System.get("helpers/MapperUtils.js"),
      load = $__1.load,
      loadAll = $__1.loadAll;
  var $__default = {
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
    query: (function(array, $__2) {
      var term,
          $__4,
          $__5,
          $__6,
          $__7;
      return $traceurRuntime.asyncWrap(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              term = $__2.term;
              $ctx.state = 12;
              break;
            case 12:
              $__4 = loadJSON(("https://api.github.com/search/repositories?q=" + term));
              $ctx.state = 5;
              break;
            case 5:
              Promise.resolve($__4).then($ctx.createCallback(3), $ctx.errback);
              return;
            case 3:
              $__5 = $ctx.value;
              $ctx.state = 2;
              break;
            case 2:
              $__6 = $__5.items;
              $__7 = loadAll(array, $__6);
              $ctx.state = 7;
              break;
            case 7:
              $ctx.returnValue = $__7;
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubRepoMapper.js
System.registerModule("models/github/GithubUser.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubUser.js";
  var loadJSON = System.get("helpers/load.js").default;
  var $__1 = System.get("helpers/MapperUtils.js"),
      load = $__1.load,
      loadAll = $__1.loadAll;
  var Model = System.get("helpers/model/Model.js").default;
  var GithubUser = function GithubUser() {
    $traceurRuntime.superConstructor($GithubUser).apply(this, arguments);
  };
  var $GithubUser = GithubUser;
  ($traceurRuntime.createClass)(GithubUser, {}, {}, Model);
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
      query: (function(array, $__3) {
        var term,
            $__5,
            $__6,
            $__7,
            $__8;
        return $traceurRuntime.asyncWrap(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                term = $__3.term;
                $ctx.state = 12;
                break;
              case 12:
                $__5 = loadJSON(("https://api.github.com/search/users?q=" + term));
                $ctx.state = 5;
                break;
              case 5:
                Promise.resolve($__5).then($ctx.createCallback(3), $ctx.errback);
                return;
              case 3:
                $__6 = $ctx.value;
                $ctx.state = 2;
                break;
              case 2:
                $__7 = $__6.items;
                $__8 = loadAll(array, $__7);
                $ctx.state = 7;
                break;
              case 7:
                $ctx.returnValue = $__8;
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
    };
  }));
  var $__default = GithubUser;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubUser.js
System.registerModule("models/github/GithubUserMapper.js", [], function() {
  "use strict";
  var __moduleName = "models/github/GithubUserMapper.js";
  var loadJSON = System.get("helpers/load.js").default;
  var $__1 = System.get("helpers/MapperUtils.js"),
      load = $__1.load,
      loadAll = $__1.loadAll;
  var $__default = {
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
    query: (function(array, $__2) {
      var term,
          $__4,
          $__5,
          $__6,
          $__7;
      return $traceurRuntime.asyncWrap(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              term = $__2.term;
              $ctx.state = 12;
              break;
            case 12:
              $__4 = loadJSON(("https://api.github.com/search/users?q=" + term));
              $ctx.state = 5;
              break;
            case 5:
              Promise.resolve($__4).then($ctx.createCallback(3), $ctx.errback);
              return;
            case 3:
              $__5 = $ctx.value;
              $ctx.state = 2;
              break;
            case 2:
              $__6 = $__5.items;
              $__7 = loadAll(array, $__6);
              $ctx.state = 7;
              break;
            case 7:
              $ctx.returnValue = $__7;
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
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/github/GithubUserMapper.js
System.registerModule("models/sources/GithubRepoSource.js", [], function() {
  "use strict";
  var __moduleName = "models/sources/GithubRepoSource.js";
  var GithubRepo = System.get("models/github/GithubRepo.js").default;
  var GithubIssue = System.get("models/github/GithubIssue.js").default;
  var GithubEvent = System.get("models/github/GithubEvent.js").default;
  var GithubPullRequest = System.get("models/github/GithubPullRequest.js").default;
  var Source = System.get("models/sources/Source.js").default;
  var GithubRepoSource = function GithubRepoSource($__7) {
    var $__8 = $__7,
        full_name = $__8.full_name,
        details = $__8.details;
    this.full_name = full_name;
    this._details = details;
  };
  ($traceurRuntime.createClass)(GithubRepoSource, {
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
    get issues() {
      return this._issues || (this._issues = GithubIssue.query({repo: this.full_name}));
    },
    get pullRequests() {
      return this._pullRequests || (this._pullRequests = GithubPullRequest.query({repo: this.full_name}));
    },
    toJSON: function() {
      return {full_name: this.full_name};
    }
  }, {query: function($__7) {
      var term = $__7.term;
      var $__5 = this;
      return GithubRepo.query({term: term}).$promise.then((function(repos) {
        return repos.map((function(repo) {
          return new $__5({
            full_name: repo.full_name,
            details: repo
          });
        }));
      }));
    }}, Source);
  Source.registerSource(GithubRepoSource);
  var $__default = GithubRepoSource;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/sources/GithubRepoSource.js
System.registerModule("models/sources/GithubUserSource.js", [], function() {
  "use strict";
  var __moduleName = "models/sources/GithubUserSource.js";
  var GithubUser = System.get("models/github/GithubUser.js").default;
  var GithubEvent = System.get("models/github/GithubEvent.js").default;
  var Source = System.get("models/sources/Source.js").default;
  var GithubUserSource = function GithubUserSource($__5) {
    var $__6 = $__5,
        login = $__6.login,
        details = $__6.details;
    this.login = login;
    this._details = details;
  };
  ($traceurRuntime.createClass)(GithubUserSource, {
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
  }, {query: function($__5) {
      var term = $__5.term;
      var $__3 = this;
      return GithubUser.query({term: term}).$promise.then((function(users) {
        return users.map((function(user) {
          return new $__3({
            login: user.login,
            details: user
          });
        }));
      }));
    }}, Source);
  Source.registerSource(GithubUserSource);
  var $__default = GithubUserSource;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/sources/GithubUserSource.js
System.registerModule("models/sources/Source.js", [], function() {
  "use strict";
  var __moduleName = "models/sources/Source.js";
  var SOURCE_CLASSES = {};
  var $__default = (($traceurRuntime.createClass)(function() {}, {
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
  }));
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=models/sources/Source.js