// reducers/userInfoReducer.js
import { SET_USER_INFO, CLEAR_USER_INFO } from '../constants/user';

const initialState = {
  userInfo: null,
};

const userInfoReducer = (
  state = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case CLEAR_USER_INFO:
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
};

export default userInfoReducer;
