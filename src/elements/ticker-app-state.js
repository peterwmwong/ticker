import User from '../models/User';
import EventStream from '../models/EventStream';
debugger;

// !!! <MOCKDATA> !!!
  var MOCK_USER = new User({
    id:12345,
    eventStreams: [
      EventStream.load({
        id: '1',
        type: 'github',
        config: {
          type: 'repos',
          repos: 'peterwmwong/ticker'
        }
      }),
      EventStream.load({
        id: '2',
        type: 'github',
        config: {
          type: 'repos',
          repos: 'polymer/polymer'
        }
      })
    ]
  });
// !!! </MOCKDATA> !!!


export default {
  states: {
    'loggedIn':{
      attrs:{'user':MOCK_USER},
      statesConcurrent:{
        'mainView':{
          states:{
            'stream':{
              params:['streamId'],
              attrs:{'stream':({streamId})=>Streams.get(streamId)}
            },

            'search':{
              attrs:{'isSearching':true},
              events:{
                'selectStream':{'../streams/show':streamId=>({streamId})}
              }
            }
          }
        },
        'drawerView':{
          states:{
            'expanded':{
              attrs:{'isDrawerExpanded':true},
              events:{
                'selectStream':{'../../mainView/streams/show':streamId=>({streamId})},
                'selectSearch':'../../mainView/search'
              }
            },
            'collapsed':{}
          }
        }
      }
    },
    'loggedOut':{
      states:{
        'attemptingLogin':{},
        'waitingForLogin':{}
      }
    }
  }
};
