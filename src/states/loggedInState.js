import {goto}      from '../helpers/svengali.js';
import load        from '../helpers/load.js';
import searchState from './searchState.js';
import sourceState from './sourceState.js';

export default {
  params:['user', 'accessTokens'],
  attrs:{
    'isLoggedIn': true,
    'user':({user})=>user,
    'githubUsername':({user})=>user.githubUsername,
    'accessTokens':({accessTokens})=>{
      // TODO(pwong): Split out access tokens into a seperate module?
      load.accessToken = accessTokens.github;
      return accessTokens;
    }
  },
  parallelStates:{
    'appSearch': searchState,
    'appDrawer':{
      attrs:{
        'favoritedSources'(){ return this.attrs.user.sources; }
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
    }
  }
};
