import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import ManageCrop from '../../pages/crops/crops.form';
import CropView from '../../pages/crops/view.crop';
import { ErrorPage } from '../../pages/error';
import PrivateRoute from '../private/private.routes';

export const cropRoutes = [
  {
    path: '/crop',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop" />
            <CropView />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Add" />
            <ManageCrop />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - View" />
            <div>Crop View</div>
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Edit" />
            <div>Crop Edit</div>
          </PrivateRoute>
        ),
      },
    ],
  },
];
