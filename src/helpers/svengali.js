/*
Public: An encapsulation of a state chart's attrs and behavior

Examples

  var s = new StateChart({
    attrs: ['root_attr'],
    enter(){ this.root_attr='root_attr value' },

    defaultState: 'on',
    states:{
      off:{
        attrs:{isOn: false}
      },
      on:{
        attrs:{isOn: true}
      }
    }
  });

  s.goto();

  s.attrs;
  //=> {root_attr:'root_attr value', on_attr:'on_attr value'}

  s.goto('off');

  s.attrs;
  //=> {root_attr:'root_attr value', off_attr:'off_attr value'}
*/
export class StateChart {

  /*
  Public: Creates a StateChart from the definition of the root state.

  options - an Object defining the root state (default: {})
            concurrent: - a Boolean, if true, makes a concurrent state
                          (default: true).

            history:    - a Boolean, if true, makes a history state.
                          (default: false).

            params:     - an Array of parameters required to enter this state
                          (optional).

                          Example

                              var ARTICLES=[{title:'hello world'}]
                              var s = new StateChart({
                                default: 'index',
                                articles:{
                                  show:{
                                    params: ['articleId'],
                                    attrs:  {
                                      article: ({articleId})=>ARTICLES[articleId]
                                    }
                                  },
                                  index:{...}
                                }
                              });

                              // If you don't pass all required params
                              s.goto('show');

                              s.goto('show', {articleId:0});
                              s.attrs.article.title
                              //=> 'hello world'


                          Attempting to go to a state without providing all the
                          necessary params will prevent the transition.

            attrs:      - an Object map of attrs and their values that will
                          be read-only accessable on the `attrs` attribute on the
                          state chart (optional).

                          Example

                              attrs:{
                                isOn       : true,
                                currentTab : 'profile'
                              }

                          ### On enter determined attr values

                          Specifying an attr initializer function allows the value
                          to be determined upon entering the state.

                          Example

                              attrs:{
                                createdAt:()=>Date.now()
                              }

                          Attr initalizer functions receives the `params` object.

                          Example

                              params:['articleId'],
                              attrs:{
                                article: ({articleId})=>Article.get(articleId)
                              }

                          ### Promise attr values

                          A function that returns a Promise allows values to be
                          determined asynchronously.

                          Example

                              attrs:{
                                article:()=>new Promise(resolve=>
                                          fetchArticle(resolve)
                                        )
                              }

                          ### Attr values that are functions or Promises

                          If attr value is a function, simply wrap the function
                          or Promise in an `attrValue()`.

                          Example

                              attrs:{
                                getGreeting: attrValue(()=>'Hello World'),
                                taskPromise: ()=>attrValue(new Promise(...))
                              }

                          ### Dependant attr values

                          You can access other attrs using `this`.

                          Example

                              attrs:{
                                user:    ()=>new User,
                                address: ()=>this.user.address
                              }

                          If the other attr is determined asynchrnously (Promise),
                          `this.resolveAttr('attrName')` returns a promise that
                          can be used to resolve the value.

                          Example

                              attrs:{
                                user:    ()=>User.get(id:'1234'),
                                address: ()=>this.resolveAttr('user').then(user=>
                                  user.address
                                )
                              }

            enter:      - a Function that is called when this state is entered
                          (optional).

            exit:       - a Function that is called when this state is exited
                          (optional).

            events:     - an Object map defining transitions and event handlers
                          (optional).

                          ## General Format

                              events: {
                                // Event transitions to a new state
                                [Event Name]: [State Path String]

                                // Transitioning to a state(s) with `params`
                                [Event Name]: {

                                  // Predetermined params
                                  [State Path String]: [Params Object]

                                  // Dynamicaly determined `params`
                                  [State Path String]: [Function returning Params Object]
                                }

                                // Transitioning to a dynamically determined
                                // state(s).
                                [Event Name]: [Function returning an Object]

                                // Event Handler (No transition)
                                [Event Name]: [Function returning undefined]
                              }

                          ## Events that transition to a new state

                          Example

                              events:{
                                // On `'selectIndex'` event, go to the `'index'`
                                // state.
                                'selectIndex':'./index'
                              }

                          ## Transitioning to a state with `params`

                          Example

                              events:{
                                // On `'selectProduct'` event, go to `'productView'`
                                // state with `productId` param.
                                'selectProduct':{
                                  './productView':(productId)=>({productId})
                                }
                              }

                          ## Transitioning to a dynamically determined state

                          Example

                              events:{
                                // On `'selectOption'` event, if the option is a
                                // service, go to the `'serviceView'` state.
                                // Otherwise go to the `'productView'` state.
                                'selectOption'(option){
                                  var nextState = undefined;
                                  (option.isService)
                                    ? { './serviceView':{ serviceId:option.id } }
                                    : { './productView':{ productId:option.id } }
                                }
                              }

                          ## Event handlers

                          If you want to react to an event, but not transition to
                          another state.

                          Example

                              events:{
                                'optionMouseOvered'(option){
                                  console.log('User moused over',option.name);
                                }
                              }

            states:     - an Object map defining sub-states (optional).
  */
  constructor(rootStateOptions){
    this.attrs = {};
    this.rootState = new State(null, this, rootStateOptions);
  }

