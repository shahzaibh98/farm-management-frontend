import React from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { getRoutesAgainstRole } from './role-based.routes';

const AppRouter: React.FC = () => {
  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);
  const role = userInfo?.roleId?.toString();
  const authRouter = createBrowserRouter(
    [
      ...getRoutesAgainstRole(role),
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
    { basename: '/' }
  );

  return <RouterProvider router={authRouter} />;
};

export default AppRouter;
