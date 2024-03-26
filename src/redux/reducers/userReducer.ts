// reducers/userInfoReducer.js
import {
  CLEAR_USER_INFO,
  REFRESH_ACCESS_TOKEN,
  SET_USER_INFO,
} from '../constants/user';

const initialState = {
  userInfo: sessionStorage.getItem('userInfo') || null,
  isAuthenticated: sessionStorage.getItem('userInfo') ? true : false,
  accessToken: sessionStorage.getItem('accessToken') || null,
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
        sessionStorage.setItem('accessToken', action.payload.accessToken);
        sessionStorage.setItem('refreshToken', action.payload.refreshToken);
        sessionStorage.setItem('userInfo', action.payload.userInfo);
        return {
          ...state,
          userInfo: action.payload.userInfo,
          isAuthenticated: true,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
      } else {
        // If payload is null, clear user info and tokens
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userInfo');
        return {
          ...state,
          userInfo: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        };
      }
    case CLEAR_USER_INFO:
      // Clear user info and tokens
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userInfo');
      return {
        ...state,
        userInfo: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      };

    case REFRESH_ACCESS_TOKEN:
      // Handle refreshing access token
      sessionStorage.setItem('accessToken', action.payload);
      return {
        ...state,
        accessToken: action.payload,
      };
    default:
      return state;
  }
};

export default userInfoReducer;
