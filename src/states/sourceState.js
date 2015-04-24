import {reenter} from '../helpers/svengali.js';

export default {
  attrs:{
    'appView'(){ return `source-${this.attrs.source && this.attrs.source.constructor.name}`; },
    'isSourceFavorited'(){
      return this.attrs.user.sources && this.attrs.user.sources.indexOf(this.attrs.source) !== -1;
    },
    'source'({source:s}){ return s || this.attrs.user.sources && this.attrs.user.sources[0]; }
  },
  events:{
    'selectSource':source=>reenter({source}),
    'toggleFavoriteSource'(){
      let {user, source, isSourceFavorited} = this.attrs;
      if(isSourceFavorited){
        let index = user.sources.indexOf(source);
        if(index !== -1) user.sources.splice(index, 1);
      }
      else{
        if(user.sources.indexOf(source) === -1) user.sources.push(source);
      }
      user.$save();
      return reenter({source});
    }
  },

  defaultState(){ return this.attrs.source && this.attrs.source.constructor.name; },
  states:{
    'GithubUserSource':{
      states:{
        'tab':{
          attrs:{'tab':({tab})=>tab || 'updates'},
          events:{
            'tabChanged':tab=>{
              if(['updates', 'repos', 'info'].indexOf(tab) + 1){
                reenter({tab});
              }
            }
          }
        }
      }
    },
    'GithubRepoSource':{
      states:{
        'tab':{
          attrs:{'tab':({tab})=>tab || 'updates'},
          events:{
            'tabChanged':tab=>{
              if([
                'updates',
                'code',
                'pullRequests',
                'issues',
                'info'].indexOf(tab) + 1
              ){ reenter({tab}); }
            }
          }
        }
      }
    }
  }
};
