import React from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { getRoutesAgainstRole } from './role-based.routes';

const AppRouter: React.FC = () => {
  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const currentUserRole = isSystemAdmin
    ? 0
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole?.roleId
      : currentRole?.currentCompanyRole?.roleId;

  const authRouter = createBrowserRouter(
    [
      ...getRoutesAgainstRole(currentUserRole),
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
