import React from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { systemRoles } from '../utils/common/constant.objects';
import {
  cropRoutes,
  dashboardRoutes,
  farmAdminRoutes,
  financialRoutes,
  inventoryRoutes,
  livestockRoutes,
  profileRoutes,
  publicRoutes,
  taskRoutes,
} from './route';

const AppRouter: React.FC = () => {
  const isSuperAdmin =
    useSelector((state: any) => state?.userInfo?.userInfo)?.roleId ===
    systemRoles[0].id;

  const authRouter = createBrowserRouter(
    isSuperAdmin
      ? [
          ...farmAdminRoutes,
          ...dashboardRoutes,
          ...profileRoutes,
          ...publicRoutes,
        ]
      : [
          ...taskRoutes,
          ...cropRoutes,
          ...livestockRoutes,
          ...publicRoutes,
          ...dashboardRoutes,
          ...financialRoutes,
          ...inventoryRoutes,
          ...profileRoutes,
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
