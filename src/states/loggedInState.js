import {goto}      from '../helpers/svengali.js';
import load        from '../helpers/load.js';
import searchState from './searchState.js';
import sourceState from './sourceState.js';

export default {
  params:['user', 'accessTokens'],
  attrs:{
    'user':({user})=>user,
    'githubUsername':({user})=>user.githubUsername,
    'accessTokens':({accessTokens})=>{
      // TODO(pwong): Split out access tokens into a seperate module?
      load.accessToken = accessTokens.github;
      return accessTokens;
    }
  },
  parallelStates:{
    'appSearch':{
      states:{
        'off':{},
        'on':searchState
      },
      events:{
        'appSearchClose':goto('./off'),
        'appSearchOpen':goto('./on')
      }
    },
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
