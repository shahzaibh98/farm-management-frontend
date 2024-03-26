import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const livestockRoutes = [
  {
    path: '/livestock',
    element: <AppShell />,
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
];
