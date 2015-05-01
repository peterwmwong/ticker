import '../helpers/MOCK_FIREBASE.js';

import {StateChart, goto} from '../helpers/svengali.js';
import userState          from './userState.js';
import searchState        from './searchState.js';
import sourceState        from './sourceState.js';

const appState = new StateChart({
  parallelStates:{
    'userState':userState,
    'appSearch':searchState,
    'appDrawer':{
      states:{
        'waitingForUser':{
          events:{
            'userReady':user=>goto('../enabled', {user})
          }
        },
        'enabled':{
          params:['user'],
          attrs:{
            // TODO(pwong): implement
            // 'favoritedSources':({user})=>user.sources
          }
        }
      }
    },
    'appView':{
      events:{
        'selectSource':source=>goto('./source', {source})
      },
      states:{
        'waitingForUser':{
          events:{
            'userReady':user=>{
              let initialSource = user.sources[0];
              if(initialSource){
                return goto('../source', {sourceId:initialSource.id});
              }
            }
          }
        },
        'source':sourceState
      }
    }
  }
});

if(TICKER_CONFIG.statechartTrace){
  appState.rootState.scState.trace = true;
}
appState.start();


function onAttrChange(attrs, attrName, value){
  if(attrs.indexOf(attrName) !== -1){ this[attrName] = value; }
}

function syncState(attrs){
  return {
    attached(){
      this._onAttrChange = this._onAttrChange || onAttrChange.bind(this, attrs);
      attrs.forEach(key=>this[key] = appState.attrs[key]);
      appState.onAttrChange(this._onAttrChange);
    },
    detached(){ appState.offAttrChange(this._onAttrChange); }
  };
}

window.syncState = syncState;
window.appState = appState;

export default appState;
