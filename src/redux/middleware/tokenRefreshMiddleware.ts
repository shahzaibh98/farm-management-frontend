// middleware/tokenRefreshMiddleware.js
import { refreshAccessTokenAction } from '../actions/user';

const tokenRefreshMiddleware = (store: { dispatch: (arg0: any) => void }) => {
  let timerId = null;

  // Function to refresh access token every 30 minutes
  const startTokenRefresh = () => {
    timerId = setInterval(
      () => {
        store.dispatch(refreshAccessTokenAction());
      },
      30 * 60 * 1000
    ); // 30 minutes in milliseconds
  };

  // Start token refresh only if refresh token is available in session storage
  const refreshToken = sessionStorage.getItem('token');
  if (refreshToken) {
    startTokenRefresh();
  }

  // Return the middleware function
  return (next: (arg0: any) => any) => (action: any) => {
    return next(action);
  };
};

export default tokenRefreshMiddleware;
