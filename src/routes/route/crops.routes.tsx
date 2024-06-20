import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import ManageCropsWithPlan from '../../pages/crop-plan/view-crop-plan.page';
import CropForm from '../../pages/crops/crop/crop.form';
import ManageCrops from '../../pages/crops/crop/view-crops.page';
import CropPlanningForm from '../../pages/crops/planning/planning.form';
import ManageCropsPlanning from '../../pages/crops/planning/view-planning.page';
import ManagePlanting from '../../pages/crops/planting/planting.form';
import PlantingView from '../../pages/crops/planting/view-planting.page';
import { ErrorPage } from '../../pages/error';

import PrivateRoute from '../private/private.routes';

// For System Admin Reference Crops Routes
export const cropsRoutes = [
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
      {
        path: ':cropId/planning',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning" />
            <ManageCropsPlanning />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - Add" />
            <CropPlanningForm />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - View" />
            <CropPlanningForm type="View" />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - Edit" />
            <CropPlanningForm type="Update" />
          </PrivateRoute>
        ),
      },
    ],
  },
];

// For Crops Planting - Clients
export const plantingRoutes = [
  {
    path: '/planting',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planting" />
            <PlantingView
              pageLabel="Crop"
              apiEndPoint="planting"
              routeName="planting"
            />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planting - Add" />
            <ManagePlanting pageLabel="Planting" apiEndPoint="planting" />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planting - View" />
            <ManagePlanting
              type="View"
              pageLabel="Planting"
              apiEndPoint="planting"
            />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planting - Edit" />
            <ManagePlanting
              type="Update"
              pageLabel="Planting"
              apiEndPoint="planting"
            />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export const cropPlanRoutes = [
  {
    path: '/crop-plan',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop Plan" />
            <ManageCropsWithPlan
              apiEndPoint="crop/counted"
              pageLabel="Crop Plan"
              routeName="crop-plan"
            />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop Plan - Add" />
            <CropForm apiEndPoint="crop-plan" pageLabel="Crop Plan" />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop Plan - Edit" />
            <CropForm
              type="Update"
              apiEndPoint="crop-plan"
              pageLabel="Crop Plan"
            />
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Crop Plan - View" />
            <CropForm
              type="View"
              apiEndPoint="crop-plan"
              pageLabel="Crop Plan"
            />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning" />
            <ManageCropsPlanning />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - Add" />
            <CropPlanningForm />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - View" />
            <CropPlanningForm type="View" />
          </PrivateRoute>
        ),
      },
      {
        path: ':cropId/planning/edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Planning - Edit" />
            <CropPlanningForm type="Update" />
          </PrivateRoute>
        ),
      },
    ],
  },
];
