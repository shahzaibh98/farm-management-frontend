// reducers/userInfoReducer.js

import { isEmpty } from '../../utils/common/function';
import {
  CLEAR_USER_INFO,
  REFRESH_ACCESS_TOKEN,
  SET_USER_INFO,
} from '../constants/user';

// Initialize userInfo from localStorage
const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

const currentRoleString = localStorage.getItem('currentRole');
const currentRole = currentRoleString ? JSON.parse(currentRoleString) : null;

const initialState = {
  userInfo: userInfo,
  isAuthenticated: !!userInfo,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isSystemAdmin: localStorage.getItem('isSystemAdmin') === 'true',
  currentRole:
    localStorage.getItem('isSystemAdmin') === 'true' ? null : currentRole,
};

const userInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_INFO:
      if (action.payload) {
        const { userInfo, token, refreshToken } = action.payload;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        if (!action.payload.userInfo.isSystemAdmin) {
          {
            localStorage.setItem(
              'currentRole',
              JSON.stringify({
                currentFarmRole: userInfo.roles?.farms[0],
                currentCompanyRole: userInfo.roles?.companies[0],
                roleMode: !isEmpty(userInfo?.roles?.farms)
                  ? 'farms'
                  : 'companies',
              })
            );
            localStorage.setItem('isSystemAdmin', 'false');
          }
        } else {
          localStorage.setItem('isSystemAdmin', 'true');
        }

        return action.payload.userInfo.isSystemAdmin
          ? {
              ...state,
              userInfo,
              isAuthenticated: true,
              token,
              refreshToken,
              isSystemAdmin: true,
            }
          : {
              ...state,
              userInfo,
              isAuthenticated: true,
              isSystemAdmin: false,
              token,
              refreshToken,
              currentRole: {
                currentFarmRole: userInfo.roles?.farms[0],
                currentCompanyRole: userInfo.roles?.companies[0],
                roleMode:
                  userInfo.roles?.farms?.length > 0 ? 'farms' : 'companies',
              },
            };
      } else {
        localStorage.clear();
        return {
          ...state,
          userInfo: null,
          isAuthenticated: false,
          isSystemAdmin: false,
          token: null,
          refreshToken: null,
          currentRole: null,
        };
      }
    case CLEAR_USER_INFO:
      localStorage.clear();
      return {
        ...state,
        userInfo: null,
        isAuthenticated: false,
        isSystemAdmin: false,
        token: null,
        refreshToken: null,
        currentRole: null,
      };

    case REFRESH_ACCESS_TOKEN:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      };

    // case SWITCH_ACCOUNT_ROLE:
    //   if (action.payload.roleMode === 'farms') {
    //     localStorage.setItem(
    //       'currentFarmRole',
    //       action.payload.currentFarmRole
    //     );
    //     return {
    //       ...state,
    //       currentFarmRole: action.payload.currentFarmRole,
    //       roleMode: 'farms',
    //     };
    //   } else if (action.payload.roleMode === 'companies') {
    //     localStorage.setItem(
    //       'currentCompanyRole',
    //       action.payload.currentCompanyRole
    //     );
    //     return {
    //       ...state,
    //       currentCompanyRole: action.payload.currentCompanyRole,
    //       roleMode: 'companies',
    //     };
    //   }
    //   return state;
    default:
      return state;
  }
};

export default userInfoReducer;
