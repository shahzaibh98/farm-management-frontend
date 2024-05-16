import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import CropForm from '../../pages/crops/crop.form.admin';
import ManageCrops from '../../pages/crops/view-admin-crops.page';
import { ErrorPage } from '../../pages/error';
import UserForm from '../../pages/users/user.form';

import PrivateRoute from '../private/private.routes';

export const cropAdminRoutes = [
  {
    path: '/admin-crops',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crops" />
            <ManageCrops />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Add" />
            <CropForm />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Farm - Edit" />
            <UserForm type="Update" />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Farm - View" />
            <UserForm type="View" />
          </PrivateRoute>
        ),
      },
    ],
  },
];
