import {reenter}  from '../helpers/svengali.js';
import GithubUser from '../models/github/GithubUser.js';
import GithubRepo from '../models/github/GithubRepo.js';

export default {
  route:'/app-chrome.html',
  params:['sourceId'],
  attrs:{
    'sourceType':({sourceId})=>{
      const [, , repo] = sourceId.split('/');
      return repo ? 'GithubRepo' : 'GithubUser';
    },
    'source':({sourceId})=>{
      const [, user, repo] = sourceId.split('/');
      return repo ? GithubRepo.get(`${user}/${repo}`) : GithubUser.get(user);
    },
    'appView'(){ return `source-${this.sourceType}`; }
  },
  events:{
    'toggleFavoriteSource'(){
      throw 'not implemented yet';
      // const {user, source, isSourceFavorited} = this.attrs;
      // const index = user.sources.indexOf(source);
      // if(isSourceFavorited){
      //   if(index !== -1) user.sources.splice(index, 1);
      // }
      // else if(index === -1){
      //   user.sources.push(source);
      // }
      // user.save();
      // return reenter({source});
    }
  },

  defaultState(){ return this.attrs.sourceType; },
  states:{
    'GithubUser':{
      states:{
        'tab':{
          attrs:{
            'tab':({tab})=>tab || 'updates',
            'events'(){ return this.attrs.source.then(s=>s.queryEvents()); }
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
            'events'(){ return this.attrs.source.then(s=>s.queryEvents()); }
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
