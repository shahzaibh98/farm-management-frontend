import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import AddUserComponent from '../../pages/manage-farm-admin/add-user';
import ManageFarmAdmin from '../../pages/manage-farm-admin/view-farm-admin.page';
import PrivateRoute from '../private/private.routes';

export const farmAdminUserRoutes = [
  {
    path: '/add/user',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Add User" />
            <AddUserComponent />
          </PrivateRoute>
        ),
      },
    ],
  },
];
