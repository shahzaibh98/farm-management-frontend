import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import CropPlanningForm from '../../pages/crop-planning/crop.planning.form.admin';
import ManageCropsPlanning from '../../pages/crop-planning/view.admin-crop-planning';
import { ErrorPage } from '../../pages/error';
import UserForm from '../../pages/users/user.form';

import PrivateRoute from '../private/private.routes';

export const cropAdminPlanningRoutes = [
  {
    path: '/admin-crops-planning',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crops" />
            <ManageCropsPlanning />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop - Add" />
            <CropPlanningForm />
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
