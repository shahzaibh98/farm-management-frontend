import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const farmAdminRoutes = [
  {
    path: '/manage-farm-admin',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="manage-farm-admin" />
            <div>View Farm Admin</div>
          </PrivateRoute>
        ),
      },
    ],
  },
];
