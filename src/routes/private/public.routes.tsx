import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: any) => {
  const isAuthenticated = useSelector(
    (state: any) => state?.userInfo?.isAuthenticated
  );
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
