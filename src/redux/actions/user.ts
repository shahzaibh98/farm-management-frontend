import { SET_USER_INFO, CLEAR_USER_INFO } from '../constants/user';

export const setUserInfo = (userInfo: any) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
});
