import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  // Replace isAuthenticated Functionality
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
