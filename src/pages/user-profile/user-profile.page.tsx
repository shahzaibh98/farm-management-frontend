import { Grid, Paper, PasswordInput, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput } from '../../concave.agri/components';
import GenericHeader from '../../layout/header.layout';
import { ChangeEvent, ReactNode, useState } from 'react';
import * as Yup from 'yup';
import { postData, putData } from '../../api/api';
import { setUserInfo } from '../../redux/actions/user';
import {
  initialNotification,
  systemRoles,
} from '../../utils/common/constant.objects';
import { Notification, Text } from '../../concave.agri/components';
import useScreenSize from '../../hooks/useScreenSize';
import { inputStyle } from '../../theme/common.style';
import { isPkTelePhoneNumber } from '../../utils/common/function';

const UserProfile = () => {
  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  // State to hold the source URL of the selected image
  const [imageSrc, setImageSrc] = useState<string>(
    'https://res.cloudinary.com/demo/image/twitter/1330457336.jpg'
  );

  // Function to handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  // Function to trigger the file input click
  const handleImageClick = (): void => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Trigger file input click
    }
  };

  // Initialize Mantine theme
  const theme = useMantineTheme();

  const { isSmallScreen } = useScreenSize();

  // Initialize Redux dispatch for state management
  const dispatch = useDispatch();

  // Initialize notification state
  const [notification, setNotification] = useState(initialNotification);

  // Initialize formik for form handling and validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userInfo?.email ?? '',
      currentPassword: '',
      newPassword: '',

      name: userInfo?.name,
      phoneNo: userInfo?.phoneNo ?? '',

      profilePic:
        userInfo?.profilePic ??
        'https://e7.pngegg.com/pngimages/442/477/png-clipart-computer-icons-user-profile-avatar-profile-heroes-profile.png', // Initial value for profile
    },
    // Define validation schema using Yup
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required('Current password is required')
        .min(8, 'Password must be at least 8 characters long'),
      newPassword: Yup.string().min(
        8,
        'Password must be at least 8 characters long'
      ),
      phoneNo: Yup.string().test(
        'is-pk-telephone-number',
        'Invalid phone number. Please enter a valid Pakistani phone number.',
        value => isPkTelePhoneNumber(value ?? '')
      ),
    }),
    // Define onSubmit handler for form submission
    onSubmit: (values: any) => {
      const { profilePic, ...rest } = values;
      // Post data to the server
      putData(`users/profile/${userInfo?.userId}`, rest)
        .then(res => {
          // Dispatch setUserInfo action with response data
          dispatch(setUserInfo(res));
          setNotification({
            isSuccess: true,
            message: 'Profile updated successfully',
            title: 'Successfully updated',
            isEnable: true,
          });
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

  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

  return (
    <main className={'w-full min-h-screen relative bg-darkColors-700'}>
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

      <GenericHeader
        headerText="Profile"
        breadcrumbs={[{ title: 'My Profile', href: '' }]}
        isAddOrUpdateButton
        buttonContent="Update Profile"
        onButtonClick={formik.handleSubmit}
      />

      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <div className="dark:bg-slate-800 gap-6 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-700 shadow-xl overflow-hidden hover:shadow-2xl group rounded-xl p-5 transition-all duration-300 transform">
            <div className="flex items-center gap-4">
              <div>
                {/* Hidden file input for selecting images */}
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {/* Image element acting as the avatar */}
                <img
                  src={userInfo?.profilePic ?? imageSrc}
                  alt="Avatar"
                  className="w-32 group-hover:w-36 group-hover:h-36 h-32 object-center object-cover rounded-full transition-all duration-500 delay-500 transform cursor-pointer"
                  onClick={handleImageClick}
                />
              </div>
              <div className="w-fit transition-all transform duration-500">
                <h1 className="text-gray-600 dark:text-gray-200 font-bold text-3xl">
                  {userInfo?.name}
                </h1>
                <p className="text-gray-400">
                  {systemRoles[Number(userInfo?.roleId)]?.name}
                </p>
                <a className="text-xs text-gray-500 dark:text-gray-200 group-hover:opacity-100 opacity-0 transform transition-all delay-300 duration-500">
                  {userInfo?.email}
                </a>
              </div>
            </div>
          </div>
          <Grid className="mt-2">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Full Name"
                placeholder="Enter your Full Name"
                value={formik.values.name}
                onChange={(value: string) =>
                  formik.setFieldValue('name', value)
                }
                styles={inputStyle}
                error={
                  formik.touched.name &&
                  formik.errors.name &&
                  formik.errors.name
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formik.values.phoneNo}
                onChange={(value: string) =>
                  formik.setFieldValue('phoneNo', value)
                }
                styles={inputStyle}
                error={
                  formik.touched.phoneNo &&
                  formik.errors.phoneNo &&
                  formik.errors.phoneNo
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                value={formik.values.newPassword}
                onChange={event =>
                  formik.setFieldValue('newPassword', event.target.value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            {!isSmallScreen && (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}></Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <PasswordInput
                label="Password"
                placeholder="Enter your current password"
                value={formik.values.currentPassword}
                styles={inputStyle}
                description="For profile upgrading..."
                onChange={event =>
                  formik.setFieldValue('currentPassword', event.target.value)
                }
                error={
                  (formik.errors.currentPassword &&
                    formik.touched.currentPassword) ||
                  formik.submitCount > 0
                    ? (formik.errors.currentPassword as ReactNode)
                    : null
                }
              />
            </Grid.Col>
            {!isSmallScreen && (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}></Grid.Col>
            )}
          </Grid>
        </div>
      </Paper>
    </main>
  );
};

export default UserProfile;
