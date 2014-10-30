import {StateChart, attrValue, goto, reenter} from 'base/build/helpers/svengali';

describe('svengali/StateChart', ()=>{

  describe('enter:', ()=>{
    it('called when state is entered', ()=>{
      var rootCalls = [];
      var child1Calls = [];
      var child2Calls = [];

      var stateChart = new StateChart({
        enter({a}){rootCalls.push(a)},
        states:{
          'child1':{
            enter({b}){child1Calls.push(b)}
          },
          'child2':{
            enter({c}){child2Calls.push(c)}
          }
        }
      });
      stateChart.goto('.', {a:1, b:2, c:3});

      expect(rootCalls).toEqual([1]);
      expect(child1Calls).toEqual([2]);
      expect(child2Calls).toEqual([]);

      stateChart.goto('child2', {a:777, b:777, c:4});

      expect(rootCalls).toEqual([1]);
      expect(child1Calls).toEqual([2]);
      expect(child2Calls).toEqual([4]);
    });
  });

  describe('attrs:', ()=>{
    it('simple values', ()=>{
      var stateChart = new StateChart({
        attrs:{ root_attr:'root value' },
        states:{
          'on':{
            attrs:{
              numZero : 0,
              numOne  : 1,
              string  : 'a string',
              array   : [1,2,3],
              object  : {a:1, b:2, c:3}
            }
          },
          'off':{
            attrs:{ off_attr:'off value' }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({
        root_attr : 'root value',
        numZero   : 0,
        numOne    : 1,
        string    : 'a string',
        array     : [1,2,3],
        object    : {a:1, b:2, c:3}
      });

       stateChart.goto('off');
       expect(stateChart.attrs).toEqual({
         root_attr : 'root value',
         off_attr  : 'off value'
       });

       stateChart.goto('./on');
       expect(stateChart.attrs).toEqual({
         root_attr : 'root value',
         numZero   : 0,
         numOne    : 1,
         string    : 'a string',
         array     : [1,2,3],
         object    : {a:1, b:2, c:3}
       });
    });

    it('Promise and function values', ()=>{
      var funcVal = ()=>{};
      var promiseVal = Promise.resolve(5);
      var stateChart = new StateChart({
        attrs:{
          funcVal: attrValue(funcVal),
          promiseVal: ()=>attrValue(promiseVal)
        }
      });
      stateChart.goto();

      expect(stateChart.attrs.funcVal).toBe(funcVal);
      expect(stateChart.attrs.promiseVal).toBe(promiseVal);
    })

    it('initializer functions', ()=>{
      var id = 0;
      var stateChart = new StateChart({
        states:{
          'on':{
            attrs:{ on_attr:()=>`on: ${id++}` }
          },
          'off':{
            attrs:{ off_attr:()=>`off: ${id++}` }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({
        on_attr: 'on: 0'
      });

       stateChart.goto('off');
       expect(stateChart.attrs).toEqual({
         off_attr: 'off: 1'
       });

       stateChart.goto('./on');
       expect(stateChart.attrs).toEqual({
         on_attr: 'on: 2'
       });
    });


    it('initializer functions depending on other attrs', async (done)=>{
      var id = 0;
      var resolveAsyncName;
      var stateChart = new StateChart({
        states:{
          'parent':{
            attrs:{'time':777},
            states:{
              'child':{
                attrs:{
                  'name':'Grace',
                  'greeting'(){return `Hello ${this.attrs.name}! time: ${this.attrs.time}`},
                  'asyncName':new Promise(resolve=>resolveAsyncName=resolve),
                  'asyncGreeting'(){return this.attrs.asyncName.then(name=>`Async Hello ${name}!`)}
                }
              }
            }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({
        time: 777,
        name: 'Grace',
        greeting: 'Hello Grace! time: 777'
      });

      resolveAsyncName('Peter');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        time: 777,
        name: 'Grace',
        greeting: 'Hello Grace! time: 777',
        asyncName: 'Peter',
        asyncGreeting: 'Async Hello Peter!'
      });
      done();
    });

    it('initializer functions with `params`', ()=>{
      var stateChart = new StateChart({
        params: ['a','b','c'],
        attrs:{ one:paramArgs=>paramArgs }
      });
      var args = {a:1, b:2, c:3};

      stateChart.goto('.', args);
      expect(stateChart.attrs.one).toEqual(args);
    });

    it('initializer functions returning a Promise', async (done)=>{
      var onResolve, offResolve;
      var stateChart = new StateChart({
        states:{
          'on':{
            attrs:{
              on_attr:()=>new Promise(resolve=>onResolve=resolve)
            }
          },
          'off':{
            attrs:{
              off_attr:()=>new Promise(resolve=>offResolve=resolve)
            }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({});

      onResolve('on resolved value');
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        on_attr: 'on resolved value'
      });

      stateChart.goto('off');
      offResolve('off resolved value');
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        off_attr: 'off resolved value'
      });

      done();
    });

    it('initializer functions depending on another `attr`', async (done)=>{
      var beforeResolve, laterResolve;
      var stateChart = new StateChart({
        states:{
          'parent':{
            attrs:{'beforeAttr':()=>new Promise(resolve=>beforeResolve=resolve)},
            states:{
              'one':{
                attrs:{
                  laterAttr:()=>new Promise(resolve=>laterResolve=resolve),
                  nowAttr(){
                    return Promise.all([
                      this.attrs.beforeAttr,
                      this.attrs.laterAttr
                    ]).then(([before,later])=>`${before}, now and ${later}`)
                  }
                }
              }
            }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({});

      beforeResolve('before');
      laterResolve('later');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        beforeAttr: 'before',
        laterAttr: 'later',
        nowAttr: 'before, now and later'
      });

      done();
    });

    it('initializer functions are only called once per transition', ()=>{
      var num = 0;
      var stateChart = new StateChart({
        states:{
          'one':{
            attrs:{
              num:()=>++num,
              message1(){return `msg1: ${this.attrs.num}`},
              message2(){return `msg2: ${this.attrs.num}`}
            }
          },
          'two':{}
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({
        num: 1,
        message1: 'msg1: 1',
        message2: 'msg2: 1'
      });

      stateChart.goto('two');
      expect(stateChart.attrs).toEqual({});

      stateChart.goto('one');
      expect(stateChart.attrs).toEqual({
        num: 2,
        message1: 'msg1: 2',
        message2: 'msg2: 2'
      });
    });

    it('initializer functions returning a Promise (no effect if state changes)', async (done)=>{
      var onResolve, offResolve;
      var stateChart = new StateChart({
        states:{
          'on':{
            attrs:{
              on_attr:()=>new Promise(resolve=>onResolve=resolve)
            }
          },
          'off':{
            attrs:{
              off_attr:()=>new Promise(resolve=>offResolve=resolve)
            }
          }
        }
      });
      stateChart.goto();

      expect(stateChart.attrs).toEqual({});
      stateChart.goto('off');

      onResolve('on resolved value');
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({});
      offResolve('off resolved value');

      await Promise.resolve();
      expect(stateChart.attrs).toEqual({
        off_attr: 'off resolved value'
      });

      done();
    });
  });

  describe('events:', ()=>{
    var stateChart, eventHandlerCalled;

    beforeEach(()=>{
      eventHandlerCalled = false;

      stateChart = new StateChart({
        states:{
          'one':{
            attrs:{curState:({num1, num2})=>`one${num1 || ''}${num2 || ''}`},
            events:{
              'simpleTransition':goto('../two'),
              'transitionWithParams':goto('../three', {threeParam:3}),
              'transitionWithDynamicParams':(num1, num2)=>goto('../four', {fourParam:num1+num2}),
              'transitionToDynamicState':()=>goto('../five'),
              'transitionToDynamicStateWithParams':(num1, num2)=>goto('../six', {sixParam:num1+num2}),
              'eventHandler':()=>eventHandlerCalled=true,
              'reentry':reenter({num1:10, num2:20}),
              'reentryDynamicParams':(num1, num2)=>reenter({num1, num2})
            }
          },
          'two'   :{attrs:{curState:'two'} },
          'three' :{attrs:{threeParams:params=>params}},
          'four'  :{attrs:{fourParams:params=>params}},
          'five'  :{attrs:{curState:'five'}},
          'six'   :{attrs:{sixParams:params=>params}}
        }
      });

      stateChart.goto('one');
    });

    it('transitions to a new state ',()=>{
      stateChart.fire('simpleTransition');
      expect(stateChart.attrs.curState).toBe('two');
    });

    it('transitions to a new state with params (predefined)',()=>{
      stateChart.fire('transitionWithParams');
      expect(stateChart.attrs.threeParams).toEqual({threeParam:3});
    });

    it('transitions to a new state with params (dynamic)',()=>{
      stateChart.fire('transitionWithDynamicParams', 1, 3);
      expect(stateChart.attrs.fourParams).toEqual({fourParam:4});
    });

    it('transitions to a dynamically determined state',()=>{
      stateChart.fire('transitionToDynamicState');
      expect(stateChart.attrs.curState).toEqual('five');
    });

    it('transitions to a dynamically determined state with params',()=>{
      stateChart.fire('transitionToDynamicStateWithParams', 2, 4);
      expect(stateChart.attrs.sixParams).toEqual({sixParam:6});
    });

    it('event handler',()=>{
      expect(eventHandlerCalled).toBe(false);
      stateChart.fire('eventHandler');
      expect(eventHandlerCalled).toBe(true);
      expect(stateChart.attrs.curState).toBe('one');
    });

    it('re-enter with params',()=>{
      stateChart.fire('reentry');
      expect(stateChart.attrs.curState).toBe('one1020');
    });

    it('re-enter with dynamic params',()=>{
      stateChart.fire('reentryDynamicParams', 77, 88);
      expect(stateChart.attrs.curState).toBe('one7788');
    });
  });

  describe('params:', ()=>{
    var stateChart;

    beforeEach(()=>{
      stateChart = new StateChart({
        states:{
          'default':{},
          'withParams':{
            params:['reqParam1', 'reqParam2'],
            attrs:{'withParamsAttr':true}
          }
        }
      });
    });

    it('block transition when not all params are supplied', ()=>{
      stateChart.goto('withParams');
      expect(stateChart.attrs).toEqual({});

      stateChart.goto('withParams', {reqParam1:1});
      expect(stateChart.attrs).toEqual({});

      stateChart.goto('withParams', {reqParam2:2});
      expect(stateChart.attrs).toEqual({});
    });

    it('allows transition when all params are supplied', ()=>{
      stateChart.goto('withParams', {reqParam1:1, reqParam2:2});
      expect(stateChart.attrs).toEqual({withParamsAttr:true});
    });
  })
});
