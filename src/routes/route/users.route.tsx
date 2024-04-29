import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import ManageFarmAdmin from '../../pages/manage-farm-admin/view-farm-admin.page';
import PrivateRoute from '../private/private.routes';

export const manageUsersRoutes = [
  {
    path: '/manage-users',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="User" />
            <ManageFarmAdmin />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - Add" />
            <div>User Add</div>
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - View" />
            <div>User View</div>
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - Edit" />
            <div>User Edit</div>
          </PrivateRoute>
        ),
      },
    ],
  },
];
