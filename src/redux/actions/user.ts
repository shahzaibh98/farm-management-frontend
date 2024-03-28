// actions/userActions.js
import axios from 'axios';
import {
  CLEAR_USER_INFO,
  REFRESH_ACCESS_TOKEN,
  SET_USER_INFO,
} from '../constants/user';

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_API_PREFIX}/${process.env.REACT_APP_API_VERSION}`;
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
      const response: any = await axios.post(
        API_BASE_URL + '/auth/refresh',
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Set access token as bearer token
            'Content-Type': 'application/json', // Set content type
          },
        }
      );

      // Dispatch action to update the access token in state
      dispatch({ type: REFRESH_ACCESS_TOKEN, payload: response.data });
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };
