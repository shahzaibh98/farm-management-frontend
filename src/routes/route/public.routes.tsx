import { AuthenticationForm } from '../../pages/authentication/login-sign-up';
import { ErrorPage } from '../../pages/error';
import { PublicRoute } from '../private';

export const publicRoutes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <AuthenticationForm />
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
