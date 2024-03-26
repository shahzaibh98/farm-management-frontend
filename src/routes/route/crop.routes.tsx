import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const cropRoutes = [
  {
    path: '/crop',
    element: <AppShell />,
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
];
