import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import ManageLand from '../../pages/land/land.foam';
import LandView from '../../pages/land/view.land';
import PrivateRoute from '../private/private.routes';

export const landRoutes = [
  {
    path: '/lands',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land" />
            <LandView />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land - Add" />
            <ManageLand />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land - View" />
            <ManageLand type="View" />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land - Edit" />
            <ManageLand type="Update" />
          </PrivateRoute>
        ),
      },
    ],
  },
];
