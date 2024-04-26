import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import ManageFarmAdmin from '../../pages/manage-farm-admin/view-farm-admin.page';
import PrivateRoute from '../private/private.routes';

export const farmAdminRoutes = [
  {
    path: '/manage-farm',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Farm Admin" />
            <ManageFarmAdmin />
          </PrivateRoute>
        ),
      },
    ],
  },
];
