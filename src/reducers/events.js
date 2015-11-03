import {ADD_EVENT} from '../actions/types.js';

const INIT_STATE = [
  {repo:{displayName:'yolo/molo'}}
]

export default (state=INIT_STATE, action)=>{
  switch(action.type){
  case ADD_EVENT:
    return [
      ...state,
      {repo:{displayName:`yolo/molo2${state.length}`}}
    ];
  }
  return state;
}
