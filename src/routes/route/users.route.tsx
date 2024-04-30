import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import UserForm from '../../pages/users/user.form';
import ManageUser from '../../pages/users/view-users.page';
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
            <ManageUser />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - Add" />
            <UserForm />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - View" />
            <UserForm type="View" />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="User - Edit" />
            <UserForm type="Update" />
          </PrivateRoute>
        ),
      },
    ],
  },
];
