import { DocumentTitle } from '../../concave.agri/components/title';
import { ForgotPasswordPage } from '../../pages/authentication/forgot-password.page';
import { LoginPage } from '../../pages/authentication/login.page';
import { SignUpPage } from '../../pages/authentication/signup.page';
import { ErrorPage } from '../../pages/error';
import { PublicRoute } from '../private';

export const publicRoutes = [
  {
    path: '/',
    basename: '/',
    element: (
      <PublicRoute>
        <DocumentTitle title="Login" />
        <LoginPage />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // {
  //   path: '/sign-up',
  //   element: (
  //     <PublicRoute>
  //       <DocumentTitle title="Sign Up" />
  //       <SignUpPage />
  //     </PublicRoute>
  //   ),
  //   errorElement: <ErrorPage />,
  // },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <DocumentTitle title="Forgot Password" />
        <ForgotPasswordPage />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
];
