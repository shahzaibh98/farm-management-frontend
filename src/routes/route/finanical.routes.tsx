import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const financialRoutes = [
  {
    path: '/financial',
    element: <AppShell />,
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
];
