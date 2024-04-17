// Importing necessary Mantine components and hooks
import {
  Anchor,
  Container,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';

// Importing useFormik for form handling
import { useFormik } from 'formik';

// Importing React's useState hook for managing state
import { useState } from 'react';

// Importing useDispatch for Redux state management
import { useDispatch } from 'react-redux';

// Importing useNavigate for navigation
import { useNavigate } from 'react-router-dom';

// Importing Yup for form validation
import * as Yup from 'yup';

// Importing custom API function for sending data to server
import { postData } from '../../api/api';

// Importing custom components from project
import {
  Button,
  Notification,
  Paper,
  Text,
  TextInput,
} from '../../concave.agri/components';

// Importing Redux actions for updating user info
import { setUserInfo } from '../../redux/actions/user';

// Importing type definitions for SignUpPageProps
import { SignUpPageProps } from '../../types/signup.type';
import { initialNotification } from '../../utils/common/constant.objects';

// SignUpPage function component
export function SignUpPage() {
  // Initialize navigation
  const navigate = useNavigate();

  // Initialize Redux dispatch for state management
  const dispatch = useDispatch();

  // Initialize Mantine theme
  const theme = useMantineTheme();

  // Initialize notification state
  const [notification, setNotification] = useState(initialNotification);

  // Initialize formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: '', // Initial value for email input
      password: '', // Initial value for password input
      confirmPassword: '', // Initial value for confirm password input
      farmId: '', // Initial value for farm ID
      fcmToken: '', // Initial value for FCM token
      name: '', // Initial value for name input
      farmTitle: '', // Initial value for farm title input
    },
    // Define validation schema using Yup
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      farmTitle: Yup.string().required('Required'),
    }),
    // Define onSubmit handler for form submission
    onSubmit: (values: SignUpPageProps) => {
      // Check if password and confirm password match
      if (values.password !== values.confirmPassword) {
        // If not, set error notification
        setNotification({
          isSuccess: false,
          message: 'Current and Confirm Password does not match',
          title: 'Validation Error',
          isEnable: true,
        });
        return;
      }
      // Post data to the server
      postData('users', values)
        .then(res => {
          // Dispatch setUserInfo action with response data
          dispatch(setUserInfo(res));
        })
        .catch(error => {
          // Set error notification on failure
          setNotification({
            isSuccess: false,
            message: error.message,
            title: 'Something went wrong',
            isEnable: true,
          });
        });
    },
  });

  // Handle notification close event
  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

  return (
    // Main container with size and margin
    <Container size={420} className="my-10">
      {/* Render notification if enabled */}
      {notification.isEnable && (
        <Notification
          title={notification.title}
          withClose
          color={notification.isSuccess ? theme.colors.primaryColors[0] : 'red'}
          handleCloseNotification={handleNotificationClose}
        >
          {/* Display notification message */}
          <Text fw={500}>{notification.message}</Text>
        </Notification>
      )}
      {/* Page title */}
      <Title className="font-bold text-2xl text-center text-secondaryColors-100">
        Welcome to Concave Farm!
      </Title>
      {/* Instructions and login link */}
      <Text className="text-gray-500 text-sm text-center mt-5">
        Already have an account?{' '}
        <Anchor
          className="text-blue-500 hover:underline"
          component="button"
          onClick={() => navigate('/login')}
        >
          Login to account
        </Anchor>
        <br />
      </Text>
      {/* Form submission handler */}
      <form onSubmit={formik.handleSubmit}>
        {/* Paper wrapper for form fields */}
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
          {/* Full Name input field */}
          <TextInput
            label="Full Name"
            placeholder="Enter your Full Name"
            required
            value={formik.values.name}
            onChange={(value: string) => formik.setFieldValue('name', value)}
            error={
              formik.touched.name && formik.errors.name && formik.errors.name
            }
          />
          {/* Farm Title input field */}
          <TextInput
            label="Farm Title"
            placeholder="Enter your farm title"
            required
            value={formik.values.farmTitle}
            onChange={(value: string) =>
              formik.setFieldValue('farmTitle', value)
            }
            error={
              formik.touched.farmTitle &&
              formik.errors.farmTitle &&
              formik.errors.farmTitle
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
          {/* Confirm Password input field */}
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            required
            className="mt-4"
            value={formik.values.confirmPassword}
            onChange={event =>
              formik.setFieldValue('confirmPassword', event.target.value)
            }
            error={
              formik.touched.confirmPassword &&
              formik.errors.confirmPassword &&
              formik.errors.confirmPassword
            }
          />
          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            className="mt-10"
            style={{ backgroundColor: theme.colors.secondaryColors[3] }}
          >
            CREATE ACCOUNT
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
