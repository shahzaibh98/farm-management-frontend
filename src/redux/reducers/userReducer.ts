// reducers/userInfoReducer.js
import {
  CLEAR_USER_INFO,
  REFRESH_ACCESS_TOKEN,
  SET_USER_INFO,
} from '../constants/user';

const initialState = {
  userInfo: sessionStorage.getItem('userInfo') || null,
  isAuthenticated: sessionStorage.getItem('userInfo') ? true : false,
  token: sessionStorage.getItem('token') || null,
  refreshToken: sessionStorage.getItem('refreshToken') || null,
};

const userInfoReducer = (
  state = initialState,
  action: {
    type: any;
    payload: any;
  }
) => {
  switch (action.type) {
    case SET_USER_INFO:
      if (action.payload) {
        // If payload exists, set user info and tokens
        sessionStorage.setItem('token', action.payload.token);
        sessionStorage.setItem('refreshToken', action.payload.refreshToken);
        sessionStorage.setItem('userInfo', action.payload.user);
        return {
          ...state,
          userInfo: action.payload.userInfo,
          isAuthenticated: true,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        };
      } else {
        // If payload is null, clear user info and tokens
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userInfo');
        return {
          ...state,
          userInfo: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
        };
      }
    case CLEAR_USER_INFO:
      // Clear user info and tokens
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userInfo');
      return {
        ...state,
        userInfo: null,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
      };

    case REFRESH_ACCESS_TOKEN:
      // Handle refreshing access token
      sessionStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export default userInfoReducer;
