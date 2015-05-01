import {reenter}  from '../helpers/svengali.js';
import GithubEvent from '../models/github/GithubEvent.js';

export default {
  states:{
    'GithubUser':{
      route:'/github/:sourceUser',
      attrs:{
        'sourceName':({sourceUser})=>sourceUser,
        'appView':'source-GithubUser'
      },
      states:{
        'tab':{
          attrs:{
            'tab':({tab})=>tab || 'updates',
            'events':params=>GithubEvent.query({type:'users', id:params.sourceUser})
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
        'sourceName':({sourceUser, sourceRepo})=>`${sourceUser}/${sourceRepo}`,
        'appView':'source-GithubRepo'
      },
      states:{
        'tab':{
          attrs:{
            'tab':({tab})=>tab || 'updates',
            'events'(){
              return GithubEvent.query({type:'repos', id:this.attrs.sourceName});
            }
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
