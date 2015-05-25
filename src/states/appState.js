// import '../helpers/MOCK_FIREBASE.js';

import {StateChart, goto} from '../helpers/svengali.js';
import userState          from './userState.js';
import searchState        from './searchState.js';
import sourceState        from './sourceState.js';

const appState = new StateChart({
  route:'/',
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
      states:{
        'waitingForUser':{
          events:{
            'userReady':user=>{
              let initialSource = user.sources[0];
              if(initialSource){
                window.location.pathname = initialSource.tickerUrl;
              }
            }
          }
        },
        'source':sourceState
      }
    }
  }
});

appState.rootState.scState.trace = true;
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

if(IS_DEV){
  window.requestAnimationFrame(()=>{
    let s = document.createElement('script');
    s.src = `http://${(location.host || 'localhost').split(':')[0]}:35729/livereload.js?snipver=1`;
    document.body.appendChild(s);
  });
}
