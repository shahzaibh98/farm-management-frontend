// Importing necessary Mantine components and hooks
import {
  Anchor,
  Container,
  Group,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';

// Importing useFormik for form handling
import { useFormik } from 'formik';

// Importing hooks and state management tools
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Importing Yup for form validation
import * as Yup from 'yup';

// Importing custom API function
import { postData } from '../../api/api';

// Importing custom components and Redux actions
import {
  Button,
  Checkbox,
  Notification,
  Paper,
  Text,
  TextInput,
} from '../../concave.agri/components';
import { setUserInfo } from '../../redux/actions/user';

// Importing type definitions
import { LoginPageProps } from '../../types/login.type';
import { requestForToken } from '../../firebase/firebase.config';
// Initial notification state
const initialNotification = {
  isSuccess: true, // Indicates whether the notification is successful
  isEnable: false, // Indicates whether the notification is enabled
  title: '', // Title of the notification
  message: '', // Message of the notification
};

// LoginPage function component
export function LoginPage() {
  // Initialize navigate for routing
  const navigate = useNavigate();

  // Initialize theme hook
  const theme = useMantineTheme();

  // Initialize dispatch for Redux actions
  const dispatch = useDispatch();

  // Initialize notification state
  const [notification, setNotification] = useState(initialNotification);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user state
  const [isFarmAdmin, setIsFarmAdmin] = useState(false);

  // Initialize formik for form handling
  const formik = useFormik({
    initialValues: {
      email: '', // Initial email value
      password: '', // Initial password value
    },
    // Define form validation schema
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    // Define form submission handler
    onSubmit: async (values: LoginPageProps) => {
      setIsLoading(true);
      // Post login data to the server
      postData(isFarmAdmin ? '/farm/login/' : '/users/login', {
        ...values,
        fcmWebToken: await requestForToken(),
        fcmMobileToken: null,
      })
        .then((res: any) => {
          // Dispatch user info to the store
          dispatch(setUserInfo(res));
        })
        .catch(error => {
          // Set notification for errors
          setNotification({
            isSuccess: false,
            message: error?.response?.data?.message ?? error?.message,
            title: 'Something went wrong',
            isEnable: true,
          });
        })
        .finally(() => setIsLoading(false));
    },
  });

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

  return (
    // Main container with size and margin
    <Container size={420} className="my-10">
      {/* Notification component */}
      {notification.isEnable && (
        <Notification
          title={notification.title}
          withClose
          color={notification.isSuccess ? theme.colors.primaryColors[0] : 'red'}
          handleCloseNotification={handleNotificationClose}
        >
          <Text fw={500}>{notification.message}</Text>
        </Notification>
      )}
      {/* Page title */}
      <Title className="font-bold text-2xl text-center text-secondaryColors-100">
        Welcome back to Concave Farm!
      </Title>
      {/* Instructions and account creation link
      <Text className="text-gray-500 text-sm text-center mt-5">
        Do not have an account yet?{' '}
        <Anchor
          className="text-blue-500 hover:underline"
          component="button"
          onClick={() => navigate('/sign-up')}
        >
          Create account
        </Anchor>
        <br />
      </Text> */}
      {/* Form submission handler */}
      <form onSubmit={formik.handleSubmit}>
        {/* Paper wrapper for form elements */}
        <Paper withBorder shadow="md" className="p-8 mt-8 rounded-md">
          {/* Email input field */}
          <TextInput
            label="Email"
            placeholder="Enter your email"
            required
            value={formik.values.email}
            onChange={(value: string) => formik.setFieldValue('email', value)}
            error={
              formik.touched.email && formik.errors.email && formik.errors.email
            }
          />
          {/* Password input field */}
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            className="mt-4"
            value={formik.values.password}
            onChange={event =>
              formik.setFieldValue('password', event.target.value)
            }
            error={
              formik.touched.password &&
              formik.errors.password &&
              formik.errors.password
            }
          />
          {/* Group for checkboxes and links */}
          <Group className="mt-6" justify="between">
            {/* Remember me checkbox */}
            <Checkbox
              styles={{
                input: { cursor: 'pointer' },
                label: { fontWeight: 'bold', color: 'rgb(75 85 99)' },
              }}
              label="Is Admin Account?"
              checked={isFarmAdmin}
              onChange={() => setIsFarmAdmin(!isFarmAdmin)}
            />
            {/* Forgot password link */}
            <Text className="text-gray-500 text-sm text-center mt-5">
              Have already account{' '}
              <Anchor
                className="text-secondaryColors-100 hover:underline"
                component="button"
                onClick={() => {
                  navigate('/forgot-password');
                }}
              >
                Forgot your password?
              </Anchor>
            </Text>
          </Group>
          {/* Sign-in button */}
          <Button
            type="submit"
            fullWidth
            className="mt-10"
            style={{ backgroundColor: theme.colors.secondaryColors[3] }}
            loading={isLoading}
          >
            SIGN IN
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
