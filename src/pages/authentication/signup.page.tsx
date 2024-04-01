import {
  Anchor,
  Container,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { postData } from '../../api/api';
import {
  Button,
  Notification,
  Paper,
  Text,
  TextInput,
} from '../../concave.agri/components';
import { SignUpPageProps } from '../../types/signup.type';
import notification from '../../concave.agri/components/notification/notification';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/actions/user';

const initialNotification = {
  isSuccess: true,
  isEnable: false,
  title: '',
  message: '',
};
export function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useMantineTheme();

  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      farmId: '',
      fcmToken: '',
      name: '',
      farmTitle: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      farmTitle: Yup.string().required('Required'),
    }),
    onSubmit: (values: SignUpPageProps) => {
      if (values.password !== values.confirmPassword) {
        setNotification({
          isSuccess: false,
          message: 'Current and Confirm Password does not match',
          title: 'Validation Error',
          isEnable: true,
        });
        return;
      }
      postData('users', values)
        .then(res => {
          dispatch(setUserInfo(res));
        })
        .catch(error => {
          setNotification({
            isSuccess: false,
            message: error.message,
            title: 'Something went wrong',
            isEnable: true,
          });
        });
    },
  });

  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

  return (
    <Container size={420} className="my-10">
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
      <Title className="font-bold text-2xl text-center text-secondaryColors-100">
        Welcome to Concave Farm!
      </Title>
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
      <form onSubmit={formik.handleSubmit}>
        <Paper withBorder shadow="md" className="p-8 mt-8 rounded-md">
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
