import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Schedular from 'pages/calender';

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import('views/dashboard/Default'))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// schedular page routing
const SchedularPage = Loadable(lazy(() => import('pages/calender')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />,
    },
    {
      path: 'task',
      element: <SchedularPage />,
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <></>,
        },
      ],
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <></>,
        },
      ],
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <></>,
        },
      ],
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <></>,
        },
      ],
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <></>,
        },
      ],
    },
  ],
};

export default MainRoutes;
