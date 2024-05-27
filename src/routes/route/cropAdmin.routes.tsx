import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import CropForm from '../../pages/crops/crop.form';
import ManageCrops from '../../pages/crops/view-crops.page';
import { ErrorPage } from '../../pages/error';

import PrivateRoute from '../private/private.routes';

export const cropAdminRoutes = [
  {
    path: '/crops',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crops" />
            <ManageCrops
              apiEndPoint="crop"
              pageLabel="Crops"
              routeName="crops"
            />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Add" />
            <CropForm apiEndPoint="crop" pageLabel="Crops" />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Edit" />
            <CropForm type="Update" apiEndPoint="crop" pageLabel="Crops" />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - View" />
            <CropForm type="View" apiEndPoint="crop" pageLabel="Crops" />
          </PrivateRoute>
        ),
      },
    ],
  },
];
