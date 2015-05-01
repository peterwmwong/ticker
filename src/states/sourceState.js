import {reenter}  from '../helpers/svengali.js';
import GithubUser from '../models/github/GithubUser.js';
import GithubRepo from '../models/github/GithubRepo.js';

export default {
  states:{
    'GithubUser':{
      route:'/github/:sourceUser',
      attrs:{
        'source':({sourceUser:u})=>GithubUser.get(u),
        'appView'(){ return `source-GithubUser`; }
      },
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
      route:'/github/:sourceUser/:sourceRepo',
      attrs:{
        'source':({sourceUser:u, sourceRepo:r})=>GithubRepo.get(`${u}/${r}`),
        'appView'(){ return `source-GithubRepo`; }
      },
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
