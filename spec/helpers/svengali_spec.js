import {StateChart, attrValue, goto, reenter} from 'base/build/helpers/svengali';

describe('svengali/StateChart', ()=>{

  describe('@events', ()=>{
    it('list of all events', ()=>{
      var sc = new StateChart({
        parallelStates:{
          'one':{
            events:{'a':goto('../two')}
          },
          'two':{
            events:{'b':goto('../one')},
            parallelStates:{
              'three':{
                events:{'c':goto('../../one')}
              },
              'four':{
                events:{'d':goto('../../one')}
              }
            }
          }
        }
      });

      expect(sc.events).toEqual(['a','b','c','d']);
    });
  });

  describe('parallelStates:', ()=>{
    it('states are all entered', ()=>{
      var sc = new StateChart({
        parallelStates:{
          'one':{
            attrs:{'oneAttr':1}
          },
          'two':{
            attrs:{'twoAttr':2}
          }
        }
      })
      sc.goto();

      expect(sc.attrs).toEqual({
        oneAttr: 1,
        twoAttr: 2
      });
    });
  });

  describe('enter:', ()=>{
    it('called when state is entered', ()=>{
      var rootCalls = [];
      var child1Calls = [];
      var child2Calls = [];

      var sc = new StateChart({
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
      sc.goto('.', {a:1, b:2, c:3});

      expect(rootCalls).toEqual([1]);
      expect(child1Calls).toEqual([2]);
      expect(child2Calls).toEqual([]);

      sc.goto('child2', {a:777, b:777, c:4});

      expect(rootCalls).toEqual([1]);
      expect(child1Calls).toEqual([2]);
      expect(child2Calls).toEqual([4]);
    });
  });

  describe('attrs:', ()=>{
    it('simple values', ()=>{
      var sc = new StateChart({
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
      sc.goto();

      expect(sc.attrs).toEqual({
        root_attr : 'root value',
        numZero   : 0,
        numOne    : 1,
        string    : 'a string',
        array     : [1,2,3],
        object    : {a:1, b:2, c:3}
      });

       sc.goto('off');
       expect(sc.attrs).toEqual({
         root_attr : 'root value',
         off_attr  : 'off value'
       });

       sc.goto('./on');
       expect(sc.attrs).toEqual({
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
      var sc = new StateChart({
        attrs:{
          funcVal: attrValue(funcVal),
          promiseVal: ()=>attrValue(promiseVal)
        }
      });
      sc.goto();

      expect(sc.attrs.funcVal).toBe(funcVal);
      expect(sc.attrs.promiseVal).toBe(promiseVal);
    })

    it('initializer functions', ()=>{
      var id = 0;
      var sc = new StateChart({
        states:{
          'on':{
            attrs:{ on_attr:()=>`on: ${id++}` }
          },
          'off':{
            attrs:{
              off_attr:params=>`off: ${id++}`,
              off_params:params=>params
            }
          }
        }
      });
      sc.goto();

      expect(sc.attrs).toEqual({
        on_attr: 'on: 0'
      });

       sc.goto('off');
       expect(sc.attrs).toEqual({
         off_attr: 'off: 1',
         off_params: {}
       })

       sc.goto('./on');
       expect(sc.attrs).toEqual({
         on_attr: 'on: 2'
       });
    });


    it('initializer functions depending on other attrs', async (done)=>{
      var id = 0;
      var resolveAsyncName;
      var sc = new StateChart({
        states:{
          'parent':{
            attrs:{'time':777},
            states:{
              'child':{
                attrs:{
                  'greeting'(){return `Hello ${this.attrs.name}! time: ${this.attrs.time}`},
                  'asyncName':new Promise(resolve=>resolveAsyncName=resolve),
                  async 'asyncGreeting'(){return `Async Hello ${await this.attrs.asyncName}!`},
                  'name':({lname})=>`Grace ${lname}`
                }
              }
            }
          }
        }
      });
      sc.goto('.', {lname:'Moo'});

      expect(sc.attrs).toEqual({
        time: 777,
        name: 'Grace Moo',
        greeting: 'Hello Grace Moo! time: 777'
      });

      resolveAsyncName('Peter');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();

      expect(sc.attrs).toEqual({
        time: 777,
        name: 'Grace Moo',
        greeting: 'Hello Grace Moo! time: 777',
        asyncName: 'Peter',
        asyncGreeting: 'Async Hello Peter!'
      });
      done();
    });

    it('initializer functions with `params`', ()=>{
      var sc = new StateChart({
        params: ['a','b','c'],
        attrs:{ one:paramArgs=>paramArgs }
      });
      var args = {a:1, b:2, c:3};

      sc.goto('.', args);
      expect(sc.attrs.one).toEqual(args);
    });

    it('initializer functions returning a Promise', async (done)=>{
      var onResolve, offResolve;
      var sc = new StateChart({
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
      sc.goto();

      expect(sc.attrs).toEqual({});

      onResolve('on resolved value');
      await Promise.resolve();

      expect(sc.attrs).toEqual({
        on_attr: 'on resolved value'
      });

      sc.goto('off');
      offResolve('off resolved value');
      await Promise.resolve();

      expect(sc.attrs).toEqual({
        off_attr: 'off resolved value'
      });

      done();
    });

    it('initializer functions depending on another `attr`', async (done)=>{
      var beforeResolve, laterResolve;
      var sc = new StateChart({
        attrs:{'beforeAttr':()=>new Promise(resolve=>beforeResolve=resolve)},
        states:{
          'one':{
            attrs:{
              laterAttr:()=>new Promise(resolve=>laterResolve=resolve),
              async nowAttr(){
                return `${await this.attrs.beforeAttr}, now and ${await this.attrs.laterAttr}`;
              }
            }
          }
        }
      });
      sc.goto();

      expect(sc.attrs).toEqual({});

      beforeResolve('before');
      laterResolve('later');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(sc.attrs).toEqual({
        beforeAttr: 'before',
        laterAttr: 'later',
        nowAttr: 'before, now and later'
      });

      done();
    });

    it('initializer functions are only called once per transition', ()=>{
      var num = 0;
      var sc = new StateChart({
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
      sc.goto();

      expect(sc.attrs).toEqual({
        num: 1,
        message1: 'msg1: 1',
        message2: 'msg2: 1'
      });

      sc.goto('two');
      expect(sc.attrs).toEqual({});

      sc.goto('one');
      expect(sc.attrs).toEqual({
        num: 2,
        message1: 'msg1: 2',
        message2: 'msg2: 2'
      });
    });

    it('initializer functions returning a Promise (no effect if state changes)', async (done)=>{
      var onResolve, offResolve;
      var sc = new StateChart({
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
      sc.goto();

      expect(sc.attrs).toEqual({});
      sc.goto('off');

      onResolve('on resolved value');
      await Promise.resolve();

      expect(sc.attrs).toEqual({});
      offResolve('off resolved value');

      await Promise.resolve();
      expect(sc.attrs).toEqual({
        off_attr: 'off resolved value'
      });

      done();
    });
  });

  describe('events:', ()=>{
    var sc, eventHandlerCalled, enterCount, exitCount;

    beforeEach(()=>{
      eventHandlerCalled = false;
      enterCount = exitCount = 0;

      sc = new StateChart({
        states:{
          'one':{
            attrs:{curState:({num1, num2})=>`one${num1 || ''}${num2 || ''}`},
            enter(){++enterCount},
            exit(){++exitCount},
            events:{
              'simpleTransition':goto('../two'),
              'transitionWithParams':goto('../three', {threeParam:3}),
              'transitionWithDynamicParams':(num1, num2)=>goto('../four', {fourParam:num1+num2}),
              'transitionToDynamicState':()=>goto('../five'),
              'transitionToDynamicStateWithParams':(num1, num2)=>goto('../six', {sixParam:num1+num2}),
              'eventHandler':()=>eventHandlerCalled=true,
              'reentry':reenter({num1:10, num2:20}),
              'reentryDynamicParams':(num1, num2)=>reenter({num1, num2}),
              'firstEvent, secondEvent':goto('../seven')
            }
          },
          'two'   :{attrs:{curState:'two'} },
          'three' :{attrs:{threeParams:params=>params}},
          'four'  :{attrs:{fourParams:params=>params}},
          'five'  :{attrs:{curState:'five'}},
          'six'   :{attrs:{sixParams:params=>params}},
          'seven' :{attrs:{curState:'seven'}}
        }
      });

      sc.goto('one');
    });

    it('transitions to a new state ',()=>{
      sc.fire('simpleTransition');
      expect(exitCount).toBe(1);
      expect(sc.attrs.curState).toBe('two');
    });

    it('transitions to a new state with params (predefined)',()=>{
      sc.fire('transitionWithParams');
      expect(exitCount).toBe(1);
      expect(sc.attrs.threeParams).toEqual({threeParam:3});
    });

    it('transitions to a new state with params (dynamic)',()=>{
      sc.fire('transitionWithDynamicParams', 1, 3);
      expect(exitCount).toBe(1);
      expect(sc.attrs.fourParams).toEqual({fourParam:4});
    });

    it('transitions to a dynamically determined state',()=>{
      sc.fire('transitionToDynamicState');
      expect(exitCount).toBe(1);
      expect(sc.attrs.curState).toEqual('five');
    });

    it('transitions to a dynamically determined state with params',()=>{
      sc.fire('transitionToDynamicStateWithParams', 2, 4);
      expect(exitCount).toBe(1);
      expect(sc.attrs.sixParams).toEqual({sixParam:6});
    });

    it('event handler',()=>{
      expect(eventHandlerCalled).toBe(false);

      sc.fire('eventHandler');
      expect(exitCount).toBe(0);
      expect(eventHandlerCalled).toBe(true);
      expect(sc.attrs.curState).toBe('one');
    });

    it('re-enters with params',()=>{
      expect(enterCount).toBe(1);

      sc.fire('reentry');
      expect(exitCount).toBe(1);
      expect(sc.attrs.curState).toBe('one1020');
      expect(enterCount).toBe(2);
    });

    it('re-enters with dynamic params',()=>{
      expect(enterCount).toBe(1);

      sc.fire('reentryDynamicParams', 77, 88);
      expect(exitCount).toBe(1);
      expect(sc.attrs.curState).toBe('one7788');
      expect(enterCount).toBe(2);
    });

    it('multiple events with the same outcome specified as a comma delimited list', ()=>{
      expect(sc.attrs.curState).toBe('one');

      sc.fire('firstEvent');
      expect(sc.attrs.curState).toBe('seven');

      sc.goto('./one');
      expect(sc.attrs.curState).toBe('one');

      sc.fire('secondEvent');
      expect(sc.attrs.curState).toBe('seven');
    });
  });

  describe('params:', ()=>{
    var sc;

    beforeEach(()=>{
      sc = new StateChart({
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
      sc.goto('withParams');
      expect(sc.attrs).toEqual({});

      sc.goto('withParams', {reqParam1:1});
      expect(sc.attrs).toEqual({});

      sc.goto('withParams', {reqParam2:2});
      expect(sc.attrs).toEqual({});
    });

    it('allows transition when all params are supplied', ()=>{
      sc.goto('withParams', {reqParam1:1, reqParam2:2});
      expect(sc.attrs).toEqual({withParamsAttr:true});
    });
  })
});
