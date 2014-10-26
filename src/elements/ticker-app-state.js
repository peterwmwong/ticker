import {StateChart} from '../helpers/svengali';
import User         from '../models/User';
import EventStream  from '../models/EventStream';

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

export default new StateChart({
  states: {
    'loggedIn':{
      attrs:{'user':MOCK_USER},
      concurrent: true,
      states:{
        'mainView':{
          states:{
            'stream':{
              attrs:{
                'mainView':'stream',
                'stream'({streamId}){
                  return streamId ? EventStream.get(streamId)
                                  : this.attrs.user.eventStreams[0]
                }
              }
            },
            'search':{
              attrs:{
                'mainView':'search',
                'isSearching':true
              },
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
});
