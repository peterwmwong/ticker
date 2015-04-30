/* global statechart */

const EMPTY_OBJ  = {};
let nextStateUID = 1;

/*
Public: An encapsulation of a state chart's attrs and behavior

Examples

  let s = new StateChart({
    attrs: ['root_attr'],
    enter(){ this.root_attr='root_attr value' },

    default: 'on',
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
            history:    - a Boolean, if true, makes a history state.
                          (default: false).

            params:     - an Array of parameters required to enter this state
                          (optional).

                          Example

                              let ARTICLES=[{title:'hello world'}]
                              let s = new StateChart({
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
                                  let nextState = undefined;
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

            states:         - an Object map defining sub-states (optional).

            parallelStates: - an Object map defining parallel sub-states
                              (optional). If specified, overrides `states`.
  */
  constructor(rootStateOptions){
    this._attrChangeListeners = [];
    this.events = [];
    this.attrs = {};
    this.rootState = new State(null, this, rootStateOptions);
  }

  goto(path='.', params={}){
    this.rootState.scState.goto(path, {context:params});
  }

  start(){
    this.rootState.scState.start();
  }

  fire(eventName, ...args){
    this.rootState.scState.send(eventName, ...args);
  }

  onAttrChange(listener){
    if(!this._attrChangeListeners.indexOf(listener) >= 0){
      this._attrChangeListeners.push(listener);
    }
  }

  offAttrChange(listener){
    let index = this._attrChangeListeners.indexOf(listener);
    if(index >= 0){
      this._attrChangeListeners.splice(index, 1);
    }
  }

  _notifyAttrChange(attrName, value){
    this._attrChangeListeners.forEach(l=>l(attrName, value));
  }

  _setAttr(attrName, value){
    this.attrs[attrName] = value;
    this._notifyAttrChange(attrName, value);
    return value;
  }
}

function Reenter(params){this.params = params; }
export function reenter(params){ return new Reenter(params); }

function Goto(path, params){
  this.path = path;
  this.params = params;
}
export function goto(path, params){ return new Goto(path, params); }

function AttrValue(val){ this.val = val; }
export function attrValue(val){ return new AttrValue(val); }

// Internal: Encapsulation of a State's attrs and behavior.  With helpers
//           for transitioning in an out of this state.
export class State {

  // Public: Creates a State
  //
  constructor(
    parent,
    stateChart,
    {attrs, enter, exit, events, history, parallelStates, params, states,
     defaultState, route},
    name=nextStateUID++
  ){
    this._attrs = attrs || EMPTY_OBJ;
    this._attrKeys = Object.keys(this._attrs);
    this._resolvedAttrValues = {};
    this.attrs = Object.create(
      (parent && parent.attrs || null),
      this._attrKeys.reduce((acc, attr)=>{
        acc[attr] = {
          get:()=>this._resolveAttrValue(attr)
        };
        return acc;
      }, {})
    );

    this.enter = enter;
    this.exit = exit;
    this.params = params;
    this.stateChart = stateChart;
    this.defaultState = defaultState;

    const scState = this.scState = new statechart.RoutableState(name, {
      name       : name,
      concurrent : !!parallelStates,
      history    : !!history
    });

    if(params){
      scState.canEnter = (destStates, enterParams)=>this._doCanEnter(enterParams);
    }

    if(defaultState){
      scState.C(enterParams=>this._doDefaultState(enterParams));
    }

    if(route){
      scState.route(route);
    }

    scState.enter(enterParams=>this._doEnter(enterParams));
    scState.exit(()=>this._doExit());

    if(events){
      Object.keys(events).forEach(eventName=>
        eventName.split(',').forEach(ename=>
          this._registerEvent(ename.trim(), events[eventName])
        )
      );
    }

    states = parallelStates || states;
    if(states){
      // Add the defaultState first, so the stateChart defaults to this state
      Object.keys(states).forEach(stateName=>
        scState.addSubstate(
          new State(this, stateChart, states[stateName], stateName).scState)
      );
    }
  }

  fire(eventName, ...args){ this.stateChart.fire(eventName, ...args); }

  get isCurrent(){ return this.scState.__isCurrent__; }

  _doDefaultState(params = {}){
    this._currentParams = params;
    return this.defaultState(params);
  }

  _doCanEnter(params){
    return !this.params || (params && this.params.every(p=>p in params));
  }

  _doEnter(params = {}){
    this._currentParams = params;
    this._resolvedAttrValues = {};
    this._attrKeys.forEach(a=>this._resolveAttrValue(a));
    if(this.enter) this.enter(params);
  }

  _doExit(){
    if(this.exit) this.exit();
    this._attrKeys.forEach(a=>{
      this.stateChart._setAttr(a, undefined);
      delete this.stateChart.attrs[a];
    });
  }

  _doReenter(reenterObj){
    this._doExit();
    this._doEnter(reenterObj.params);
  }

  _transitionToSameState(reenterObj){
    return this._doReenter.bind(this, reenterObj);
  }

  _transitionToState({path, params}){
    return ()=>this.scState.goto(path, {context:params});
  }

  _transitionToDynamicState(func){
    return (...args)=>{
      const result = func.apply(this, args);
      if(result instanceof Goto){
        this.scState.goto(result.path, {context:result.params || {}});
      }
      else if(result instanceof Reenter){
        this._doReenter(result);
      }
    };
  }

  _registerEvent(eventName, eventValue){
    const type = typeof eventValue;
    const callback =
        eventValue instanceof Goto    ? this._transitionToState(eventValue)
      : type === 'function'           ? this._transitionToDynamicState(eventValue)
      : eventValue instanceof Reenter ? this._transitionToSameState(eventValue)
      : undefined;

    if(callback){
      this.scState.event(eventName, callback);
      if(this.stateChart.events.indexOf(eventName) === -1){
        this.stateChart.events.push(eventName);
      }
    }
  }

  _resolveAttrValue(attrName){
    const params = this._currentParams;
    let result;

    if(attrName in this._resolvedAttrValues){
      result = this._resolvedAttrValues[attrName];
    }
    else{
      let val = this._attrs[attrName];
      val = typeof val === 'function' ? val.call(this, params) : val;

      if(!(val instanceof Promise)){
        result = this.stateChart._setAttr(attrName, val instanceof AttrValue ? val.val : val);
      }
      else{
        result = val.then(value=>{
          if(this.isCurrent) this.stateChart._setAttr(attrName, value);
          return value;
        });
      }
    }

    this._resolvedAttrValues[attrName] = result;
    return result;
  }

}
