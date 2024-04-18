import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const isAuthenticated = useSelector(
    (state: any) => state?.userInfo?.isAuthenticated
  );

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
