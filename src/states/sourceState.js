import {reenter, goto}  from '../helpers/svengali.js';
import GithubEvent from '../models/github/GithubEvent.js';

export default {
  states:{
    'GithubUser':{
      route:'/github/:sourceUser',
      attrs:{
        'sourceName':({sourceUser})=>sourceUser,
        'appView':'source-GithubUser',
        'events':params=>GithubEvent.localQuery({type:'users', id:params.sourceUser})
      },
      events:{
        'gotoGithubUserSource':({sourceUser})=>reenter({sourceUser}),
        'gotoGithubRepoSource':({sourceUser, sourceRepo})=>
          goto('../GithubRepo', {sourceUser, sourceRepo})
      },
      states:{
        'loadRemoteEvents':{
          attrs:{
            'events':params=>new Promise(resolve=>{
              setTimeout(()=>{
                resolve(GithubEvent.query({type:'users', id:params.sourceUser}));
              }, 5000);
            })
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
      },
      events:{
        'gotoGithubRepoSource':({sourceUser, sourceRepo})=>
          reenter({sourceUser, sourceRepo}),
        'gotoGithubUserSource':({sourceUser})=>
          goto('../GithubUser', {sourceUser})
      }
    }
  }
};
