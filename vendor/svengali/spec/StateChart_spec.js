import {StateChart, attrValue} from 'base/build/svengali';

describe('StateChart', ()=>{

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
          promiseVal: ()=> attrValue(promiseVal)
        }
      });

      stateChart.goto();

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

    it('initializer functions with `params`', ()=>{
      var stateChart = new StateChart({
        params: ['a','b','c'],
        attrs:{ one:(paramArgs)=>paramArgs }
      });
      var args = {a:1, b:2, c:3};

      stateChart.goto('.', args);
      expect(stateChart.attrs.one).toEqual(args);
    });

    it('initializer functions returning a Promise', (done)=>{
      var onResolve, offResolve;
      var stateChart = new StateChart({
        default: 'on',
        states:{
          'on':{
            attrs:{
              on_attr:()=>new Promise((resolve)=>onResolve = resolve)
            }
          },
          'off':{
            attrs:{
              off_attr:()=>new Promise((resolve)=>offResolve = resolve)
            }
          }
        }
      });

      stateChart.goto();
      expect(stateChart.attrs).toEqual({});

      Promise.resolve(onResolve('on resolved value'))
        .then(()=>{
          expect(stateChart.attrs).toEqual({
            on_attr: 'on resolved value'
          });

          stateChart.goto('off');
          offResolve('off resolved value');
        })
        .then(()=>{
          expect(stateChart.attrs).toEqual({
            off_attr: 'off resolved value'
          });
        })
        .then(done);
    });

    it('initializer functions returning a Promise (no effect if state changes)', (done)=>{
      var onResolve, offResolve;
      var stateChart = new StateChart({
        default: 'on',
        states:{
          'on':{
            attrs:{
              on_attr:()=>new Promise((resolve)=>onResolve = resolve)
            }
          },
          'off':{
            attrs:{
              off_attr:()=>new Promise((resolve)=>offResolve = resolve)
            }
          }
        }
      });

      stateChart.goto();
      expect(stateChart.attrs).toEqual({});
      stateChart.goto('off');

      Promise.resolve(onResolve('on resolved value'))
        .then(()=>{
          expect(stateChart.attrs).toEqual({});
          offResolve('off resolved value');
        })
        .then(()=>{
          expect(stateChart.attrs).toEqual({
            off_attr: 'off resolved value'
          });
        })
        .then(done);
    });

  });

  describe('params:', ()=>{
    var stateChart;

    beforeEach(()=>{
      stateChart = new StateChart({
        default: 'default',
        states:{
          'default':{
          },
          'withParams':{
            params: ['reqParam1','reqParam2'],
            attrs:{
              'withParamsAttr': true
            }
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
