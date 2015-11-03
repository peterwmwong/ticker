import {USER_LOADED} from '../actions/types';

export default function(state = null, action){
  switch(action.type){
  case USER_LOADED: return action.user;
  default: return state;
  }
}
