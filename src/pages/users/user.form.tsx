import { Grid, Paper, Select, Title, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../api/api';
import { Notification, TextInput } from '../../concave.agri/components';
import useScreenSize from '../../hooks/useScreenSize';
import GenericHeader from '../../layout/header.layout';
import { inputStyle } from '../../theme/common.style';
import { initialNotification } from '../../utils/common/constant.objects';

// Importing custom components from the 'concave.agri' project
import { Text } from '../../concave.agri/components';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // Importing useParams hook

const UserForm = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();

  const { roleId, ...userInfo } = useSelector(
    (state: any) => state?.userInfo?.userInfo
  );

  useEffect(() => {
    fetchData(`users/${id}`)
      .then((data: any) => setUserData(data.data))
      .catch(err => console.log(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  // Custom validation function
  const isPkTelePhoneNumber = (phoneNumber: string) => {
    // Define the regular expressions
    const regex03 = /^03\d{9}$/;
    const regexPlus923 = /^\+923\d{9}$/;
    return regex03.test(phoneNumber) || regexPlus923.test(phoneNumber);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? userData
        : roleId === '0'
          ? {
              // Set initial values for farm details
              farmTitle: '',
              address: '',
              isActive: 'true',
              // For Farm Admin
              name: '',
              email: '',
              phoneNo: '',
              roleId: '1',
            }
          : { name: '', email: '', phoneNo: '', roleId: '1', isActive: 'true' },
    validationSchema:
      roleId === '0'
        ? Yup.object().shape({
            // Farm Details Validation
            farmTitle: Yup.string().required('Farm title is required'),
            address: Yup.string().required('Address is required'),
            isActive: Yup.boolean().required('Active status is required'),

            // Farm Admin Validation
            name: Yup.string().required('Name is required'),
            email: Yup.string()
              .email('Invalid email format')
              .required('Email is required'),
            phoneNo: Yup.string()
              .required('Phone number is required')
              .test(
                'is-pk-telephone-number',
                'Invalid phone number. Please enter a valid Pakistani phone number.',
                value => isPkTelePhoneNumber(value)
              ),
          })
        : Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
              .email('Invalid email format')
              .required('Email is required'),
            phoneNo: Yup.string()
              .required('Phone number is required')
              .test(
                'is-pk-telephone-number',
                'Invalid phone number. Please enter a valid Pakistani phone number.',
                value => isPkTelePhoneNumber(value)
              ),
          }),
    //         roleId: Yup.string().required('Role is required'),
    //       }),
    onSubmit: values => {
      if (type !== 'Update')
        postData('/users', values) // Send form data to the server
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: 'Farm created successfully',
              title: 'Successfully',
              isEnable: true,
            });
            setTimeout(() => {
              navigate(-1);
            }, 3000);
          })
          .catch(error => {
            // Handle form submission error
            setNotification({
              isSuccess: false,
              message: error?.response?.data?.message ?? error?.message,
              title: 'Something went wrong',
              isEnable: true,
            });
          });
      else {
        const { farmTitle, address, isActive, ...rest } = values;

        Promise.all([
          putData(`/farm/${values?.farmId}`, {
            farmTitle,
            isActive: isActive === 'true',
            address,
          }),
          putData(`/users/${id}`, rest),
        ])
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: 'Updated successfully',
              title: 'Successfully',
              isEnable: true,
            });
            setTimeout(() => {
              navigate(-1);
            }, 3000);
          })
          .catch(error => {
            // Handle form submission error
            setNotification({
              isSuccess: false,
              message: error?.response?.data?.message ?? error?.message,
              title: 'Something went wrong',
              isEnable: true,
            });
          });
      }
    },
  });

  const handleNotificationClose = () => setNotification(initialNotification);

  return (
    <main className={`w-full h-screen relative bg-darkColors-700`}>
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
      <GenericHeader
        headerText={roleId === '0' ? `Farms` : `Users`}
        breadcrumbsText={`${type} ${roleId === '0' ? `Farms` : `Users`} to System`} // Call handleAddFarmAdmin function when button is clicked
        isAddOrUpdateButton={type !== 'View'}
        buttonContent={`${type} ${roleId === '0' ? `Farm` : `User`}`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <form>
          {roleId === '0' && (
            <>
              <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                Farm Detail
              </Title>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <TextInput
                    id="farmTitle"
                    label="Farm Title"
                    name="farmTitle"
                    placeholder="Enter your farm title..."
                    value={formik.values?.farmTitle ?? ''}
                    onChange={e =>
                      type !== 'View' && formik.setFieldValue('farmTitle', e)
                    }
                    styles={inputStyle}
                    error={
                      (formik.touched.farmTitle || formik.submitCount > 0) &&
                      formik.errors.farmTitle
                        ? formik.errors.farmTitle
                        : null
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <TextInput
                    label="Address"
                    id="address"
                    name="address"
                    placeholder="Enter your farm address..."
                    value={formik.values?.address ?? ''}
                    onChange={e =>
                      type !== 'View' && formik.setFieldValue('address', e)
                    }
                    styles={inputStyle}
                    error={
                      (formik.touched.address || formik.submitCount > 0) &&
                      formik.errors.address
                        ? formik.errors.address
                        : null
                    }
                  />
                </Grid.Col>
              </Grid>
            </>
          )}

          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            {`${roleId === '0' ? 'Farm Admin' : 'User'} Detail`}
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Name"
                id="name"
                name="name"
                placeholder="Enter name..."
                value={formik.values?.name}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('name', e)
                }
                styles={inputStyle}
                error={
                  (formik.touched.name || formik.submitCount > 0) &&
                  formik.errors.name
                    ? formik.errors.name
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Email Address"
                id="email"
                name="email"
                placeholder="Enter email address..."
                value={formik.values?.email}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('email', e)
                }
                styles={inputStyle}
                error={
                  (formik.touched.email || formik.submitCount > 0) &&
                  formik.errors.email
                    ? formik.errors.email
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Phone Number"
                id="phoneNo"
                name="phoneNo"
                placeholder="Enter phone number"
                value={formik.values?.phoneNo}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('phoneNo', e)
                }
                styles={inputStyle}
                error={
                  (formik.touched.phoneNo || formik.submitCount > 0) &&
                  formik.errors.phoneNo
                    ? formik.errors.phoneNo
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Select Status"
                id="status"
                placeholder="Status"
                data={[
                  { label: 'Active', value: 'true' },
                  { label: 'Blocked', value: 'false' },
                ]}
                value={formik.values?.isActive}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('isActive', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            {roleId === '1' && (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="User Role"
                  id="roleId"
                  placeholder="Select User Role"
                  data={[
                    { value: '2', label: 'Farm Manager' },
                    { value: '3', label: 'Accountant' },
                    { value: '4', label: 'Service Manager' },
                    { value: '5', label: 'Warehouse Manager' },
                    { value: '6', label: 'Farm Worker' },
                    { value: '7', label: 'Auditor' },
                  ]}
                  value={formik.values?.roleId}
                  onChange={value =>
                    type !== 'View' && formik.setFieldValue('roleId', value)
                  }
                  styles={inputStyle}
                />
              </Grid.Col>
            )}
          </Grid>
        </form>
      </Paper>
    </main>
  );
};

export default UserForm;
