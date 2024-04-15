import { DocumentTitle } from '../../concave.agri/components/title';
import { AppShell } from '../../pages/app-layout';
import { ErrorPage } from '../../pages/error';
import TaskPage from '../../pages/task/view-task.page';
import PrivateRoute from '../private/private.routes';
import { Demo } from '../../pages/task/task';

export const taskRoutes = [
  {
    path: '/task',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DocumentTitle title="Task" />
            <TaskPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Task - Add" />
            <div>Task Add</div>
            {/* <Demo /> */}
          </PrivateRoute>
        ),
      },
      {
        path: 'view/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Task - View" />
            <div>Task View</div>
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <DocumentTitle title="Task - Edit" />
            <div>Task Edit</div>
          </PrivateRoute>
        ),
      },
    ],
  },
];
