import {goto, reenter} from '../helpers/svengali';
import load            from '../helpers/load';

export default {
  params:['user', 'accessTokens'],
  attrs:{
    'user':({user})=>user,
    'accessTokens':({accessTokens})=>{
      // TODO(pwong): Split out access tokens into a seperate module?
      load.accessToken = accessTokens.github;
      return accessTokens;
    }
  },
  parallelStates:{
    'appDrawer':{
      attrs:{'appDrawerOpened':({appDrawerOpened})=>!!appDrawerOpened},
      events:{
        'selectSearch, selectStream':reenter({appDrawerOpened:false}),
        'toggleAppDrawer'(){
          return reenter({appDrawerOpened:!this.attrs.appDrawerOpened})
        }
      }
    },
    'appView':{
      states:{
        'stream':{
          attrs:{
            'isStreamFavorited'(){
              return this.attrs.user.eventStreams.indexOf(this.attrs.stream) !== -1;
            },
            'mainView':'stream',
            'stream'({stream}){return stream || this.attrs.user.eventStreams[0]},
            'streamEvents'(){return this.attrs.stream.events().$promise}
          },
          events:{
            'selectSearch':goto('../search'),
            'selectStream':stream=>reenter({stream}),
            'toggleFavoriteStream'(){
              var user = this.attrs.user;
              var stream = this.attrs.stream;
              user[`${this.attrs.isStreamFavorited ? 'remove' : 'add'}EventStreams`](stream)
              user.$save();
              return reenter({stream});
            }
          }
        },
        'search':{
          attrs:{'mainView':'search'},
          events:{
            'selectStream':(stream)=>goto('../stream', {stream})
          }
        }
      }
    }
  }
};
