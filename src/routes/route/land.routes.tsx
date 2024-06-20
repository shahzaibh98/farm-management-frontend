import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import ManageLand from '../../pages/land/land/land.foam';
import LandView from '../../pages/land/land/view-land.page';
import PrivateRoute from '../private/private.routes';
import ManageBed from '../../pages/land/beds/beds.from';
import SoilTestView from '../../pages/land/soil-test/view-soil-tests.page';
import SoilTestForm from '../../pages/land/soil-test/soil-test.form';
import BedsView from '../../pages/land/beds/view-beds.page';

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
      {
        path: ':id/beds',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Beds" />
            <BedsView />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/beds/view/:bedId',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Beds - View" />
            <ManageBed type="View" apiEndPoint="bed" pageLabel="Beds" />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/beds/edit/:bedId',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Beds - Edit" />
            <ManageBed type="Update" apiEndPoint="bed" pageLabel="Beds" />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/soil-tests',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test" />
            <SoilTestView />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/soil-tests/add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - Add" />
            <SoilTestForm
              type="Add"
              apiEndPoint="soil-test"
              pageLabel="Soil Test"
            />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/soil-tests/view/:soilTestId',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - View" />
            <SoilTestForm
              type="View"
              apiEndPoint="soil-test"
              pageLabel="Soil Test"
            />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/soil-tests/edit/:soilTestId',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - Edit" />
            <SoilTestForm
              type="Update"
              apiEndPoint="soil-test"
              pageLabel="Soil Test"
            />
          </PrivateRoute>
        ),
      },
    ],
  },
];
