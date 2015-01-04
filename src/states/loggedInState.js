import {goto, reenter}   from '../helpers/svengali.js';
import load              from '../helpers/load.js';
import githubCommitState from './githubCommitState.js';
import sourceState       from './sourceState.js';
import searchState       from './searchState.js';

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
        'source':sourceState,
        'search':searchState
      }
    },
    'appOverlayView':{
      events:{
        'selectAppOverlayGithubCommit':({url})=>goto('githubCommit',{githubCommitURL:url}),
        'hideAppOverlay':goto('off')
      },
      states:{
        'off':{},
        'githubCommit':githubCommitState
      }
    }
  }
};
