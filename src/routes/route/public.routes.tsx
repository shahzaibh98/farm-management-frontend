import { ErrorPage } from '../../pages/error';
import { PublicRoute } from '../private';

export const publicRoutes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
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
        <ErrorPage />
      </PublicRoute>
    ),
  },
];
