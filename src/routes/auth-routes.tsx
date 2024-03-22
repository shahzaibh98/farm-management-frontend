import { createBrowserRouter } from 'react-router-dom';
import { CustomAppShell } from '../pages/app-layout';
import { ErrorPage } from '../pages/error';
import PrivateRoute from './check-routes';

const authRouter = createBrowserRouter(
  [
    {
      path: '/login',
      element: <div>Login</div>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/sign-up',
      element: <div>Sign Up</div>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          index: true,
          element: (
            <PrivateRoute>
              <div>DashBoard</div>
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: '/task',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <div>Task</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'add',
          element: (
            <PrivateRoute>
              <div>Task Add</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'view/:id',
          element: (
            <PrivateRoute>
              <div>Task View</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <PrivateRoute>
              <div>Task Edit</div>
            </PrivateRoute>
          ),
        },
      ],
    },

    {
      path: '/livestock',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <div>LiveStock</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'add',
          element: (
            <PrivateRoute>
              <div>LiveStock Add</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'view/:id',
          element: (
            <PrivateRoute>
              <div>LiveStock View</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <PrivateRoute>
              <div>LiveStock Edit</div>
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: '/crop',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <div>Crop</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'add',
          element: (
            <PrivateRoute>
              <div>Crop Add</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'view/:id',
          element: (
            <PrivateRoute>
              <div>Crop View</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <PrivateRoute>
              <div>Crop Edit</div>
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: '/inventory',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <div>Inventory</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'add',
          element: (
            <PrivateRoute>
              <div>Inventory Add</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'view/:id',
          element: (
            <PrivateRoute>
              <div>Inventory View</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <PrivateRoute>
              <div>Inventory Edit</div>
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: '/financial',
      element: <CustomAppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <div>Financial</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'add',
          element: (
            <PrivateRoute>
              <div>Financial Add</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'view/:id',
          element: (
            <PrivateRoute>
              <div>Financial View</div>
            </PrivateRoute>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <PrivateRoute>
              <div>Financial Edit</div>
            </PrivateRoute>
          ),
        },
      ],
    },
  ],
  { basename: '/' }
);

export default authRouter;
