import {goto, reenter}   from '../helpers/svengali';
import load              from '../helpers/load';
import sourceState       from './sourceState';
import searchState       from './searchState';
import githubCommitState from './githubCommitState';

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
        'selectSearch, selectSource':reenter({appDrawerOpened:false}),
        'toggleAppDrawer'(){
          return reenter({appDrawerOpened:!this.attrs.appDrawerOpened})
        },
        'appDrawerOpenedChanged':appDrawerOpened=>reenter({appDrawerOpened})
      }
    },
    'appView':{
      events:{
        'selectSource':source=>goto('./source', {source}),
        'selectSearch':goto('./search')
      },
      states:{
        'githubCommit':githubCommitState,
        'source':sourceState,
        'search':searchState
      }
    }
  }
};
