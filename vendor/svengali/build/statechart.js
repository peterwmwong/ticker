System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      (function(exports) {
        "use strict";
        var slice = Array.prototype.slice;
        function isArray(o) {
          return Object.prototype.toString.call(o) === '[object Array]';
        }
        function flatten(array) {
          var result = [],
              i,
              n;
          for (i = 0, n = array.length; i < n; i++) {
            if (isArray(array[i])) {
              result = result.concat(flatten(array[i]));
            } else {
              result.push(array[i]);
            }
          }
          return result;
        }
        function multipleUniqs(array) {
          var x,
              i,
              n;
          if (!array || array.length === 0) {
            return false;
          }
          x = array[0];
          for (i = 1, n = array.length; i < n; i++) {
            if (array[i] !== x) {
              return true;
            }
          }
          return false;
        }
        function _path() {
          return this.__cache__._path = this.__cache__._path || (this.superstate ? _path.call(this.superstate).concat(this) : [this]);
        }
        function _current() {
          var a = [],
              i,
              n;
          if (!this.__isCurrent__) {
            return [];
          }
          if (this.substates.length === 0) {
            return [this];
          }
          for (i = 0, n = this.substates.length; i < n; i++) {
            if (this.substates[i].__isCurrent__) {
              a = a.concat(_current.call(this.substates[i]));
            }
          }
          return a;
        }
        function findPivot(other) {
          var p1 = _path.call(this),
              p2 = _path.call(other),
              i,
              len,
              p;
          for (i = 0, len = p1.length < p2.length ? p1.length : p2.length; i < len; i++) {
            if (p1[i] === p2[i]) {
              p = p1[i];
            } else {
              break;
            }
          }
          if (!p) {
            throw new Error('State#findPivot: states ' + this + ' and ' + other + ' do not belong to the same statechart');
          }
          return p;
        }
        function queueTransition(pivot, states, opts) {
          (this.__transitions__ = this.__transitions__ || []).push({
            pivot: pivot,
            states: states,
            opts: opts
          });
        }
        function transition() {
          var ts = this.__transitions__,
              i,
              len;
          if (!ts || ts.length === 0) {
            return;
          }
          for (i = 0, len = ts.length; i < len; i++) {
            enter.call(ts[i].pivot, ts[i].states, ts[i].opts);
          }
          this.__transitions__ = [];
        }
        function callEnterHandlers(context) {
          var i,
              n;
          for (i = 0, n = this.enters.length; i < n; i++) {
            this.enters[i].call(this, context);
          }
        }
        function callExitHandlers(context) {
          var i,
              n;
          for (i = 0, n = this.exits.length; i < n; i++) {
            this.exits[i].call(this, context);
          }
        }
        function enterClustered(states, opts) {
          var selflen = _path.call(this).length,
              nexts = [],
              state,
              paths,
              cur,
              next,
              i,
              n;
          for (i = 0, n = this.substates.length; i < n; i++) {
            if (this.substates[i].__isCurrent__) {
              cur = this.substates[i];
              break;
            }
          }
          for (i = 0, n = states.length; i < n; i++) {
            nexts.push(_path.call(states[i])[selflen]);
          }
          if (multipleUniqs(nexts)) {
            throw new Error("State#enterClustered: attempted to enter multiple substates of " + this + ": " + nexts.join(', '));
          }
          if (!(next = nexts[0]) && this.substates.length > 0) {
            if (this.__condition__ && (paths = this.__condition__.call(this, opts.context))) {
              paths = flatten([paths]);
              states = [];
              for (i = 0, n = paths.length; i < n; i++) {
                if (!(state = this.resolve(paths[i]))) {
                  throw new Error("State#enterClustered: could not resolve path '" + paths[i] + "' returned by condition function from " + this);
                }
                states.push(state);
              }
              return enterClustered.call(this, states, opts);
            } else if (this.history) {
              next = this.__previous__ || this.substates[0];
            } else {
              next = this.substates[0];
            }
          }
          if (cur && cur !== next) {
            exit.call(cur, opts);
          }
          if (!this.__isCurrent__ || opts.force) {
            trace.call(this, "State: [ENTER]  : " + this.path() + (this.__isCurrent__ ? ' (forced)' : ''));
            this.__isCurrent__ = true;
            callEnterHandlers.call(this, opts.context);
          }
          if (next) {
            enter.call(next, states, opts);
          }
          return this;
        }
        function enterConcurrent(states, opts) {
          var sstate,
              dstates,
              i,
              j,
              ni,
              nj;
          if (!this.__isCurrent__ || opts.force) {
            trace.call(this, "State: [ENTER]  : " + this.path() + (this.__isCurrent__ ? ' (forced)' : ''));
            this.__isCurrent__ = true;
            callEnterHandlers.call(this, opts.context);
          }
          for (i = 0, ni = this.substates.length; i < ni; i++) {
            sstate = this.substates[i];
            dstates = [];
            for (j = 0, nj = states.length; j < nj; j++) {
              if (findPivot.call(sstate, states[j]) === sstate) {
                dstates.push(states[j]);
              }
            }
            enter.call(sstate, dstates, opts);
          }
          return this;
        }
        function enter(states, opts) {
          return this.concurrent ? enterConcurrent.call(this, states, opts) : enterClustered.call(this, states, opts);
        }
        function exitClustered(opts) {
          var cur,
              i,
              n;
          for (i = 0, n = this.substates.length; i < n; i++) {
            if (this.substates[i].__isCurrent__) {
              cur = this.substates[i];
              break;
            }
          }
          if (this.history) {
            this.__previous__ = cur;
          }
          if (cur) {
            exit.call(cur, opts);
          }
          callExitHandlers.call(this, opts.context);
          this.__isCurrent__ = false;
          trace.call(this, "State: [EXIT]   : " + this.path());
          return this;
        }
        function exitConcurrent(opts) {
          var root = this.root(),
              i,
              n;
          for (i = 0, n = this.substates.length; i < n; i++) {
            exit.call(this.substates[i], opts);
          }
          callExitHandlers.call(this, opts.context);
          this.__isCurrent__ = false;
          if (this !== root) {
            trace.call(this, "State: [EXIT]   : " + this.path());
          }
          return this;
        }
        function exit(opts) {
          return this.concurrent ? exitConcurrent.call(this, opts) : exitClustered.call(this, opts);
        }
        function canExit(destStates, opts) {
          var i,
              n;
          for (i = 0, n = this.substates.length; i < n; i++) {
            if (this.substates[i].__isCurrent__) {
              if (canExit.call(this.substates[i], destStates, opts) === false) {
                return false;
              }
            }
          }
          return this.canExit(destStates, opts.context);
        }
        function canEnter(destStates, opts) {
          var i,
              n;
          for (i = 0, n = destStates.length; i < n; i++) {
            if (destStates[i].canEnter(destStates, opts.context) === false) {
              return false;
            }
          }
        }
        function sendClustered() {
          var handled = false,
              i,
              n,
              cur;
          for (i = 0, n = this.substates.length; i < n; i++) {
            if (this.substates[i].__isCurrent__) {
              cur = this.substates[i];
              break;
            }
          }
          if (cur) {
            handled = !!cur.send.apply(cur, slice.call(arguments));
          }
          return handled;
        }
        function sendConcurrent() {
          var args = slice.call(arguments),
              handled = true,
              state,
              i,
              n;
          for (i = 0, n = this.substates.length; i < n; i++) {
            state = this.substates[i];
            handled = state.send.apply(state, args) && handled;
          }
          return handled;
        }
        function trace(message) {
          var logger = State.logger || console;
          if (!this.root().trace || !logger) {
            return;
          }
          logger.info(message);
        }
        function State(name, opts, f) {
          if (arguments.length === 2) {
            if (typeof opts === 'function') {
              f = opts;
              opts = {};
            }
          }
          if (!(this instanceof State)) {
            return new State(name, opts, f);
          }
          opts = opts || {};
          if (opts.concurrent && opts.H) {
            throw new Error('State: history states are not allowed on concurrent states');
          }
          this.name = name;
          this.substateMap = {};
          this.substates = [];
          this.superstate = null;
          this.enters = [];
          this.exits = [];
          this.events = {};
          this.concurrent = !!opts.concurrent;
          this.history = !!(opts.H);
          this.deep = opts.H === '*';
          this.__isCurrent__ = false;
          this.__cache__ = {};
          this.trace = false;
          if (f) {
            f.call(this);
          }
        }
        State.define = function() {
          var opts = {},
              f = null,
              s;
          if (arguments.length === 2) {
            opts = arguments[0];
            f = arguments[1];
          } else if (arguments.length === 1) {
            if (typeof arguments[0] === 'function') {
              f = arguments[0];
            } else {
              opts = arguments[0];
            }
          }
          s = new State('__root__', opts);
          if (f) {
            f.call(s);
          }
          return s;
        };
        State.prototype = {
          state: function(name) {
            var s = name instanceof State ? name : State.apply(null, slice.call(arguments));
            this.addSubstate(s);
            return s;
          },
          enter: function(f) {
            this.enters.push(f);
            return this;
          },
          exit: function(f) {
            this.exits.push(f);
            return this;
          },
          canExit: function() {
            return true;
          },
          canEnter: function() {
            return true;
          },
          event: function(name, f) {
            this.events[name] = f;
            return this;
          },
          C: function(f) {
            if (this.concurrent) {
              throw new Error('State#C: a concurrent state may not have a condition state: ' + this);
            }
            this.__condition__ = f;
          },
          current: function() {
            var states = _current.call(this),
                paths = [],
                i,
                n;
            for (i = 0, n = states.length; i < n; i++) {
              paths.push(states[i].path());
            }
            return paths;
          },
          each: function(f) {
            var i,
                n;
            f(this);
            for (i = 0, n = this.substates.length; i < n; i++) {
              this.substates[i].each(f);
            }
            return this;
          },
          addSubstate: function(state) {
            var deep = this.history && this.deep;
            this.substateMap[state.name] = state;
            this.substates.push(state);
            state.each(function(s) {
              s.__cache__ = {};
              if (deep) {
                s.history = s.deep = true;
              }
            });
            state.superstate = this;
            return this;
          },
          root: function() {
            return this.__cache__.root = this.__cache__.root || (this.superstate ? this.superstate.root() : this);
          },
          path: function() {
            var states = _path.call(this),
                names = [],
                i,
                len;
            for (i = 1, len = states.length; i < len; i++) {
              names.push(states[i].name);
            }
            return '/' + names.join('/');
          },
          goto: function() {
            var root = this.root(),
                paths = flatten(slice.call(arguments)),
                opts = typeof paths[paths.length - 1] === 'object' ? paths.pop() : {},
                states = [],
                pivots = [],
                state,
                pivot,
                i,
                n;
            for (i = 0, n = paths.length; i < n; i++) {
              if (!(state = this.resolve(paths[i]))) {
                throw new Error('State#goto: could not resolve path ' + paths[i] + ' from ' + this);
              }
              states.push(state);
            }
            for (i = 0, n = states.length; i < n; i++) {
              pivots.push(findPivot.call(this, states[i]));
            }
            if (multipleUniqs(pivots)) {
              throw new Error("State#goto: multiple pivot states found between state " + this + " and paths " + paths.join(', '));
            }
            pivot = pivots[0] || this;
            if (canExit.call(pivot, states, opts) === false) {
              trace.call(this, 'State: [GOTO]   : ' + this + ' can not exit]');
              return false;
            }
            if (canEnter.call(pivot, states, opts) === false) {
              trace.call(this, 'State: [GOTO]   : ' + this + ' can not exit]');
              return false;
            }
            trace.call(this, 'State: [GOTO]   : ' + this + ' -> [' + states.join(', ') + ']');
            if (!this.__isCurrent__ && this.superstate) {
              throw new Error('State#goto: state ' + this + ' is not current');
            }
            if (pivot.concurrent && pivot !== this) {
              throw new Error('State#goto: one or more of the given paths are not reachable from state ' + this + ': ' + paths.join(', '));
            }
            queueTransition.call(root, pivot, states, opts);
            if (!this.__isSending__) {
              transition.call(root);
            }
            return true;
          },
          send: function() {
            var args = slice.call(arguments),
                events = this.events,
                handled;
            if (!this.__isCurrent__) {
              throw new Error('State#send: attempted to send an event to a state that is not current: ' + this);
            }
            if (this === this.root()) {
              trace.call(this, 'State: [EVENT]  : ' + args[0]);
            }
            handled = this.concurrent ? sendConcurrent.apply(this, arguments) : sendClustered.apply(this, arguments);
            if (!handled && typeof events[args[0]] === 'function') {
              this.__isSending__ = true;
              handled = !!events[args[0]].apply(this, args.slice(1));
              this.__isSending__ = false;
            }
            if (!this.superstate) {
              transition.call(this);
            }
            return handled;
          },
          reset: function() {
            exit.call(this, {});
          },
          isCurrent: function(path) {
            var state = this.resolve(path);
            return !!(state && state.__isCurrent__);
          },
          resolve: function(path, origPath, origState) {
            var head,
                next;
            if (!path) {
              return null;
            }
            origPath = origPath || path;
            origState = origState || this;
            path = typeof path === 'string' ? path.split('/') : path;
            head = path.shift();
            switch (head) {
              case '':
                next = this.root();
                break;
              case '.':
                next = this;
                break;
              case '..':
                next = this.superstate;
                break;
              default:
                next = this.substateMap[head];
            }
            if (!next) {
              return null;
            }
            return path.length === 0 ? next : next.resolve(path, origPath, origState);
          },
          toString: function() {
            return 'State(' + this.path() + ')';
          }
        };
        exports.State = State;
      }(typeof exports === 'undefined' ? this.statechart = {} : exports));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzAiLCJzdGF0ZWNoYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEtBQUssU0FBUyxBQUFDLElBQW9CLFVBQVMsU0FBUTs7QUNBcEQsT0FBTztBQUNELFVBQU0sSUFBbUI7QUFDekIsVUFBTTtBQ0ZaLE1BQUMsU0FBUyxPQUFNLENBQUc7QUFDakIsbUJBQVcsQ0FBQztBQUVaLEFBQUksVUFBQSxDQUFBLEtBQUksRUFBSSxDQUFBLEtBQUksVUFBVSxNQUFNLENBQUM7QUFJakMsZUFBUyxRQUFNLENBQUUsQ0FBQSxDQUFHO0FBQ2xCLGVBQU8sQ0FBQSxNQUFLLFVBQVUsU0FBUyxLQUFLLEFBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQSxHQUFNLGlCQUFlLENBQUM7UUFDL0Q7QUFBQSxBQUdBLGVBQVMsUUFBTSxDQUFFLEtBQUksQ0FBRztBQUN0QixBQUFJLFlBQUEsQ0FBQSxNQUFLLEVBQUksR0FBQztBQUFHLGNBQUE7QUFBRyxjQUFBLENBQUM7QUFFckIsY0FBSyxDQUFBLEVBQUksRUFBQSxDQUFHLENBQUEsQ0FBQSxFQUFJLENBQUEsS0FBSSxPQUFPLENBQUcsQ0FBQSxDQUFBLEVBQUksRUFBQSxDQUFHLENBQUEsQ0FBQSxFQUFFLENBQUc7QUFDeEMsZUFBSSxPQUFNLEFBQUMsQ0FBQyxLQUFJLENBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBRztBQUNyQixtQkFBSyxFQUFJLENBQUEsTUFBSyxPQUFPLEFBQUMsQ0FBQyxPQUFNLEFBQUMsQ0FBQyxLQUFJLENBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLEtBQ0s7QUFDSCxtQkFBSyxLQUFLLEFBQUMsQ0FBQyxLQUFJLENBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUN2QjtBQUFBLFVBQ0Y7QUFBQSxBQUVBLGVBQU8sT0FBSyxDQUFDO1FBQ2Y7QUFBQSxB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Q0FBQyxDQUFDLENBQUM7SUR4MUJwQztFQUMzQixDQUFBO0FEREksQ0FBQyxDQUFDO0FFeTFCViIsImZpbGUiOiJzdGF0ZWNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiU3lzdGVtLnJlZ2lzdGVyKCRfX3BsYWNlaG9sZGVyX18wLCBmdW5jdGlvbigkX19leHBvcnQpIHtcbiAgICAgICAgICAkX19wbGFjZWhvbGRlcl9fMVxuICAgICAgICB9KTsiLCJyZXR1cm4ge1xuICAgICAgc2V0dGVyczogJF9fcGxhY2Vob2xkZXJfXzAsXG4gICAgICBleGVjdXRlOiAkX19wbGFjZWhvbGRlcl9fMVxuICAgIH0iLCIoZnVuY3Rpb24oZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLy8gSW50ZXJuYWw6IFJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuXG4gIC8vIEFycmF5LlxuICBmdW5jdGlvbiBpc0FycmF5KG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEZsYXR0ZW5zIHRoZSBnaXZlbiBhcnJheSBieSByZW1vdmluZyBhbGwgbmVzdGluZy5cbiAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXSwgaSwgbjtcblxuICAgIGZvciAoaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChpc0FycmF5KGFycmF5W2ldKSkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KGZsYXR0ZW4oYXJyYXlbaV0pKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlcmUgYXJlIG11bHRpcGxlIHVuaXF1ZVxuICAvLyB2YWx1ZXMgaW4gdGhlIGdpdmVuIGFycmF5LlxuICBmdW5jdGlvbiBtdWx0aXBsZVVuaXFzKGFycmF5KSB7XG4gICAgdmFyIHgsIGksIG47XG5cbiAgICBpZiAoIWFycmF5IHx8IGFycmF5Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHggPSBhcnJheVswXTtcblxuICAgIGZvciAoaSA9IDEsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChhcnJheVtpXSAhPT0geCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBDYWxjdWxhdGVzIGFuZCBjYWNoZXMgdGhlIHBhdGggZnJvbSB0aGUgcm9vdCBzdGF0ZSB0byB0aGVcbiAgLy8gcmVjZWl2ZXIgc3RhdGUuIFN1YnNlcXVlbnQgY2FsbHMgd2lsbCByZXR1cm4gdGhlIGNhY2hlZCBwYXRoIGFycmF5LlxuICAvL1xuICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIGBTdGF0ZWAgb2JqZWN0cy5cbiAgZnVuY3Rpb24gX3BhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19jYWNoZV9fLl9wYXRoID0gdGhpcy5fX2NhY2hlX18uX3BhdGggfHxcbiAgICAgICh0aGlzLnN1cGVyc3RhdGUgPyBfcGF0aC5jYWxsKHRoaXMuc3VwZXJzdGF0ZSkuY29uY2F0KHRoaXMpIDogW3RoaXNdKTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBjdXJyZW50IGxlYWYgc3RhdGVzLlxuICBmdW5jdGlvbiBfY3VycmVudCgpIHtcbiAgICB2YXIgYSA9IFtdLCBpLCBuO1xuXG4gICAgaWYgKCF0aGlzLl9faXNDdXJyZW50X18pIHsgcmV0dXJuIFtdOyB9XG4gICAgaWYgKHRoaXMuc3Vic3RhdGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gW3RoaXNdOyB9XG5cbiAgICBmb3IgKGkgPSAwLCBuID0gdGhpcy5zdWJzdGF0ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5zdWJzdGF0ZXNbaV0uX19pc0N1cnJlbnRfXykge1xuICAgICAgICBhID0gYS5jb25jYXQoX2N1cnJlbnQuY2FsbCh0aGlzLnN1YnN0YXRlc1tpXSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEZpbmRzIHRoZSBwaXZvdCBzdGF0ZSBiZXR3ZWVuIHRoZSByZWNlaXZlciBhbmQgdGhlIGdpdmVuIHN0YXRlLlxuICAvLyBUaGUgcGl2b3Qgc3RhdGUgaXMgdGhlIGZpcnN0IGNvbW1vbiBhbmNlc3RvciBiZXR3ZWVuIHRoZSB0d28gc3RhdGVzLlxuICAvL1xuICAvLyBSZXR1cm5zIGEgYFN0YXRlYCBvYmplY3QuXG4gIC8vIFRocm93cyBgRXJyb3JgIGlmIHRoZSB0d28gc3RhdGVzIGRvIG5vdCBiZWxvbmcgdG8gdGhlIHNhbWUgc3RhdGVjaGFydC5cbiAgZnVuY3Rpb24gZmluZFBpdm90KG90aGVyKSB7XG4gICAgdmFyIHAxID0gX3BhdGguY2FsbCh0aGlzKSwgcDIgPSBfcGF0aC5jYWxsKG90aGVyKSwgaSwgbGVuLCBwO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcDEubGVuZ3RoIDwgcDIubGVuZ3RoID8gcDEubGVuZ3RoIDogcDIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChwMVtpXSA9PT0gcDJbaV0pIHsgcCA9IHAxW2ldOyB9IGVsc2UgeyBicmVhazsgfVxuICAgIH1cblxuICAgIGlmICghcCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0ZSNmaW5kUGl2b3Q6IHN0YXRlcyAnICsgdGhpcyArICcgYW5kICcgKyBvdGhlciArICcgZG8gbm90IGJlbG9uZyB0byB0aGUgc2FtZSBzdGF0ZWNoYXJ0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICAvLyBJbnRlcm5hbDogUXVldWVzIHVwIGEgdHJhbnNpdGlvbiBmb3IgbGF0ZXIgcHJvY2Vzc2luZy4gVHJhbnNpdGlvbnMgYXJlXG4gIC8vIHF1ZXVlZCBpbnN0ZWFkIG9mIGhhcHBlbmluZyBpbW1lZGlhdGVseSBiZWNhdXNlIHdlIG5lZWQgdG8gYWxsb3cgYWxsXG4gIC8vIGN1cnJlbnQgc3RhdGVzIHRvIHJlY2VpdmUgYW4gZXZlbnQgYmVmb3JlIGFueSB0cmFuc2l0aW9ucyBhY3R1YWxseSBvY2N1ci5cbiAgLy9cbiAgLy8gcGl2b3QgIC0gVGhlIHBpdm90IHN0YXRlIGJldHdlZW4gdGhlIHN0YXJ0IHN0YXRlIGFuZCBkZXN0aW5hdGlvbiBzdGF0ZXMuXG4gIC8vIHN0YXRlcyAtIEFuIGFycmF5IG9mIGRlc3RpbmF0aW9uIHN0YXRlcy5cbiAgLy8gb3B0cyAgIC0gVGhlIG9wdGlvbnMgb2JqZWN0IHBhc3NlZCB0byB0aGUgYGdvdG9gIG1ldGhvZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBub3RoaW5nLlxuICBmdW5jdGlvbiBxdWV1ZVRyYW5zaXRpb24ocGl2b3QsIHN0YXRlcywgb3B0cykge1xuICAgICh0aGlzLl9fdHJhbnNpdGlvbnNfXyA9IHRoaXMuX190cmFuc2l0aW9uc19fIHx8IFtdKS5wdXNoKFxuICAgICAge3Bpdm90OiBwaXZvdCwgc3RhdGVzOiBzdGF0ZXMsIG9wdHM6IG9wdHN9KTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBQZXJmb3JtcyBhbGwgcXVldWVkIHRyYW5zaXRpb25zLiBUaGlzIGlzIHRoZSBtZXRob2QgdGhhdCBhY3R1YWxseVxuICAvLyB0YWtlcyB0aGUgc3RhdGVjaGFydCBmcm9tIG9uZSBzZXQgb2YgY3VycmVudCBzdGF0ZXMgdG8gYW5vdGhlci5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbigpIHtcbiAgICB2YXIgdHMgPSB0aGlzLl9fdHJhbnNpdGlvbnNfXywgaSwgbGVuO1xuXG4gICAgaWYgKCF0cyB8fCB0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZW50ZXIuY2FsbCh0c1tpXS5waXZvdCwgdHNbaV0uc3RhdGVzLCB0c1tpXS5vcHRzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fdHJhbnNpdGlvbnNfXyA9IFtdO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEludm9rZXMgYWxsIHJlZ2lzdGVyZWQgZW50ZXIgaGFuZGxlcnMuXG4gIGZ1bmN0aW9uIGNhbGxFbnRlckhhbmRsZXJzKGNvbnRleHQpIHtcbiAgICB2YXIgaSwgbjtcbiAgICBmb3IgKGkgPSAwLCBuID0gdGhpcy5lbnRlcnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB0aGlzLmVudGVyc1tpXS5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEludGVybmFsOiBJbnZva2VzIGFsbCByZWdpc3RlcmVkIGV4aXQgaGFuZGxlcnMuXG4gIGZ1bmN0aW9uIGNhbGxFeGl0SGFuZGxlcnMoY29udGV4dCkge1xuICAgIHZhciBpLCBuO1xuICAgIGZvciAoaSA9IDAsIG4gPSB0aGlzLmV4aXRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgdGhpcy5leGl0c1tpXS5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEludGVybmFsOiBFbnRlcnMgYSBjbHVzdGVyZWQgc3RhdGUuIEVudGVyaW5nIGEgY2x1c3RlcmVkIHN0YXRlIGludm9sdmVzXG4gIC8vIGV4aXRpbmcgdGhlIGN1cnJlbnQgc3Vic3RhdGUgKGlmIG9uZSBleGlzdHMgYW5kIGlzIG5vdCBhIGRlc3RpbmF0aW9uXG4gIC8vIHN0YXRlKSwgaW52b2tpbmcgdGhlIGBlbnRlcmAgY2FsbGJhY2tzIG9uIHRoZSByZWNlaXZlciBzdGF0ZSwgYW5kXG4gIC8vIHJlY3Vyc2l2ZWx5IGVudGVyaW5nIHRoZSBuZXcgZGVzdGluYXRpb24gc3Vic3RhdGUuIFRoZSBuZXcgZGVzdGluYXRpb25cbiAgLy8gc3Vic3RhdGUgaXMgZGV0ZXJtaW5lZCBhcyBmb2xsb3dzOlxuICAvL1xuICAvLyAxLiB0aGUgc3Vic3RhdGUgaW5kaWNhdGVkIGluIHRoZSBgc3RhdGVzYCBhcmd1bWVudCBpZiBpdHMgbm90IGVtcHR5XG4gIC8vIDIuIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIGNvbmRpdGlvbiBmdW5jdGlvbiBkZWZpbmVkIHdpdGggdGhlIGBDYFxuICAvLyAgICBtZXRob2QgaWYgaXQgZXhpc3RzIGFuZCByZXR1cm5zIGEgc3Vic3RhdGUgcGF0aFxuICAvLyAzLiB0aGUgbW9zdCByZWNlbnRseSBleGl0ZWQgc3Vic3RhdGUgaWYgdGhlIHN0YXRlIHdhcyBkZWZpbmVkIHdpdGggdGhlXG4gIC8vICAgIGBIYCBvcHRpb24gYW5kIGhhcyBiZWVuIHByZXZpb3VzbHkgZW50ZXJlZFxuICAvLyA0LiB0aGUgZmlyc3Qgc3Vic3RhdGVcbiAgLy9cbiAgLy8gc3RhdGVzIC0gQW4gYXJyYXkgb2YgZGVzdGluYXRpb24gc3RhdGVzIChtYXkgYmUgZW1wdHkgdG8gaW5kaWNhdGUgdGhhdFxuICAvLyAgICAgICAgICBhIGNvbmRpdGlvbiwgaGlzdG9yeSwgb3IgZGVmYXVsdCBzdWJzdGF0ZSBzaG91bGQgYmUgZW50ZXJlZCkuXG4gIC8vIG9wdHMgICAtIFRoZSBvcHRpb25zIHBhc3NlZCB0byBgZ290b2AuXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIHJlY2VpdmVyLlxuICAvLyBUaHJvd3MgYW4gYEVycm9yYCBpZiB0aGUgZ2l2ZW4gZGVzdGluYXRpb24gc3RhdGVzIGluY2x1ZGUgbXVsdGlwbGVcbiAgLy8gICBzdWJzdGF0ZXMuXG4gIGZ1bmN0aW9uIGVudGVyQ2x1c3RlcmVkKHN0YXRlcywgb3B0cykge1xuICAgIHZhciBzZWxmbGVuID0gX3BhdGguY2FsbCh0aGlzKS5sZW5ndGgsXG4gICAgICAgIG5leHRzICAgPSBbXSxcbiAgICAgICAgc3RhdGUsIHBhdGhzLCBjdXIsIG5leHQsIGksIG47XG5cbiAgICBmb3IgKGkgPSAwLCBuID0gdGhpcy5zdWJzdGF0ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5zdWJzdGF0ZXNbaV0uX19pc0N1cnJlbnRfXykgeyBjdXIgPSB0aGlzLnN1YnN0YXRlc1tpXTsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBuID0gc3RhdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgbmV4dHMucHVzaChfcGF0aC5jYWxsKHN0YXRlc1tpXSlbc2VsZmxlbl0pO1xuICAgIH1cblxuICAgIGlmIChtdWx0aXBsZVVuaXFzKG5leHRzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGUjZW50ZXJDbHVzdGVyZWQ6IGF0dGVtcHRlZCB0byBlbnRlciBtdWx0aXBsZSBzdWJzdGF0ZXMgb2YgXCIgKyB0aGlzICsgXCI6IFwiICsgbmV4dHMuam9pbignLCAnKSk7XG4gICAgfVxuXG4gICAgaWYgKCEobmV4dCA9IG5leHRzWzBdKSAmJiB0aGlzLnN1YnN0YXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5fX2NvbmRpdGlvbl9fICYmIChwYXRocyA9IHRoaXMuX19jb25kaXRpb25fXy5jYWxsKHRoaXMsIG9wdHMuY29udGV4dCkpKSB7XG4gICAgICAgIHBhdGhzICA9IGZsYXR0ZW4oW3BhdGhzXSk7XG4gICAgICAgIHN0YXRlcyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBuID0gcGF0aHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKCEoc3RhdGUgPSB0aGlzLnJlc29sdmUocGF0aHNbaV0pKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGUjZW50ZXJDbHVzdGVyZWQ6IGNvdWxkIG5vdCByZXNvbHZlIHBhdGggJ1wiICsgcGF0aHNbaV0gKyBcIicgcmV0dXJuZWQgYnkgY29uZGl0aW9uIGZ1bmN0aW9uIGZyb20gXCIgKyB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRlckNsdXN0ZXJlZC5jYWxsKHRoaXMsIHN0YXRlcywgb3B0cyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0aGlzLmhpc3RvcnkpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuX19wcmV2aW91c19fIHx8IHRoaXMuc3Vic3RhdGVzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5leHQgPSB0aGlzLnN1YnN0YXRlc1swXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VyICYmIGN1ciAhPT0gbmV4dCkgeyBleGl0LmNhbGwoY3VyLCBvcHRzKTsgfVxuXG4gICAgaWYgKCF0aGlzLl9faXNDdXJyZW50X18gfHwgb3B0cy5mb3JjZSkge1xuICAgICAgdHJhY2UuY2FsbCh0aGlzLCBcIlN0YXRlOiBbRU5URVJdICA6IFwiICsgdGhpcy5wYXRoKCkgKyAodGhpcy5fX2lzQ3VycmVudF9fID8gJyAoZm9yY2VkKScgOiAnJykpO1xuICAgICAgdGhpcy5fX2lzQ3VycmVudF9fID0gdHJ1ZTtcbiAgICAgIGNhbGxFbnRlckhhbmRsZXJzLmNhbGwodGhpcywgb3B0cy5jb250ZXh0KTtcbiAgICB9XG5cbiAgICBpZiAobmV4dCkgeyBlbnRlci5jYWxsKG5leHQsIHN0YXRlcywgb3B0cyk7IH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEVudGVycyBhIGNvbmN1cnJlbnQgc3RhdGUuIEVudGVyaW5nIGEgY29uY3VycmVudCBzdGF0ZSBzaW1wbHlcbiAgLy8gaW52b2x2ZXMgY2FsbGluZyB0aGUgYGVudGVyYCBtZXRob2Qgb24gdGhlIHJlY2VpdmVyIGFuZCByZWN1cnNpdmVseVxuICAvLyBlbnRlcmluZyBlYWNoIHN1YnN0YXRlLlxuICAvL1xuICAvLyBzdGF0ZXMgLSBBbiBhcnJheSBvZiBkZXN0aW5hdGlvbiBzdGF0ZXMuXG4gIC8vIG9wdHMgICAtIFRoZSBvcHRpb25zIHBhc3NlZCB0byBgZ290b2AuXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIHJlY2VpdmVyLlxuICBmdW5jdGlvbiBlbnRlckNvbmN1cnJlbnQoc3RhdGVzLCBvcHRzKSB7XG4gICAgdmFyIHNzdGF0ZSwgZHN0YXRlcywgaSwgaiwgbmksIG5qO1xuXG4gICAgaWYgKCF0aGlzLl9faXNDdXJyZW50X18gfHwgb3B0cy5mb3JjZSkge1xuICAgICAgdHJhY2UuY2FsbCh0aGlzLCBcIlN0YXRlOiBbRU5URVJdICA6IFwiICsgdGhpcy5wYXRoKCkgKyAodGhpcy5fX2lzQ3VycmVudF9fID8gJyAoZm9yY2VkKScgOiAnJykpO1xuICAgICAgdGhpcy5fX2lzQ3VycmVudF9fID0gdHJ1ZTtcbiAgICAgIGNhbGxFbnRlckhhbmRsZXJzLmNhbGwodGhpcywgb3B0cy5jb250ZXh0KTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBuaSA9IHRoaXMuc3Vic3RhdGVzLmxlbmd0aDsgaSA8IG5pOyBpKyspIHtcbiAgICAgIHNzdGF0ZSAgPSB0aGlzLnN1YnN0YXRlc1tpXTtcbiAgICAgIGRzdGF0ZXMgPSBbXTtcblxuICAgICAgZm9yIChqID0gMCwgbmogPSBzdGF0ZXMubGVuZ3RoOyBqIDwgbmo7IGorKykge1xuICAgICAgICBpZiAoZmluZFBpdm90LmNhbGwoc3N0YXRlLCBzdGF0ZXNbal0pID09PSBzc3RhdGUpIHtcbiAgICAgICAgICBkc3RhdGVzLnB1c2goc3RhdGVzW2pdKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICBlbnRlci5jYWxsKHNzdGF0ZSwgZHN0YXRlcywgb3B0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBJbnRlcm5hbDogRW50ZXJzIHRoZSByZWNlaXZlciBzdGF0ZS4gVGhlIGFjdHVhbCBlbnRlcmluZyBsb2dpYyBpcyBpbiB0aGVcbiAgLy8gYGVudGVyQ2x1c3RlcmVkYCBhbmQgYGVudGVyQ29uY3VycmVudGAgbWV0aG9kcy5cbiAgLy9cbiAgLy8gc3RhdGVzIC0gQW4gYXJyYXkgb2YgZGVzdGluYXRpb24gc3RhdGVzLlxuICAvLyBvcHRzICAgLSBUaGUgb3B0aW9ucyBwYXNzZWQgdG8gYGdvdG9gLlxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSByZWNlaXZlci5cbiAgZnVuY3Rpb24gZW50ZXIoc3RhdGVzLCBvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uY3VycmVudCA/XG4gICAgICBlbnRlckNvbmN1cnJlbnQuY2FsbCh0aGlzLCBzdGF0ZXMsIG9wdHMpIDpcbiAgICAgIGVudGVyQ2x1c3RlcmVkLmNhbGwodGhpcywgc3RhdGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBFeGl0cyBhIGNsdXN0ZXJlZCBzdGF0ZS4gRXhpdGluZyBoYXBwZW5zIGJvdHRvbSB0byB0b3AsIHNvIHdlXG4gIC8vIHJlY3Vyc2l2ZWx5IGV4aXQgdGhlIGN1cnJlbnQgc3Vic3RhdGUgYW5kIHRoZW4gaW52b2tlIHRoZSBgZXhpdGAgbWV0aG9kIG9uXG4gIC8vIGVhY2ggc3RhdGUgYXMgdGhlIHN0YWNrIHVud2luZHMuXG4gIC8vXG4gIC8vIG9wdHMgLSBUaGUgb3B0aW9ucyBwYXNzZWQgdG8gYGdvdG9gLlxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSByZWNlaXZlci5cbiAgZnVuY3Rpb24gZXhpdENsdXN0ZXJlZChvcHRzKSB7XG4gICAgdmFyIGN1ciwgaSwgbjtcblxuICAgIGZvciAoaSA9IDAsIG4gPSB0aGlzLnN1YnN0YXRlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnN1YnN0YXRlc1tpXS5fX2lzQ3VycmVudF9fKSB7IGN1ciA9IHRoaXMuc3Vic3RhdGVzW2ldOyBicmVhazsgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhpc3RvcnkpIHsgdGhpcy5fX3ByZXZpb3VzX18gPSBjdXI7IH1cblxuICAgIGlmIChjdXIpIHsgZXhpdC5jYWxsKGN1ciwgb3B0cyk7IH1cblxuICAgIGNhbGxFeGl0SGFuZGxlcnMuY2FsbCh0aGlzLCBvcHRzLmNvbnRleHQpO1xuICAgIHRoaXMuX19pc0N1cnJlbnRfXyA9IGZhbHNlO1xuICAgIHRyYWNlLmNhbGwodGhpcywgXCJTdGF0ZTogW0VYSVRdICAgOiBcIiArIHRoaXMucGF0aCgpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEV4aXRzIGEgY29uY3VycmVudCBzdGF0ZS4gU2ltaWxpYXIgdG8gYGV4aXRDbHVzdGVyZWRgIHdlXG4gIC8vIHJlY3Vyc2l2ZWx5IGV4aXQgZWFjaCBzdWJzdGF0ZSBhbmQgaW52b2tlIHRoZSBgZXhpdGAgbWV0aG9kIGFzIHRoZSBzdGFja1xuICAvLyB1bndpbmRzLlxuICAvL1xuICAvLyBvcHRzIC0gVGhlIG9wdGlvbnMgcGFzc2VkIHRvIGBnb3RvYC5cbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUgcmVjZWl2ZXIuXG4gIGZ1bmN0aW9uIGV4aXRDb25jdXJyZW50KG9wdHMpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXMucm9vdCgpLCBpLCBuO1xuXG4gICAgZm9yIChpID0gMCwgbiA9IHRoaXMuc3Vic3RhdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgZXhpdC5jYWxsKHRoaXMuc3Vic3RhdGVzW2ldLCBvcHRzKTtcbiAgICB9XG5cbiAgICBjYWxsRXhpdEhhbmRsZXJzLmNhbGwodGhpcywgb3B0cy5jb250ZXh0KTtcbiAgICB0aGlzLl9faXNDdXJyZW50X18gPSBmYWxzZTtcbiAgICBpZiAodGhpcyAhPT0gcm9vdCkgeyB0cmFjZS5jYWxsKHRoaXMsIFwiU3RhdGU6IFtFWElUXSAgIDogXCIgKyB0aGlzLnBhdGgoKSk7IH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEV4aXRzIHRoZSByZWNlaXZlciBzdGF0ZS4gVGhlIGFjdHVhbCBleGl0aW5nIGxvZ2ljIGlzIGluIHRoZVxuICAvLyBgZXhpdENsdXN0ZXJlZGAgYW5kIGBleGl0Q29uY3VycmVudGAgbWV0aG9kcy5cbiAgLy9cbiAgLy8gb3B0cyAgIC0gVGhlIG9wdGlvbnMgcGFzc2VkIHRvIGBnb3RvYC5cbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUgcmVjZWl2ZXIuXG4gIGZ1bmN0aW9uIGV4aXQob3B0cykge1xuICAgIHJldHVybiB0aGlzLmNvbmN1cnJlbnQgP1xuICAgICAgZXhpdENvbmN1cnJlbnQuY2FsbCh0aGlzLCBvcHRzKSA6IGV4aXRDbHVzdGVyZWQuY2FsbCh0aGlzLCBvcHRzKTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBBc2tzIHRoZSByZWNlaXZlciBzdGF0ZSBpZiBpdCBjYW4gZXhpdC5cbiAgLy9cbiAgLy8gZGVzdFN0YXRlcyAtIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZXMuXG4gIC8vIG9wdHMgICAgICAgLSBUaGUgb3B0aW9ucyBwYXNzZWQgdG8gYGdvdG9gLlxuICAvL1xuICAvLyBSZXR1cm5zIGJvb2xlYW4uXG4gIGZ1bmN0aW9uIGNhbkV4aXQoZGVzdFN0YXRlcywgb3B0cykge1xuICAgIHZhciBpLCBuO1xuICAgIGZvciAoaSA9IDAsIG4gPSB0aGlzLnN1YnN0YXRlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnN1YnN0YXRlc1tpXS5fX2lzQ3VycmVudF9fKSB7XG4gICAgICAgIGlmIChjYW5FeGl0LmNhbGwodGhpcy5zdWJzdGF0ZXNbaV0sIGRlc3RTdGF0ZXMsIG9wdHMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNhbkV4aXQoZGVzdFN0YXRlcywgb3B0cy5jb250ZXh0KTtcbiAgfVxuXG4gIC8vIEludGVybmFsOiBBc2tzIHRoZSByZWNlaXZlciBzdGF0ZSBpZiBpdCBjYW4gZXhpdC5cbiAgLy9cbiAgLy8gZGVzdFN0YXRlcyAtIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZXMuXG4gIC8vIG9wdHMgICAgICAgLSBUaGUgb3B0aW9ucyBwYXNzZWQgdG8gYGdvdG9gLlxuICAvL1xuICAvLyBSZXR1cm5zIGJvb2xlYW4uXG4gIGZ1bmN0aW9uIGNhbkVudGVyKGRlc3RTdGF0ZXMsIG9wdHMpIHtcbiAgICB2YXIgaSwgbjtcbiAgICBmb3IgKGkgPSAwLCBuID0gZGVzdFN0YXRlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChkZXN0U3RhdGVzW2ldLmNhbkVudGVyKGRlc3RTdGF0ZXMsIG9wdHMuY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJbnRlcm5hbDogU2VuZHMgYW4gZXZlbnQgdG8gYSBjbHVzdGVyZWQgc3RhdGUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIGV2ZW50IHdhcyBoYW5kbGVkIGJ5IHRoZVxuICAvLyAgIGN1cnJlbnQgc3Vic3RhdGUuXG4gIGZ1bmN0aW9uIHNlbmRDbHVzdGVyZWQoKSB7XG4gICAgdmFyIGhhbmRsZWQgPSBmYWxzZSwgaSwgbiwgY3VyO1xuXG4gICAgZm9yIChpID0gMCwgbiA9IHRoaXMuc3Vic3RhdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKHRoaXMuc3Vic3RhdGVzW2ldLl9faXNDdXJyZW50X18pIHsgY3VyID0gdGhpcy5zdWJzdGF0ZXNbaV07IGJyZWFrOyB9XG4gICAgfVxuXG4gICAgaWYgKGN1cikgeyBoYW5kbGVkID0gISFjdXIuc2VuZC5hcHBseShjdXIsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7IH1cblxuICAgIHJldHVybiBoYW5kbGVkO1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IFNlbmRzIGFuIGV2ZW50IHRvIGEgY29uY3VycmVudCBzdGF0ZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgZXZlbnQgd2FzIGhhbmRsZWQgYnkgYWxsXG4gIC8vICAgc3Vic3RhdGVzLlxuICBmdW5jdGlvbiBzZW5kQ29uY3VycmVudCgpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSwgaGFuZGxlZCA9IHRydWUsIHN0YXRlLCBpLCBuO1xuXG4gICAgZm9yIChpID0gMCwgbiA9IHRoaXMuc3Vic3RhdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgc3RhdGUgICA9IHRoaXMuc3Vic3RhdGVzW2ldO1xuICAgICAgaGFuZGxlZCA9IHN0YXRlLnNlbmQuYXBwbHkoc3RhdGUsIGFyZ3MpICYmIGhhbmRsZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZWQ7XG4gIH1cblxuICAvLyBJbnRlcm5hbDogTG9ncyB0aGUgZ2l2ZW4gbWVzc2FnZS4gSG93IHRoZSBtZXNzYWdlIGdldHMgbG9nZ2VkIGlzIGRldGVybWluZWRcbiAgLy8gYnkgdGhlIGBTdGF0ZS5sb2dnZXJgIHByb3BlcnR5LiBCeSBkZWZhdWx0IHRoaXMgaXMgYGNvbnNvbGVgLCBidXQgY2FuIGJlXG4gIC8vIHNldHRvIHVzZSBhbm90aGVyIGxvZ2dlciBvYmplY3QuIEl0IGFzc3VtZXMgdGhhdCB0aGVyZSBpcyBhbiBgaW5mb2AgbWV0aG9kXG4gIC8vIG9uIHRoZSBsb2dnZXIgb2JqZWN0LlxuICBmdW5jdGlvbiB0cmFjZShtZXNzYWdlKSB7XG4gICAgdmFyIGxvZ2dlciA9IFN0YXRlLmxvZ2dlciB8fCBjb25zb2xlO1xuICAgIGlmICghdGhpcy5yb290KCkudHJhY2UgfHwgIWxvZ2dlcikgeyByZXR1cm47IH1cbiAgICBsb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogVGhlIGBTdGF0ZWAgY29uc3RydWN0b3IuXG4gIC8vXG4gIC8vIG5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZS5cbiAgLy8gb3B0cyAtIEFuIG9iamVjdCBjb250YWluaW5nIHplcm8gb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIGtleXMgKGRlZmF1bHQ6XG4gIC8vICAgICAgICBgbnVsbGApLlxuICAvLyAgICAgICAgY29uY3VycmVudCAtIE1ha2VzIHRoZSBzdGF0ZSdzIHN1YnN0YXRlcyBjb25jdXJyZW50LlxuICAvLyAgICAgICAgSCAgICAgICAgICAtIENhdXNlcyB0aGUgc3RhdGUgdG8ga2VlcCB0cmFjayBvZiBpdHMgaGlzdG9yeSBzdGF0ZS5cbiAgLy8gICAgICAgICAgICAgICAgICAgICBTZXQgdG8gYHRydWVgIHRvIHRyYWNrIGp1c3QgdGhlIGhpc3Rvcnkgb2YgdGhpcyBzdGF0ZVxuICAvLyAgICAgICAgICAgICAgICAgICAgIG9yIGAnKidgIHRvIHRyYWNrIHRoZSBoaXN0b3J5IG9mIGFsbCBzdWJzdGF0ZXMuXG4gIC8vIGYgICAgLSBBIGZ1bmN0aW9uIHRvIGludm9rZSBpbiB0aGUgY29udGV4dCBvZiB0aGUgbmV3bHkgY3JlYXRlZCBzdGF0ZVxuICAvLyAgICAgICAgKGRlZmF1bHQ6IGBudWxsYCkuXG4gIC8vXG4gIC8vIFJldHVybnMgbm90aGluZy5cbiAgLy8gVGhyb3dzIGBFcnJvcmAgaWYgYm90aCB0aGUgYGNvbmN1cnJlbnRgIGFuZCBgSGAgb3B0aW9ucyBhcmUgc2V0LlxuICBmdW5jdGlvbiBTdGF0ZShuYW1lLCBvcHRzLCBmKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmICAgID0gb3B0cztcbiAgICAgICAgb3B0cyA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTdGF0ZSkpIHsgcmV0dXJuIG5ldyBTdGF0ZShuYW1lLCBvcHRzLCBmKTsgfVxuXG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICBpZiAob3B0cy5jb25jdXJyZW50ICYmIG9wdHMuSCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0ZTogaGlzdG9yeSBzdGF0ZXMgYXJlIG5vdCBhbGxvd2VkIG9uIGNvbmN1cnJlbnQgc3RhdGVzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lICAgICAgICAgID0gbmFtZTtcbiAgICB0aGlzLnN1YnN0YXRlTWFwICAgPSB7fTtcbiAgICB0aGlzLnN1YnN0YXRlcyAgICAgPSBbXTtcbiAgICB0aGlzLnN1cGVyc3RhdGUgICAgPSBudWxsO1xuICAgIHRoaXMuZW50ZXJzICAgICAgICA9IFtdO1xuICAgIHRoaXMuZXhpdHMgICAgICAgICA9IFtdO1xuICAgIHRoaXMuZXZlbnRzICAgICAgICA9IHt9O1xuICAgIHRoaXMuY29uY3VycmVudCAgICA9ICEhb3B0cy5jb25jdXJyZW50O1xuICAgIHRoaXMuaGlzdG9yeSAgICAgICA9ICEhKG9wdHMuSCk7XG4gICAgdGhpcy5kZWVwICAgICAgICAgID0gb3B0cy5IID09PSAnKic7XG4gICAgdGhpcy5fX2lzQ3VycmVudF9fID0gZmFsc2U7XG4gICAgdGhpcy5fX2NhY2hlX18gICAgID0ge307XG4gICAgdGhpcy50cmFjZSAgICAgICAgID0gZmFsc2U7XG5cbiAgICBpZiAoZikgeyBmLmNhbGwodGhpcyk7IH1cbiAgfVxuXG4gIC8vIFB1YmxpYzogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBjcmVhdGluZyBhIG5ldyBzdGF0ZWNoYXJ0LiBTaW1wbHkgY3JlYXRlcyBhXG4gIC8vIHJvb3Qgc3RhdGUgYW5kIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIGluIHRoZSBjb250ZXh0IG9mIHRoYXQgc3RhdGUuXG4gIC8vXG4gIC8vIG9wdHMgLSBBbiBvYmplY3Qgb2Ygb3B0aW9ucyB0byBwYXNzIHRoZSB0byB0aGUgYFN0YXRlYCBjb25zdHJ1Y3RvclxuICAvLyAgICAgICAgKGRlZmF1bHQ6IGBudWxsYCkuXG4gIC8vIGYgICAgLSBBIGZ1bmN0aW9uIG9iamVjdCB0byBpbnZva2UgaW4gdGhlIGNvbnRleHQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgcm9vdFxuICAvLyAgICAgICAgc3RhdGUgKGRlZmF1bHQ6IGBudWxsYCkuXG4gIC8vXG4gIC8vIEV4YW1wbGVzXG4gIC8vXG4gIC8vICAgdmFyIHNjID0gU3RhdGUuZGVmaW5lKHtjb25jdXJyZW50OiB0cnVlfSwgZnVuY3Rpb24oKSB7XG4gIC8vICAgICB0aGlzLnN0YXRlKCdhJyk7XG4gIC8vICAgICB0aGlzLnN0YXRlKCdiJyk7XG4gIC8vICAgICB0aGlzLnN0YXRlKCdjJyk7XG4gIC8vICAgfSk7XG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIG5ld2x5IGNyZWF0ZWQgcm9vdCBzdGF0ZS5cbiAgU3RhdGUuZGVmaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wdHMgPSB7fSwgZiA9IG51bGwsIHM7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgb3B0cyA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGYgICAgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGYgPSBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb3B0cyA9IGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzID0gbmV3IFN0YXRlKCdfX3Jvb3RfXycsIG9wdHMpO1xuICAgIGlmIChmKSB7IGYuY2FsbChzKTsgfVxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICAvLyBQdWJsaWM6IENyZWF0ZXMgYSBzdWJzdGF0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBhZGRzIGl0IGFzIGEgc3Vic3RhdGUgdG9cbiAgICAvLyB0aGUgcmVjZWl2ZXIgc3RhdGUuIElmIGEgYFN0YXRlYCBvYmplY3QgaXMgZ2l2ZW4sIHRoZW4gaXQgc2ltcGx5IGFkZHMgdGhlXG4gICAgLy8gc3RhdGUgYXMgYSBzdWJzdGF0ZS4gVGhpcyBhbGxvd3MgeW91IHRvIHNwbGl0IHVwIHRoZSBkZWZpbml0aW9uIG9mIHlvdXJcbiAgICAvLyBzdGF0ZXMgaW5zdGVhZCBvZiBkZWZpbmluZyBldmVyeXRoaW5nIGluIG9uZSBwbGFjZS5cbiAgICAvL1xuICAgIC8vIG5hbWUgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZSBvciBhIGBTdGF0ZWAgb2JqZWN0LlxuICAgIC8vIG9wdHMgLSBBbiBvYmplY3Qgb2Ygb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBgU3RhdGVgIGNvbnN0cnVjdG9yXG4gICAgLy8gICAgICAgIChkZWZhdWx0OiBgbnVsbGApLlxuICAgIC8vIGYgICAgLSBBIGZ1bmN0aW9uIHRvIGludm9rZSBpbiB0aGUgY29udGV4dCBvZiB0aGUgbmV3bHkgY3JlYXRlZCBzdGF0ZVxuICAgIC8vICAgICAgICAoZGVmYXVsdDogYG51bGxgKS5cbiAgICAvL1xuICAgIC8vIEV4YW1wbGVzXG4gICAgLy9cbiAgICAvLyAgIHZhciBzMiA9IG5ldyBTdGF0ZSgnczInKTtcbiAgICAvLyAgIHMyLnN0YXRlKCdzMjEnKTtcbiAgICAvLyAgIHMyLnN0YXRlKCdzMjInKTtcbiAgICAvL1xuICAgIC8vICAgdmFyIHNjID0gU3RhdGUuZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB0aGlzLnN0YXRlKCdzJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgdGhpcy5zdGF0ZSgnczEnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgIHRoaXMuc3RhdGUoJ3MxMScpO1xuICAgIC8vICAgICAgICAgdGhpcy5zdGF0ZSgnczEyJyk7XG4gICAgLy8gICAgICAgfSk7XG4gICAgLy9cbiAgICAvLyAgICAgICB0aGlzLnN0YXRlKHMyKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KTtcbiAgICAvL1xuICAgIC8vIFJldHVybnMgdGhlIG5ld2x5IGNyZWF0ZWQgc3RhdGUuXG4gICAgc3RhdGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBzID0gbmFtZSBpbnN0YW5jZW9mIFN0YXRlID8gbmFtZSA6XG4gICAgICAgIFN0YXRlLmFwcGx5KG51bGwsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICB0aGlzLmFkZFN1YnN0YXRlKHMpO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogUmVnaXN0ZXJzIGFuIGVudGVyIGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdpdGggdGhlIHJlY2VpdmVyIHN0YXRlXG4gICAgLy8gaXMgZW50ZXJlZC4gVGhlIGBjb250ZXh0YCBvcHRpb24gcGFzc2VkIHRvIGBnb3RvYCB3aWxsIGJlIHBhc3NlZCB0byB0aGVcbiAgICAvLyBnaXZlbiBmdW5jdGlvbiB3aGVuIGludm9rZWQuXG4gICAgLy9cbiAgICAvLyBNdWx0aXBsZSBlbnRlciBoYW5kbGVycyBtYXkgYmUgcmVnaXN0ZXJlZCBwZXIgc3RhdGUuIFRoZXkgYXJlIGludm9rZWQgaW5cbiAgICAvLyB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSBhcmUgZGVmaW5lZC5cbiAgICAvL1xuICAgIC8vIGYgLSBBIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgc3RhdGUgaXMgZW50ZXJlZC5cbiAgICAvL1xuICAgIC8vIFJldHVybnMgdGhlIHJlY2VpdmVyLlxuICAgIGVudGVyOiBmdW5jdGlvbihmKSB7IHRoaXMuZW50ZXJzLnB1c2goZik7IHJldHVybiB0aGlzOyB9LFxuXG4gICAgLy8gUHVibGljOiBSZWdpc3RlcnMgYW4gZXhpdCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aXRoIHRoZSByZWNlaXZlciBzdGF0ZVxuICAgIC8vIGlzIGV4aXRlZC4gVGhlIGBjb250ZXh0YCBvcHRpb24gcGFzc2VkIHRvIGBnb3RvYCB3aWxsIGJlIHBhc3NlZCB0byB0aGVcbiAgICAvLyBnaXZlbiBmdW5jdGlvbiB3aGVuIGludm9rZWQuXG4gICAgLy9cbiAgICAvLyBNdWx0aXBsZSBleGl0IGhhbmRsZXJzIG1heSBiZSByZWdpc3RlcmVkIHBlciBzdGF0ZS4gVGhleSBhcmUgaW52b2tlZCBpblxuICAgIC8vIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IGFyZSBkZWZpbmVkLlxuICAgIC8vXG4gICAgLy8gZiAtIEEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBzdGF0ZSBpcyBleGl0ZWQuXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zIHRoZSByZWNlaXZlci5cbiAgICBleGl0OiBmdW5jdGlvbihmKSB7IHRoaXMuZXhpdHMucHVzaChmKTsgcmV0dXJuIHRoaXM7IH0sXG5cbiAgICAvLyBQdWJsaWM6IEEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBwcmV2ZW50IGEgc3RhdGUgZnJvbSBiZWluZyBleGl0ZWQuXG4gICAgLy8gYGRlc3RTdGF0ZXNgIGFuZCBgY29udGV4dGAgYXJlIHRoZSBkZXN0aW5hdGlvbiBzdGF0ZXMgYW5kIGNvbnRleHQgdGhhdFxuICAgIC8vIHdpbGwgYmUgdHJhbnNpdGlvbmVkIHRvIGlmIHRoZSBzdGF0ZXMgY2FuIGJlIGV4aXRlZC5cbiAgICAvL1xuICAgIC8vIGRlc3RTdGF0ZXMgLSBUaGUgZGVzdGluYXRpb24gc3RhdGVzLlxuICAgIC8vIGNvbnRleHQgICAgLSBUaGUgZGVzdGluYXRpb24gY29udGV4dC5cbiAgICAvL1xuICAgIC8vIFJldHVybnMgdGhlIHJlY2VpdmVyLlxuICAgIGNhbkV4aXQ6IGZ1bmN0aW9uKC8qZGVzdFN0YXRlcywgY29udGV4dCovKSB7IHJldHVybiB0cnVlOyB9LFxuXG4gICAgLy8gUHVibGljOiBBIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJldmVudCBhIHN0YXRlIGZyb20gYmVpbmcgZXhpdGVkLlxuICAgIC8vIGBkZXN0U3RhdGVzYCBhbmQgYGNvbnRleHRgIGFyZSB0aGUgZGVzdGluYXRpb24gc3RhdGVzIGFuZCBjb250ZXh0IHRoYXRcbiAgICAvLyB3aWxsIGJlIHRyYW5zaXRpb25lZCB0byBpZiB0aGUgc3RhdGVzIGNhbiBiZSBleGl0ZWQuXG4gICAgLy9cbiAgICAvLyBkZXN0U3RhdGVzIC0gVGhlIGRlc3RpbmF0aW9uIHN0YXRlcy5cbiAgICAvLyBjb250ZXh0ICAgIC0gVGhlIGRlc3RpbmF0aW9uIGNvbnRleHQuXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zIHRoZSByZWNlaXZlci5cbiAgICBjYW5FbnRlcjogZnVuY3Rpb24oLypkZXN0U3RhdGVzLCBjb250ZXh0Ki8pIHsgcmV0dXJuIHRydWU7IH0sXG5cbiAgICAvLyBQdWJsaWM6IFJlZ2lzdGVycyBhbiBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIGFuIGV2ZW50IHdpdGggYVxuICAgIC8vIG1hdGNoaW5nIG5hbWUgaXMgc2VudCB0byB0aGUgc3RhdGUgdmlhIHRoZSBgc2VuZGAgbWV0aG9kLlxuICAgIC8vXG4gICAgLy8gT25seSBvbmUgZXZlbnQgaGFuZGxlciBtYXkgYmUgcmVnaXN0ZXJlZCBwZXIgZXZlbnQuXG4gICAgLy9cbiAgICAvLyBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgIC8vIGYgICAgLSBBIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgb2NjdXJzLlxuICAgIC8vXG4gICAgLy8gUmV0dXJucyB0aGUgcmVjZWl2ZXIuXG4gICAgZXZlbnQ6IGZ1bmN0aW9uKG5hbWUsIGYpIHsgdGhpcy5ldmVudHNbbmFtZV0gPSBmOyByZXR1cm4gdGhpczsgfSxcblxuICAgIC8vIFB1YmxpYzogRGVmaW5lcyBhIGNvbmRpdGlvbiBzdGF0ZSBvbiB0aGUgcmVjZWl2ZXIgc3RhdGUuIENvbmRpdGlvbiBzdGF0ZXNcbiAgICAvLyBhcmUgY29uc3VsdGVkIHdoZW4gZW50ZXJpbmcgYSBjbHVzdGVyZWQgc3RhdGUgd2l0aG91dCBzcGVjaWZpZWQgZGVzdGluYXRpb25cbiAgICAvLyBzdGF0ZXMuIFRoZSBnaXZlbiBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgcGF0aCB0byBzb21lIHN1YnN0YXRlIG9mIHRoZVxuICAgIC8vIHN0YXRlIHRoYXQgdGhlIGNvbmRpdGlvbiBzdGF0ZSBpcyBkZWZpbmVkIG9uLlxuICAgIC8vXG4gICAgLy8gZiAtIFRoZSBjb25kaXRpb24gZnVuY3Rpb24uXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlc1xuICAgIC8vXG4gICAgLy8gICB2YXIgc2MgPSBTdGF0ZS5kZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIHRoaXMuc3RhdGUoJ2EnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICB0aGlzLkMoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICBpZiAoc2hvdWxkR29Ub0IpIHsgcmV0dXJuICcuL2InOyB9XG4gICAgLy8gICAgICAgICBpZiAoc2hvdWxkR29Ub0MpIHsgcmV0dXJuICcuL2MnOyB9XG4gICAgLy8gICAgICAgICBpZiAoc2hvdWxkR29Ub0QpIHsgcmV0dXJuICcuL2QnOyB9XG4gICAgLy8gICAgICAgfSk7XG4gICAgLy8gICAgICAgdGhpcy5zdGF0ZSgnYicpO1xuICAgIC8vICAgICAgIHRoaXMuc3RhdGUoJ2MnKTtcbiAgICAvLyAgICAgICB0aGlzLnN0YXRlKCdkJyk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSk7XG4gICAgLy9cbiAgICAvLyBSZXR1cm5zIG5vdGhpbmcuXG4gICAgQzogZnVuY3Rpb24oZikge1xuICAgICAgaWYgKHRoaXMuY29uY3VycmVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRlI0M6IGEgY29uY3VycmVudCBzdGF0ZSBtYXkgbm90IGhhdmUgYSBjb25kaXRpb24gc3RhdGU6ICcgKyB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX2NvbmRpdGlvbl9fID0gZjtcbiAgICB9LFxuXG4gICAgLy8gUHVibGljOiBSZXR1cm5zIGFuIGFycmF5IG9mIHBhdGhzIHRvIGFsbCBjdXJyZW50IGxlYWYgc3RhdGVzLlxuICAgIGN1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0YXRlcyA9IF9jdXJyZW50LmNhbGwodGhpcyksIHBhdGhzID0gW10sIGksIG47XG5cbiAgICAgIGZvciAoaSA9IDAsIG4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHBhdGhzLnB1c2goc3RhdGVzW2ldLnBhdGgoKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXRocztcbiAgICB9LFxuXG4gICAgLy8gUHVibGljOiBUaGUgYFN0YXRlYCBpdGVyYXRvciAtIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2hcbiAgICAvLyBzdGF0ZSBpbiB0aGUgc3RhdGVjaGFydC4gVGhlIHN0YXRlcyBhcmUgdHJhdmVyc2VkIGluIGEgcHJlb3JkZXIgZGVwdGgtZmlyc3RcbiAgICAvLyBtYW5uZXIuXG4gICAgLy9cbiAgICAvLyBmIC0gQSBmdW5jdGlvbiBvYmplY3QsIGl0IHdpbGwgYmUgaW52b2tlZCBvbmNlIGZvciBlYWNoIHN0YXRlLlxuICAgIC8vXG4gICAgLy8gUmV0dXJucyB0aGUgcmVjZWl2ZXIuXG4gICAgZWFjaDogZnVuY3Rpb24oZikge1xuICAgICAgdmFyIGksIG47XG5cbiAgICAgIGYodGhpcyk7XG5cbiAgICAgIGZvciAoaSA9IDAsIG4gPSB0aGlzLnN1YnN0YXRlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdGhpcy5zdWJzdGF0ZXNbaV0uZWFjaChmKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogQWRkcyB0aGUgZ2l2ZW4gc3RhdGUgYXMgYSBzdWJzdGF0ZSBvZiB0aGUgcmVjZWl2ZXIgc3RhdGUuXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zIHRoZSByZWNlaXZlci5cbiAgICBhZGRTdWJzdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHZhciBkZWVwID0gdGhpcy5oaXN0b3J5ICYmIHRoaXMuZGVlcDtcbiAgICAgIHRoaXMuc3Vic3RhdGVNYXBbc3RhdGUubmFtZV0gPSBzdGF0ZTtcbiAgICAgIHRoaXMuc3Vic3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgc3RhdGUuZWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgIHMuX19jYWNoZV9fID0ge307XG4gICAgICAgIGlmIChkZWVwKSB7IHMuaGlzdG9yeSA9IHMuZGVlcCA9IHRydWU7IH1cbiAgICAgIH0pO1xuICAgICAgc3RhdGUuc3VwZXJzdGF0ZSA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gUHVibGljOiBSZXR1cm5zIHRoZSByb290IHN0YXRlLlxuICAgIHJvb3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZV9fLnJvb3QgPSB0aGlzLl9fY2FjaGVfXy5yb290IHx8XG4gICAgICAgICh0aGlzLnN1cGVyc3RhdGUgPyB0aGlzLnN1cGVyc3RhdGUucm9vdCgpIDogdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBmdWxsIHBhdGggZnJvbSB0aGUgcm9vdCBzdGF0ZSB0b1xuICAgIC8vIHRoZSByZWNlaXZlciBzdGF0ZS4gU3RhdGUgcGF0aHMgYXJlIHZlcnkgc2ltaWxhciB0byB1bml4IGRpcmVjdG9yeSBwYXRocy5cbiAgICAvL1xuICAgIC8vIEV4YW1wbGVzXG4gICAgLy9cbiAgICAvLyAgIHZhciByID0gbmV3IFN0YXRlKCdyb290JyksXG4gICAgLy8gICAgICAgYSA9IG5ldyBTdGF0ZSgnYScpLFxuICAgIC8vICAgICAgIGIgPSBuZXcgU3RhdGUoJ2InKSxcbiAgICAvLyAgICAgICBjID0gbmV3IFN0YXRlKCdjJyk7XG4gICAgLy9cbiAgICAvLyAgIHIuYWRkU3Vic3RhdGUoYSk7XG4gICAgLy8gICBhLmFkZFN1YnN0YXRlKGIpO1xuICAgIC8vICAgYi5hZGRTdWJzdGF0ZShjKTtcbiAgICAvL1xuICAgIC8vICAgci5wYXRoKCk7IC8vID0+IFwiL1wiXG4gICAgLy8gICBhLnBhdGgoKTsgLy8gPT4gXCIvYVwiXG4gICAgLy8gICBiLnBhdGgoKTsgLy8gPT4gXCIvYS9iXCJcbiAgICAvLyAgIGMucGF0aCgpOyAvLyA9PiBcIi9hL2IvY1wiXG4gICAgcGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3RhdGVzID0gX3BhdGguY2FsbCh0aGlzKSwgbmFtZXMgPSBbXSwgaSwgbGVuO1xuXG4gICAgICBmb3IgKGkgPSAxLCBsZW4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbmFtZXMucHVzaChzdGF0ZXNbaV0ubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnLycgKyBuYW1lcy5qb2luKCcvJyk7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogU2V0cyB1cCBhIHRyYW5zaXRpb24gZnJvbSB0aGUgcmVjZWl2ZXIgc3RhdGUgdG8gdGhlIGdpdmVuXG4gICAgLy8gZGVzdGluYXRpb24gc3RhdGVzLiBUcmFuc2l0aW9ucyBhcmUgdXN1YWxseSB0cmlnZ2VyZWQgZHVyaW5nIGV2ZW50XG4gICAgLy8gaGFuZGxlcnMgY2FsbGVkIGJ5IHRoZSBgc2VuZGAgbWV0aG9kLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIG9uIHRoZVxuICAgIC8vIHJvb3Qgc3RhdGUgdG8gc2VuZCB0aGUgc3RhdGVjaGFydCBpbnRvIGl0cyBpbml0aWFsIHNldCBvZiBjdXJyZW50IHN0YXRlcy5cbiAgICAvL1xuICAgIC8vIHBhdGhzIC0gWmVybyBvciBtb3JlIHN0cmluZ3MgcmVwcmVzZW50aW5nIGRlc3RpbmF0aW9uIHN0YXRlIHBhdGhzIChkZWZhdWx0OlxuICAgIC8vICAgICAgICAgYFtdYCkuXG4gICAgLy8gb3B0cyAgLSBBbiBvYmplY3QgY29udGFpbmluZyB6ZXJvIG9yIG1vcmUgb2YgdGhlIGZvbGxvd2luZyBrZXlzOlxuICAgIC8vICAgICAgICAgY29udGV4dCAtIEFuIG9iamVjdCB0byBwYXNzIGFsb25nIHRvIHRoZSBgZXhpdGAgYW5kIGBlbnRlcmAgbWV0aG9kc1xuICAgIC8vICAgICAgICAgICAgICAgICAgIGludm9rZWQgZHVyaW5nIHRoZSBhY3R1YWwgdHJhbnNpc3Rpb24uXG4gICAgLy8gICAgICAgICBmb3JjZSAgIC0gRm9yY2VzIGBlbnRlcmAgbWV0aG9kcyB0byBiZSBjYWxsZWQgZHVyaW5nIHRoZSB0cmFuc2l0aW9uXG4gICAgLy8gICAgICAgICAgICAgICAgICAgb24gc3RhdGVzIHRoYXQgYXJlIGFscmVhZHkgY3VycmVudC5cbiAgICAvL1xuICAgIC8vIEV4YW1wbGVzXG4gICAgLy9cbiAgICAvLyAgIHZhciBzYyA9IFN0YXRlLmRlZmluZShmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgdGhpcy5zdGF0ZSgnYScsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgIHRoaXMuc3RhdGUoJ2InLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgIHRoaXMuZm9vID0gZnVuY3Rpb24oKSB7IHRoaXMuZ290bygnLi4vYycpOyB9O1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICAgIHRoaXMuc3RhdGUoJ2MnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgIHRoaXMuYmFyID0gZnVuY3Rpb24oKSB7IHRoaXMuZ290bygnLi4vYicpOyB9O1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH0pO1xuICAgIC8vXG4gICAgLy8gICBzYy5nb3RvKCk7XG4gICAgLy8gICBzYy5jdXJyZW50KCk7ICAgLy8gPT4gWycvYS9iJ11cbiAgICAvLyAgIHNjLnNlbmQoJ2ZvbycpO1xuICAgIC8vICAgc2MuY3VycmVudCgpOyAgIC8vID0+IFsnL2EvYyddXG4gICAgLy8gICBzYy5zZW5kKCdiYXInKTtcbiAgICAvLyAgIHNjLmN1cnJlbnQoKTsgICAvLyA9PiBbJy9hL2InXVxuICAgIC8vXG4gICAgLy8gUmV0dXJucyBib29sZWFuLiBgZmFsc2VgIGlmIHRyYW5zaXRpb24gZmFpbGVkLlxuICAgIC8vIFRocm93cyBhbiBgRXJyb3JgIGlmIGNhbGxlZCBvbiBhIG5vbi1jdXJyZW50IG5vbi1yb290IHN0YXRlLlxuICAgIC8vIFRocm93cyBhbiBgRXJyb3JgIGlmIG11bHRpcGxlIHBpdm90IHN0YXRlcyBhcmUgZm91bmQgYmV0d2VlbiB0aGUgcmVjZWl2ZXJcbiAgICAvLyAgIGFuZCBkZXN0aW5hdGlvbiBzdGF0ZXMuXG4gICAgLy8gVGhyb3dzIGFuIGBFcnJvcmAgaWYgYSBkZXN0aW5hdGlvbiBwYXRoIGlzIG5vdCByZWFjaGFibGUgZnJvbSB0aGUgcmVjZWl2ZXIuXG4gICAgZ290bzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcm9vdCAgID0gdGhpcy5yb290KCksXG4gICAgICAgICAgcGF0aHMgID0gZmxhdHRlbihzbGljZS5jYWxsKGFyZ3VtZW50cykpLFxuICAgICAgICAgIG9wdHMgICA9IHR5cGVvZiBwYXRoc1twYXRocy5sZW5ndGggLSAxXSA9PT0gJ29iamVjdCcgPyBwYXRocy5wb3AoKSA6IHt9LFxuICAgICAgICAgIHN0YXRlcyA9IFtdLFxuICAgICAgICAgIHBpdm90cyA9IFtdLFxuICAgICAgICAgIHN0YXRlLCBwaXZvdCwgaSwgbjtcblxuICAgICAgZm9yIChpID0gMCwgbiA9IHBhdGhzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAoIShzdGF0ZSA9IHRoaXMucmVzb2x2ZShwYXRoc1tpXSkpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0ZSNnb3RvOiBjb3VsZCBub3QgcmVzb2x2ZSBwYXRoICcgKyBwYXRoc1tpXSArICcgZnJvbSAnICsgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIG4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHBpdm90cy5wdXNoKGZpbmRQaXZvdC5jYWxsKHRoaXMsIHN0YXRlc1tpXSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAobXVsdGlwbGVVbmlxcyhwaXZvdHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0YXRlI2dvdG86IG11bHRpcGxlIHBpdm90IHN0YXRlcyBmb3VuZCBiZXR3ZWVuIHN0YXRlIFwiICsgdGhpcyArIFwiIGFuZCBwYXRocyBcIiArIHBhdGhzLmpvaW4oJywgJykpO1xuICAgICAgfVxuXG4gICAgICBwaXZvdCA9IHBpdm90c1swXSB8fCB0aGlzO1xuXG4gICAgICBpZiAoY2FuRXhpdC5jYWxsKHBpdm90LCBzdGF0ZXMsIG9wdHMpID09PSBmYWxzZSl7XG4gICAgICAgIHRyYWNlLmNhbGwodGhpcywgJ1N0YXRlOiBbR09UT10gICA6ICcgKyB0aGlzICsgJyBjYW4gbm90IGV4aXRdJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbkVudGVyLmNhbGwocGl2b3QsIHN0YXRlcywgb3B0cykgPT09IGZhbHNlKXtcbiAgICAgICAgdHJhY2UuY2FsbCh0aGlzLCAnU3RhdGU6IFtHT1RPXSAgIDogJyArIHRoaXMgKyAnIGNhbiBub3QgZXhpdF0nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0cmFjZS5jYWxsKHRoaXMsICdTdGF0ZTogW0dPVE9dICAgOiAnICsgdGhpcyArICcgLT4gWycgKyBzdGF0ZXMuam9pbignLCAnKSArICddJyk7XG5cbiAgICAgIGlmICghdGhpcy5fX2lzQ3VycmVudF9fICYmIHRoaXMuc3VwZXJzdGF0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRlI2dvdG86IHN0YXRlICcgKyB0aGlzICsgJyBpcyBub3QgY3VycmVudCcpO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgcGl2b3Qgc3RhdGUgaXMgYSBjb25jdXJyZW50IHN0YXRlIGFuZCBpcyBub3QgYWxzbyB0aGUgc3RhcnRpbmdcbiAgICAgIC8vIHN0YXRlLCB0aGVuIHdlJ3JlIGF0dGVtcHRpbmcgdG8gY3Jvc3MgYSBjb25jdXJyZW5jeSBib3VuZGFyeSwgd2hpY2ggaXNcbiAgICAgIC8vIG5vdCBhbGxvd2VkXG4gICAgICBpZiAocGl2b3QuY29uY3VycmVudCAmJiBwaXZvdCAhPT0gdGhpcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0YXRlI2dvdG86IG9uZSBvciBtb3JlIG9mIHRoZSBnaXZlbiBwYXRocyBhcmUgbm90IHJlYWNoYWJsZSBmcm9tIHN0YXRlICcgKyB0aGlzICsgJzogJyArICBwYXRocy5qb2luKCcsICcpKTtcbiAgICAgIH1cblxuICAgICAgcXVldWVUcmFuc2l0aW9uLmNhbGwocm9vdCwgcGl2b3QsIHN0YXRlcywgb3B0cyk7XG5cbiAgICAgIGlmICghdGhpcy5fX2lzU2VuZGluZ19fKSB7IHRyYW5zaXRpb24uY2FsbChyb290KTsgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gUHVibGljOiBTZW5kcyBhbiBldmVudCB0byB0aGUgc3RhdGVjaGFydC4gQSBzdGF0ZWNoYXJ0IGhhbmRsZXMgYW4gZXZlbnRcbiAgICAvLyBieSBnaXZpbmcgZWFjaCBjdXJyZW50IGxlYWYgc3RhdGUgYW4gb3Bwb3J0dW5pdHkgdG8gaGFuZGxlIGl0LiBFdmVudHNcbiAgICAvLyBidWJibGUgdXAgc3VwZXJzdGF0ZSBjaGFpbnMgYXMgbG9uZyBhcyBoYW5kbGVyIG1ldGhvZHMgZG8gbm90IHJldHVybiBhXG4gICAgLy8gdHJ1dGh5IHZhbHVlLiBXaGVuIGEgaGFuZGxlciBkb2VzIHJldHVybiBhIHRydXRoeSB2YWx1ZSAoaW5kaWNhdGluZyB0aGF0XG4gICAgLy8gaXQgaGFzIGhhbmRsZWQgdGhlIGV2ZW50KSB0aGUgYnViYmxpbmcgaXMgY2FuY2VsZWQuIEEgaGFuZGxlciBtZXRob2QgaXNcbiAgICAvLyByZWdpc3RlcmVkIHdpdGggdGhlIGBldmVudGAgbWV0aG9kLlxuICAgIC8vXG4gICAgLy8gZXZlbnQgICAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGV2ZW50IG5hbWUuXG4gICAgLy8gYXJncy4uLiAtIFplcm8gb3IgbW9yZSBhcmd1bWVudHMgdGhhdCBnZXQgcGFzc2VkIG9uIHRvIHRoZSBoYW5kbGVyIG1ldGhvZHMuXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRoZSBldmVudCB3YXMgaGFuZGxlZC5cbiAgICAvLyBUaHJvd3MgYEVycm9yYCBpZiB0aGUgc3RhdGUgaXMgbm90IGN1cnJlbnQuXG4gICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSwgZXZlbnRzID0gdGhpcy5ldmVudHMsIGhhbmRsZWQ7XG5cbiAgICAgIGlmICghdGhpcy5fX2lzQ3VycmVudF9fKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGUjc2VuZDogYXR0ZW1wdGVkIHRvIHNlbmQgYW4gZXZlbnQgdG8gYSBzdGF0ZSB0aGF0IGlzIG5vdCBjdXJyZW50OiAnICsgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzID09PSB0aGlzLnJvb3QoKSkge1xuICAgICAgICB0cmFjZS5jYWxsKHRoaXMsICdTdGF0ZTogW0VWRU5UXSAgOiAnICsgYXJnc1swXSk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZWQgPSB0aGlzLmNvbmN1cnJlbnQgPyBzZW5kQ29uY3VycmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDpcbiAgICAgICAgc2VuZENsdXN0ZXJlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICBpZiAoIWhhbmRsZWQgJiYgdHlwZW9mIGV2ZW50c1thcmdzWzBdXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLl9faXNTZW5kaW5nX18gPSB0cnVlO1xuICAgICAgICBoYW5kbGVkID0gISFldmVudHNbYXJnc1swXV0uYXBwbHkodGhpcywgYXJncy5zbGljZSgxKSk7XG4gICAgICAgIHRoaXMuX19pc1NlbmRpbmdfXyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc3VwZXJzdGF0ZSkgeyB0cmFuc2l0aW9uLmNhbGwodGhpcyk7IH1cblxuICAgICAgcmV0dXJuIGhhbmRsZWQ7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogUmVzZXRzIHRoZSBzdGF0ZWNoYXJ0IGJ5IGV4aXRpbmcgYWxsIGN1cnJlbnQgc3RhdGVzLlxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHsgZXhpdC5jYWxsKHRoaXMsIHt9KTsgfSxcblxuICAgIC8vIFB1YmxpYzogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgc3RhdGUgYXQgdGhlIGdpdmVuXG4gICAgLy8gcGF0aCBpcyBjdXJyZW50LlxuICAgIC8vXG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgb3IgYGZhbHNlYC5cbiAgICAvLyBUaHJvd3MgYEVycm9yYCBpZiB0aGUgcGF0aCBjYW5ub3QgYmUgcmVzb2x2ZWQuXG4gICAgaXNDdXJyZW50OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICB2YXIgc3RhdGUgPSB0aGlzLnJlc29sdmUocGF0aCk7XG4gICAgICByZXR1cm4gISEoc3RhdGUgJiYgc3RhdGUuX19pc0N1cnJlbnRfXyk7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogUmVzb2x2ZXMgYSBzdHJpbmcgcGF0aCBpbnRvIGFuIGFjdHVhbCBgU3RhdGVgIG9iamVjdC4gUGF0aHMgbm90XG4gICAgLy8gc3RhcnRpbmcgd2l0aCBhICcvJyBhcmUgcmVzb2x2ZWQgcmVsYXRpdmUgdG8gdGhlIHJlY2VpdmVyIHN0YXRlLCBwYXRocyB0aGF0XG4gICAgLy8gZG8gc3RhcnQgd2l0aCBhICcvJyBhcmUgcmVzb2x2ZWQgcmVsYXRpdmUgdG8gdGhlIHJvb3Qgc3RhdGUuXG4gICAgLy9cbiAgICAvLyBwYXRoICAgICAgLSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBwYXRoIHRvIHJlc29sdmUgb3IgYW4gYXJyYXkgb2YgcGF0aFxuICAgIC8vICAgICAgICAgICAgIHNlZ21lbnRzLlxuICAgIC8vIG9yaWdQYXRoICAtIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIG9yaWdpbmFsIHBhdGggdGhhdCB3ZSdyZSBhdHRlbXB0aW5nIHRvXG4gICAgLy8gICAgICAgICAgICAgcmVzb2x2ZS4gTXVsdGlwbGUgcmVjdXJzaXZlIGNhbGxzIGFyZSBtYWRlIHRvIHRoaXMgbWV0aG9kIHNvIHdlXG4gICAgLy8gICAgICAgICAgICAgbmVlZCB0byBwYXNzIGFsb25nIHRoZSBvcmlnaW5hbCBzdHJpbmcgcGF0aCBmb3IgZXJyb3IgbWVzc2FnZXNcbiAgICAvLyAgICAgICAgICAgICBpbiB0aGUgY2FzZSB3aGVyZSB0aGUgcGF0aCBjYW5ub3QgYmUgcmVzb2x2ZWQuXG4gICAgLy8gb3JpZ1N0YXRlIC0gVGhlIHN0YXRlIHdoZXJlIHBhdGggcmVzb2x1dGlvbiB3YXMgb3JpZ2luYWxseSBhdHRlbXB0ZWQgZnJvbS5cbiAgICAvL1xuICAgIC8vIFJldHVybnMgdGhlIGBTdGF0ZWAgb2JqZWN0IHRoZSBwYXRoIHJlcHJlc2VudHMgaWYgaXQgY2FuIGJlIHJlc29sdmUgYW5kXG4gICAgLy8gICBgbnVsbGAgb3RoZXJ3aXNlLlxuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHBhdGgsIG9yaWdQYXRoLCBvcmlnU3RhdGUpIHtcbiAgICAgIHZhciBoZWFkLCBuZXh0O1xuXG4gICAgICBpZiAoIXBhdGgpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgb3JpZ1BhdGggID0gb3JpZ1BhdGggfHwgcGF0aDtcbiAgICAgIG9yaWdTdGF0ZSA9IG9yaWdTdGF0ZSB8fCB0aGlzO1xuICAgICAgcGF0aCAgICAgID0gdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnID8gcGF0aC5zcGxpdCgnLycpIDogcGF0aDtcbiAgICAgIGhlYWQgICAgICA9IHBhdGguc2hpZnQoKTtcblxuICAgICAgc3dpdGNoIChoZWFkKSB7XG4gICAgICBjYXNlICcnOlxuICAgICAgICBuZXh0ID0gdGhpcy5yb290KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLic6XG4gICAgICAgIG5leHQgPSB0aGlzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgbmV4dCA9IHRoaXMuc3VwZXJzdGF0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBuZXh0ID0gdGhpcy5zdWJzdGF0ZU1hcFtoZWFkXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFuZXh0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiBwYXRoLmxlbmd0aCA9PT0gMCA/IG5leHQgOiBuZXh0LnJlc29sdmUocGF0aCwgb3JpZ1BhdGgsIG9yaWdTdGF0ZSk7XG4gICAgfSxcblxuICAgIC8vIFB1YmxpYzogUmV0dXJucyBhIGZvcm1hdHRlZCBzdHJpbmcgd2l0aCB0aGUgc3RhdGUncyBmdWxsIHBhdGguXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ1N0YXRlKCcgKyB0aGlzLnBhdGgoKSArICcpJzsgfVxuICB9O1xuXG4gIGV4cG9ydHMuU3RhdGUgPSBTdGF0ZTtcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gdGhpcy5zdGF0ZWNoYXJ0ID0ge30gOiBleHBvcnRzKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=