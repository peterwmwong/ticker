import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import * as reducers from './reducers';

const store = window.store = applyMiddleware(thunk)(createStore)(combineReducers(reducers));
export default store;
