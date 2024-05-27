import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import ManageLand from '../../pages/land/land/land.foam';
import BedsView from '../../pages/land/beds/view.beds';
import LandView from '../../pages/land/land/view.land';
import PrivateRoute from '../private/private.routes';
import ManageBed from '../../pages/land/beds/beds.from';
import SoilTestView from '../../pages/land/soil-test/view-soil-tests.page';

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
  {
    path: 'beds',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: ':id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land" />
            <BedsView />
          </PrivateRoute>
        ),
      },

      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land - View" />
            <ManageBed type="View" apiEndPoint="bed" pageLabel="Beds" />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Land - Edit" />
            <ManageBed type="Update" apiEndPoint="bed" pageLabel="Beds" />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: 'soil-tests',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: ':id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test" />
            <SoilTestView />
          </PrivateRoute>
        ),
      },
      {
        path: 'add:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - Add" />
            {/* <CropForm apiEndPoint="crop" pageLabel="Crops" /> */}
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - Edit" />
            {/* <CropForm type="Update" apiEndPoint="crop" pageLabel="Crops" /> */}
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Soil Test - View" />
            {/* <CropForm type="View" apiEndPoint="crop" pageLabel="Crops" /> */}
          </PrivateRoute>
        ),
      },
    ],
  },
];
