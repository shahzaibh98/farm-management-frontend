import {
  Anchor,
  Container,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { fetchData, postData } from '../../api/api';
import { Button, Paper, Text, TextInput } from '../../concave.agri/components';
import { SignUpPageProps } from '../../types/signup.type';
export function SignUpPage() {
  useEffect(() => {
    fetchData('farm').then(response => console.log(response));
  }, []);

  const navigate = useNavigate();
  const theme = useMantineTheme();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      farmId: '',
      fcmToken: '',
      firstName: '',
      lastName: '',
      currentPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
    }),
    onSubmit: (values: SignUpPageProps) => {
      postData('auth/email/register', {}).then(response => {
        console.log(response);
      });
    },
  });

  return (
    <Container size={420} className="my-10">
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
            label="First Name"
            placeholder="Enter your First Name"
            required
            value={formik.values.firstName}
            onChange={(value: string) =>
              formik.setFieldValue('firstName', value)
            }
            error={
              formik.touched.email && formik.errors.email && formik.errors.email
            }
          />
          <TextInput
            label="Last Name"
            placeholder="Enter your Last Name"
            required
            value={formik.values.lastName}
            onChange={(value: string) =>
              formik.setFieldValue('lastName', value)
            }
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
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            required
            className="mt-4"
            value={formik.values.currentPassword}
            onChange={event =>
              formik.setFieldValue('currentPassword', event.target.value)
            }
            error={
              formik.touched.currentPassword &&
              formik.errors.currentPassword &&
              formik.errors.currentPassword
            }
          />
          <Button
            type="submit"
            fullWidth
            className="mt-6"
            style={{ backgroundColor: theme.colors.secondaryColors[3] }}
          >
            CREATE ACCOUNT
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
