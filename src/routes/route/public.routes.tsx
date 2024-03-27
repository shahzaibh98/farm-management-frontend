import { DocumentTitle } from '../../concave.agri/components/title';
import { ErrorPage } from '../../pages/error';
import { PublicRoute } from '../private';

export const publicRoutes = [
  {
    path: '/login',
    basename: '/login',
    element: (
      <PublicRoute>
        <DocumentTitle title="Login" />
        <div>Login</div>
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-up',
    element: <div>Sign Up</div>,
    errorElement: (
      <PublicRoute>
        <DocumentTitle title="Sign Up" />
        <ErrorPage />
      </PublicRoute>
    ),
  },
];
