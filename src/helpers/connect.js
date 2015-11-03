import store from '../store.js';

const passThrough = o=>o;

export default (selector=passThrough)=>{
  const getState = ()=>selector(store.getState());
  return {
    onInit: (props, state, {__onStoreUpdate})=>({
      ...getState(),
      __unsubscribeFromStore: store.subscribe(()=>__onStoreUpdate(getState()))
    }),
    onDeInit: (props, state, actions)=>state.__unsubscribeFromStore(),

    dispatch: (props, state, actions, reduxAction)=>{
      store.dispatch(reduxAction);
      return state;
    },

    __onStoreUpdate: (props, state, actions, newState)=>({
      ...newState,
      __unsubscribeFromStore: state.__unsubscribeFromStore
    })
  };
}
