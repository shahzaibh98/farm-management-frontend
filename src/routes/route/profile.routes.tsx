import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import { UserProfile } from '../../pages/user-profile';
import PrivateRoute from '../private/private.routes';

export const profileRoutes = [
  {
    path: '/view-profile',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="View Profile" />
            <UserProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
];
