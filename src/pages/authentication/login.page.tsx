// Importing necessary Mantine components and hooks
import { useMantineTheme } from '@mantine/core';

// Importing useFormik for form handling
import { useFormik } from 'formik';

// Importing hooks and state management tools
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Importing Yup for form validation
import * as Yup from 'yup';

// Importing custom API function
import { postData } from '../../api/api';

// Importing custom components and Redux actions
import { Notification, Text } from '../../concave.agri/components';
import { setUserInfo } from '../../redux/actions/user';

// Importing type definitions
import axios from 'axios';
import { requestForToken } from '../../firebase/firebase.config';
import { AuthData, LoginPageProps } from '../../types/login.type';

// Initial notification state
const initialNotification = {
  isSuccess: true, // Indicates whether the notification is successful
  isEnable: false, // Indicates whether the notification is enabled
  title: '', // Title of the notification
  message: '', // Message of the notification
};

// Preload the background image
const backgroundImage = new Image();
backgroundImage.src = require('../../assets/images/login-background.avif');

// LoginPage function component
export function LoginPage() {
  // Initialize theme hook
  const theme = useMantineTheme();

  // Initialize dispatch for Redux actions
  const dispatch = useDispatch();

  // Initialize notification state
  const [notification, setNotification] = useState(initialNotification);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [userDetails, setUserDetails] = useState<AuthData>();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Preload the background image
    const backgroundImage = new Image();
    backgroundImage.src = require('../../assets/images/login-background.avif');
  }, []);

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
      const webFCMToken = await requestForToken();
      postData('/users/login', {
        ...values,
        fcmTokenWeb: webFCMToken,
      })
        .then((res: any) => {
          if (res?.userInfo?.passwordExpiry === 'true') {
            setUserDetails(res);
            setOpenModal(true);
          } else {
            dispatch(setUserInfo(res));
          }
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

  const form = useFormik({
    initialValues: {
      password: '', // Initial email value
      confirmPassword: '', // Initial password value
    },
    // Define form validation schema
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters long'),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    }),
    // Define form submission handler
    onSubmit: async values => {
      setIsLoading(true);
      // Post login data to the server
      resetPassword(values);
    },
  });

  const resetPassword = (values: any) => {
    const userId = userDetails?.userInfo?.userId;
    const token = userDetails?.token;

    console.log(`reset password for user ${userId} with token ${token}`);

    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .put(`${process.env.REACT_APP_BASE_URL}/users/${userId}`, {
        ...values,
        passwordExpiry: 'false',
        updatedBy: userId?.toString(),
      })
      .then(() => {
        dispatch(setUserInfo(userDetails));
      })
      .catch(error => {
        setNotification({
          isSuccess: false,
          message: error?.response?.data?.message ?? error?.message,
          title: 'Something went wrong',
          isEnable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

  return (
    <>
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'fit',
          backgroundPosition: 'center',
          backgroundImage: `url(${backgroundImage.src})`,
        }}
      >
        {notification.isEnable && (
          <Notification
            title={notification.title}
            withClose
            color={
              notification.isSuccess ? theme.colors.primaryColors[0] : 'red'
            }
            handleCloseNotification={handleNotificationClose}
          >
            <Text fw={500}>{notification.message}</Text>
          </Notification>
        )}
        <div className="relative">
          <div className="flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white bg-opacity-20 shadow-lg px-4 backdrop-filter backdrop-blur-xl">
            <div className="flex-auto p-6">
              <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a
                  href="https://concaveagri.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500"
                >
                  <span className="flex-shrink-0 text-3xl font-black text-secondaryColors-40 tracking-tight opacity-100">
                    Concave Agri
                  </span>
                </a>
              </div>

              <h4 className="mb-2 font-bold text-2xl xl:text-xl">
                Welcome to Concave Farm!
              </h4>
              <p className="mb-6">Please sign-in to access your account</p>

              {!openModal ? (
                <form className="mb-4" onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-2 inline-block text-xs font-medium uppercase">
                      Email
                    </label>
                    <input
                      type="text"
                      className="block w-full cursor-text appearance-none rounded-md bg-transparent  border border-secondaryColors-40 bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={(e: any) =>
                        formik.setFieldValue('email', e.target.value)
                      }
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red text-sm">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <label className="mb-2 inline-block text-xs font-medium uppercase">
                        Password
                      </label>
                      <a
                        href=""
                        className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
                      >
                        <small className=" ">Forgot Password?</small>
                      </a>
                    </div>
                    <div className="relative flex w-full flex-wrap items-stretch">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="relative block flex-auto cursor-text appearance-none bg-transparent rounded-md border border-secondaryColors-40 bg-transparent bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow placeholder-black"
                        value={formik.values.password}
                        onChange={event =>
                          formik.setFieldValue('password', event.target.value)
                        }
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red text-sm">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="block">
                      <input
                        className="mt-1 mr-2 h-5 w-5 accent-secondaryColors-40 rounded-md border border-gray-300 bg-secondaryColors-40 bg-contain bg-no-repeat align-top text-black shadow focus:border-indigo-500 focus:shadow cursor-pointer"
                        type="checkbox"
                        id="remember-me"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <label className="inline-block mt-1">Show Password</label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      className="w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 bg-opacity-50 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                      type="submit"
                    >
                      {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                  </div>
                </form>
              ) : (
                <form className="mb-4" onSubmit={form.handleSubmit}>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <label className="mb-2 inline-block text-xs font-medium uppercase">
                        Password
                      </label>
                    </div>
                    <div className="relative flex w-full flex-wrap items-stretch">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="relative block flex-auto cursor-text appearance-none bg-transparent rounded-md border border-secondaryColors-40 bg-transparent bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow placeholder-black"
                        value={form.values.password}
                        onChange={event =>
                          form.setFieldValue('password', event.target.value)
                        }
                      />
                      {form.touched.password && form.errors.password && (
                        <div className="text-red text-sm">
                          {form.errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between">
                      <label className="mb-2 inline-block text-xs font-medium uppercase">
                        Confirm Password
                      </label>
                    </div>
                    <div className="relative flex w-full flex-wrap items-stretch">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="relative block flex-auto cursor-text appearance-none bg-transparent rounded-md border border-secondaryColors-40 bg-transparent bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow placeholder-black"
                        value={form.values.confirmPassword}
                        onChange={event =>
                          form.setFieldValue(
                            'confirmPassword',
                            event.target.value
                          )
                        }
                      />
                      {form.touched.confirmPassword &&
                        form.errors.confirmPassword && (
                          <div className="text-red text-sm">
                            {form.errors.confirmPassword}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="block">
                      <input
                        className="mt-1 mr-2 h-5 w-5 accent-secondaryColors-40 rounded border border-gray-300 bg-secondaryColors-40 bg-contain bg-no-repeat align-top text-black shadow focus:border-indigo-500 focus:shadow cursor-pointer"
                        type="checkbox"
                        id="remember-me"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <label className="inline-block mt-1">
                        {' '}
                        Show Password
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      className="w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 bg-opacity-50 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                      type="submit"
                    >
                      {isLoading ? 'Loading...' : 'Update Credentials'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
