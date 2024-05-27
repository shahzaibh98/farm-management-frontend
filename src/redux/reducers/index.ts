import { combineReducers } from 'redux';
import userInfoReducer from './userReducer';
import referenceReducer from './referenceReducer';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  referenceData: referenceReducer,
});

export default rootReducer;
