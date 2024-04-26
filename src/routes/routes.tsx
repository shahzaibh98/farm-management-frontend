import React from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { getRoutesAgainstRole } from './role-based.routes';

const AppRouter: React.FC = () => {
  const authRouter = createBrowserRouter(
    [
      ...getRoutesAgainstRole(),
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
    {
      basename: '/',
    }
  );

  return <RouterProvider router={authRouter} />;
};

export default AppRouter;
