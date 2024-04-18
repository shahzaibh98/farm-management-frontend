import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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
  // const superAdmin = useSelector((state: any) => state?.userInfo?.userInfo);

  const isSuperAdmin = true;

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
        ],
    { basename: '/' }
  );

  return <RouterProvider router={authRouter} />;
};

export default AppRouter;
