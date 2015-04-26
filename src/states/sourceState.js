import {reenter} from '../helpers/svengali.js';

export default {
  attrs:{
    'appView'(){
      return `source-${this.attrs.source && this.attrs.source.constructor.name}`;
    },
    'isSourceFavorited'(){
      const {user, source} = this.attrs;
      return user.sources && user.sources.indexOf(source) !== -1;
    },
    'source'({source:s}){
      return s || this.attrs.user.sources && this.attrs.user.sources[0];
    }
  },
  events:{
    'selectSource':source=>reenter({source}),
    'toggleFavoriteSource'(){
      const {user, source, isSourceFavorited} = this.attrs;
      const index = user.sources.indexOf(source);
      if(isSourceFavorited){
        if(index !== -1) user.sources.splice(index, 1);
      }
      else if(index === -1){
        user.sources.push(source);
      }
      user.save();
      return reenter({source});
    }
  },

  defaultState(){ return this.attrs.source && this.attrs.source.constructor.name; },
  states:{
    'GithubUser':{
      states:{
        'tab':{
          attrs:{
            'tab':({tab})=>tab || 'updates',
            'events'(){ return this.attrs.source.queryEvents(); }
          },
          events:{
            'tabChanged':tab=>
              (['updates', 'repos', 'info'].indexOf(tab) + 1) && reenter({tab})
          }
        }
      }
    },
    'GithubRepo':{
      states:{
        'tab':{
          attrs:{
            'tab':({tab})=>tab || 'updates',
            'events'(){ return this.attrs.source.queryEvents(); }
          },
          events:{
            'tabChanged':tab=>
              ([
                'updates',
                'code',
                'pullRequests',
                'issues',
                'info'].indexOf(tab) + 1
              ) && reenter({tab})
          }
        }
      }
    }
  }
};
