import { combineReducers } from 'redux';
import userInfoReducer from './userReducer';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
});

export default rootReducer;