  goto(path='.', params={}){
    this.rootState.scState.goto(path, {context:params});
  }

  fire(eventName, ...args){
    this.rootState.scState.send(eventName, ...args);
  }
}

// TODO(pwong): should be `const`, waiting on traceur 0.0.66 upgrade.
var EMPTY_OBJ    = {};
var NOOP         = ()=> EMPTY_OBJ;
var nextStateUID = 1;

export function attrValue(val){
  if(this instanceof attrValue)
    this.val = val;
  else
    return new attrValue(val);
}

// Internal: Encapsulation of a State's attrs and behavior.  With helpers
//           for transitioning in an out of this state.
export class State {

  // Public: Creates a State
  //
  constructor(
    parent,
    stateChart,
    {concurrent, history, params, attrs, enter, exit, events, states, default:defaultState},
    name=nextStateUID++
  ){
    this.params     = params;
    this.stateChart = stateChart;
    this.attrs      = attrs || EMPTY_OBJ;
    this.enter      = enter || NOOP;
    this.exit       = exit  || NOOP;

    var scState = this.scState = statechart.State(name, {
      name       : name,
      concurrent : !!concurrent,
      history    : !!history
    });

    if(params)
      scState.canEnter = (states, params)=>this._canEnter_checkParams(params);
    scState.enter(params=>this._doEnter(params));
    scState.exit(()=>this._doExit());

    if(events)
      Object.keys(events).
        forEach(eventName=>this._registerEvent(eventName, events[eventName]));

    if(states)
      // Add the defaultState first, so the stateChart defaults to this state
      (defaultState && states[defaultState] ? [defaultState] : []).
        concat(Object.keys(states)).
        forEach(stateName=>
          scState.addSubstate(
            new State(
              this, stateChart, states[stateName], stateName
            ).scState
          )
        );
  }

  _getDestWithParams(destWithParams){
    var dest = Object.keys(destWithParams)[0];
    if(dest) return [dest, destWithParams[dest]];
  }

  _event_transitionToState(state){
    return this.scState.goto.bind(this.scState, state);
  }

  _event_transitionToStatesWithParams(statesToParams){
    var [dest, context] = this._getDestWithParams(statesToParams);
    return (typeof context === 'function')
        ? ()=>this.scState.goto(dest, {context:context()})
        : this.scState.goto.bind(
            this.scState,
            dest,
            {context}
          );
  }

  _event_transitionToDynamicState(func){
    return ()=>{
      var result = func();
      if(typeof result === 'string'){
        this.scState.goto(result);
      } else if(typeof result === 'object'){
        var [dest, context] = this._getDestWithParams(result);
        this.scState.goto(dest, {context});
      }
    }
  }

  _registerEvent(eventName, eventValue){
    var type = typeof eventValue;
    var callback =
        (type === 'string')   ? this._event_transitionToState(eventValue)
      : (type === 'object')   ? this._event_transitionToStatesWithParams(eventValue)
      : (type === 'function') ? this._event_transitionToDynamicState(eventValue)
      : undefined;

    if(callback) this.scState.event(eventName, callback);
  }

  _setAttrValue(name, val){ this.stateChart.attrs[name] = val }

  _canEnter_checkParams(params){
    return !this.params || (params && this.params.every(p=>p in params));
  }

  _doEnter_setAttrs(context){
    Object.keys(this.attrs).forEach(a=>{
      var val = this.attrs[a];
      val = (typeof val === 'function') ? val(context) : val;

      if(!(val instanceof Promise))
        this._setAttrValue(a, (val instanceof attrValue ? val.val : val));
      else
        val.then(value=>{
          if(this.scState.__isCurrent__) this._setAttrValue(a, value);
        });
    });
  }

  _doEnter(context){
    this._doEnter_setAttrs(context);
    this.enter();
  }

  _doExit(){
    this.exit();
    Object.keys(this.attrs).forEach(a=>delete this.stateChart.attrs[a]);
  }
}
