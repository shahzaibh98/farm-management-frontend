// actions/userActions.js
import { SET_USER_INFO, CLEAR_USER_INFO } from '../constants/user';
import { fetchData } from '../../api/api';
import { REFRESH_ACCESS_TOKEN } from '../constants/user';

export const setUserInfo = (userInfo: any) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const clearUserInfo = () => ({
  type: CLEAR_USER_INFO,
});

export const refreshAccessToken = (accessToken: any) => ({
  type: REFRESH_ACCESS_TOKEN,
  payload: accessToken,
});

export const refreshAccessTokenAction =
  () =>
  async (
    dispatch: (arg0: { type: string; payload: any }) => void,
    getState: () => { (): any; new (): any; userInfo: { refreshToken: any } }
  ) => {
    try {
      // Dispatch an action to refresh the access token
      const { refreshToken } = getState().userInfo; // Get the refresh token from state
      const response: any = await fetchData(refreshToken); // Call API to refresh token
      const { accessToken } = response.data; // Extract new access token from response

      // Dispatch action to update the access token in state
      dispatch({ type: 'REFRESH_ACCESS_TOKEN', payload: accessToken });
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };
