// reducers/userInfoReducer.js

import { isEmpty } from '../../utils/common/function';
import {
  CLEAR_USER_INFO,
  REFRESH_ACCESS_TOKEN,
  SET_USER_INFO,
} from '../constants/user';

// Initialize userInfo from sessionStorage
const userInfoString = sessionStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

const currentRoleString = sessionStorage.getItem('currentRole');
const currentRole = currentRoleString ? JSON.parse(currentRoleString) : null;

const initialState = {
  userInfo: userInfo,
  isAuthenticated: !!userInfo,
  token: sessionStorage.getItem('token'),
  refreshToken: sessionStorage.getItem('refreshToken'),
  isSystemAdmin: sessionStorage.getItem('isSystemAdmin') === 'true',
  currentRole:
    sessionStorage.getItem('isSystemAdmin') === 'true' ? null : currentRole,
};

const userInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_INFO:
      if (action.payload) {
        const { userInfo, token, refreshToken } = action.payload;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

        if (!action.payload.userInfo.isSystemAdmin) {
          {
            sessionStorage.setItem(
              'currentRole',
              JSON.stringify({
                currentFarmRole: userInfo.roles?.farms[0],
                currentCompanyRole: userInfo.roles?.companies[0],
                roleMode: !isEmpty(userInfo?.roles?.farms)
                  ? 'farms'
                  : 'companies',
              })
            );
            sessionStorage.setItem('isSystemAdmin', 'false');
          }
        } else {
          sessionStorage.setItem('isSystemAdmin', 'true');
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
        sessionStorage.clear();
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
      sessionStorage.clear();
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
      sessionStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      };

    // case SWITCH_ACCOUNT_ROLE:
    //   if (action.payload.roleMode === 'farms') {
    //     sessionStorage.setItem(
    //       'currentFarmRole',
    //       action.payload.currentFarmRole
    //     );
    //     return {
    //       ...state,
    //       currentFarmRole: action.payload.currentFarmRole,
    //       roleMode: 'farms',
    //     };
    //   } else if (action.payload.roleMode === 'companies') {
    //     sessionStorage.setItem(
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
