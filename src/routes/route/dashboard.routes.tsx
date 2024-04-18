import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Dashboard" />
            <div>DashBoard</div>
          </PrivateRoute>
        ),
      },
    ],
  },
];
