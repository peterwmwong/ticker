import {APP_SETVIEW} from '../actions/types';

export const VIEWS = {
  login: 'login',
  repo:  'repo',
  user:  'user'
}

const INIT_STATE = {
  view: VIEWS.login
}

export default function(state=INIT_STATE, {type, view, viewData}){
  switch(type){
  case APP_SETVIEW: return {view, viewData};
  default: return state;
  }
}
