// import '../helpers/MOCK_FIREBASE.js';

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
            'favoritedSources':({user})=>user.sources
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
            'userReady':user=>goto('../source', {user})
          }
        },
        'source':sourceState
      }
    }
  }
});

//FIXME: Tests should be able to stop state bootstrapping... or something
// if(!('__karma__' in window)) appState.goto();
appState.rootState.scState.trace = true;
appState.goto();

class SyncState {
  constructor(mapping){
    this.mapping = mapping;
  }

  attached(){
    for(let key in this.mapping){
      this[key] = appState.attrs[key];
    }
    this._boundOnAppStateChange = this._boundOnAppStateChange || function(attrName, value){
      if(attrName in this.mapping){
        this[attrName] = appState.attrs[attrName];
      }
    }.bind(this);
    appState.onAttrChange(this._boundOnAppStateChange);
  }

  detached(){
    appState.offAttrChange(this._boundOnAppStateChange);
  }
}

window.SyncState = SyncState;
window.appState = appState;

export default appState;
