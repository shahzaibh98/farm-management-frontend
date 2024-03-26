import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  // TODO: Enable it after server configuration and access token
  // const isAuthenticated = useSelector(
  //   (state: any) => state?.userInfo?.isAuthenticated
  // );

  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
