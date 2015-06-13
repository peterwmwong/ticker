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
            'events':params=>GithubEvent.query({type:'users', id:params.sourceUser})
          }
        }
      }
    },
    'GithubRepo':{
      route:'/github/:sourceUser/:sourceRepo',
      attrs:{
        'sourceName':({sourceUser, sourceRepo})=>`${sourceUser}/${sourceRepo}`,
        'appView':'source-GithubRepo',
        'events'(params){
          return GithubEvent.localQuery({type:'repos', id:this.attrs.sourceName});
        }
      },
      events:{
        'gotoGithubUserSource':({sourceUser})=>goto('../GithubUser', {sourceUser}),
        'gotoGithubRepoSource':({sourceUser, sourceRepo})=>
          reenter({sourceUser, sourceRepo})
      },
      states:{
        'loadRemoteEvents':{
          attrs:{
            'events'(params){
              return GithubEvent.query({type:'repos', id:this.attrs.sourceName});
            }
          }
        }
      }
    }
  }
};
