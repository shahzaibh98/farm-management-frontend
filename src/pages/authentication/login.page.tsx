import {
  Anchor,
  Container,
  Group,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { postData } from '../../api/api';
import {
  Button,
  Checkbox,
  Notification,
  Paper,
  Text,
  TextInput,
} from '../../concave.agri/components';
import { setUserInfo } from '../../redux/actions/user';
import { LoginPageProps } from '../../types/login.type';

const initialNotification = {
  isSuccess: true,
  isEnable: false,
  title: '',
  message: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const dispatch = useDispatch();

  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values: LoginPageProps) => {
      postData('auth/email/login', { ...values, fcmToken: 'Fcm Token' })
        .then(res => {
          dispatch(setUserInfo(res));
        })
        .catch(error => {
          console.log(error);
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
          handleClose={handleNotificationClose}
        >
          <Text fw={500}>{notification.message}</Text>
        </Notification>
      )}
      <Title className="font-bold text-2xl text-center text-secondaryColors-100">
        Welcome back!
      </Title>
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
          <Group className="mt-6" justify="between">
            <Checkbox label="Remember me" checked={false} onChange={() => {}} />
            <Text className='className="text-gray-500 text-sm text-center mt-5'>
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
          <Button
            type="submit"
            fullWidth
            className="mt-10"
            style={{ backgroundColor: theme.colors.secondaryColors[3] }}
          >
            SIGN IN
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
