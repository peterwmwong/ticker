import {StateChart, attrValue} from 'base/build/helpers/svengali';

describe('svengali/StateChart', ()=>{

  describe('attrs:', ()=>{
    it('simple values', ()=>{
      var stateChart = new StateChart({
        attrs:{ root_attr:'root value' },

        default: 'on',
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

      expect(stateChart.attrs.funcVal).toBe(funcVal);
      expect(stateChart.attrs.promiseVal).toBe(promiseVal);
    })

    it('initializer functions', ()=>{
      var id = 0;
      var stateChart = new StateChart({
        default: 'on',
        states:{
          'on':{
            attrs:{ on_attr:()=>`on: ${id++}` }
          },
          'off':{
            attrs:{ off_attr:()=>`off: ${id++}` }
          }
        }
      });

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
        default: 'on',
        states:{
          'on':{
            attrs:{
              'name':'Grace',
              'greeting'(){return `Hello ${this.attrs.name}!`},
              'asyncName':new Promise(resolve=>resolveAsyncName=resolve),
              'asyncGreeting'(){return this.attrs.asyncName.then(name=>`Async Hello ${name}!`)}
            }
          }
        }
      });

      expect(stateChart.attrs).toEqual({
        name: 'Grace',
        greeting: 'Hello Grace!'
      });

      resolveAsyncName('Peter');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        name: 'Grace',
        greeting: 'Hello Grace!',
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
        default: 'on',
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
      var laterResolve;
      var stateChart = new StateChart({
        states:{
          'one':{
            attrs:{
              later_attr:()=>new Promise(resolve=>laterResolve=resolve),
              now_attr(){return this.attrs.later_attr.then(later=>`now and ${later}`)}
            }
          }
        }
      });

      expect(stateChart.attrs).toEqual({});

      laterResolve('later');
      await Promise.resolve();

      // TODO(pwong): Figure out why this is needed for Chrome
      await Promise.resolve();
      await Promise.resolve();

      expect(stateChart.attrs).toEqual({
        later_attr: 'later',
        now_attr: 'now and later'
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
        default: 'on',
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
            attrs:{curState:'one'},
            events:{
              'simpleTransition':'../two',
              'transitionWithParams':{'../three':{threeParam:3}},
              'transitionWithDynamicParams':{'../four':()=>({fourParam:4})},
              'transitionToDynamicState':()=>'../five',
              'transitionToDynamicStateWithParams':()=>({'../six':{sixParam:6}}),
              'eventHandler':()=>eventHandlerCalled=true
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
      stateChart.fire('transitionWithDynamicParams');
      expect(stateChart.attrs.fourParams).toEqual({fourParam:4});
    });

    it('transitions to a dynamically determined state',()=>{
      stateChart.fire('transitionToDynamicState');
      expect(stateChart.attrs.curState).toEqual('five');
    });

    it('transitions to a dynamically determined state with params',()=>{
      stateChart.fire('transitionToDynamicStateWithParams');
      expect(stateChart.attrs.sixParams).toEqual({sixParam:6});
    });

    it('event handler',()=>{
      expect(eventHandlerCalled).toBe(false);
      stateChart.fire('eventHandler');
      expect(eventHandlerCalled).toBe(true);
      expect(stateChart.attrs.curState).toBe('one');
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

  // describe('Login', ()=>{
  //   var stateChart;
  //
  //   beforeEach(()=>{
  //     new Router([
  //       path('/', redirectTo('loggedIn/streams')),
  //       path('streams', 'loggedIn/streams/index', [
  //         path(':streamId', 'loggedIn/streams/show')
  //       ]),
  //       path('login', 'loggedOut')
  //     ]);
  //
  //     stateChart = new StateChart({
  //       attrs:{
  //         user:()=>User.currentUser().catch(err=>this.fire('logOut'))
  //       },
  //
  //       events:{
  //         'logOut': 'loggedOut'
  //       },
  //
  //       states:{
  //         'loggedIn':{
  //           attrs:{
  //             'user':()=>new FirebaseSimpleLogin(new Firebase(this.location), (error, fbUser)=>{
  //               if(!error) resolve(User.get(fbUser.id).$promise);
  //               else reject();
  //             }).login('github', {rememberMe:true})
  //           },
  //           states:concurrent({
  //             'main':{
  //               states:{
  //                 'streams':{
  //                   states:{
  //                     'index':{
  //                       attrs:{
  //                         'streams':()=>this.user
  //                       }
  //                     },
  //                     'show':{
  //                       params: ['streamId'],
  //                       attrs:{
  //                         'stream':({streamId})=>Streams.get(streamId)
  //                       }
  //                     }
  //                   }
  //                 },
  //
  //                 'streamSearch':{
  //                   events:{
  //                     'streamSelected': goto('../streams/show', (streamId)=>({streamId}))
  //                   }
  //                 }
  //               }
  //             },
  //             'drawer':{
  //               states:{
  //                 'expanded':{},
  //                 'collapsed':{},
  //               }
  //             }
  //           })
  //         },
  //
  //         'loggedOut':{
  //           events:{
  //             'login': goto('../loggedIn', ({user,pass})=>{user,pass})
  //             }
  //           }
  //         }
  //       }
  //     });
  //   });
  // });
});
