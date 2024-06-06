import { Grid, Paper, Select, Title, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../api/api';
import { Notification, TextInput } from '../../concave.agri/components';
import GenericHeader from '../../layout/header.layout';
import { inputStyle } from '../../theme/common.style';
import {
  farmAdminId,
  initialNotification,
} from '../../utils/common/constant.objects';

// Importing custom components from the 'concave.agri' project
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../concave.agri/components';
import { isPkTelePhoneNumber } from '../../utils/common/function';

const UserForm = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();

  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const roleId = isSystemAdmin
    ? '0'
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole?.roleId
      : currentRole?.currentCompanyRole?.roleId;

  const currentUserRole =
    currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole
      : currentRole?.currentCompanyRole;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id)
      fetchData(`farm-user/${id}`)
        .then((data: any) => {
          setUserData(data);
        })
        .catch(err => console.error(err));
  }, []);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      roleId === '0'
        ? {
            farmTitle:
              type === 'Update' || type === 'View'
                ? userData?.farm?.farmTitle
                : '',
            postalAddress:
              type === 'Update' || type === 'View'
                ? userData?.farm?.postalAddress
                : '',
            isActive:
              type === 'Update' || type === 'View'
                ? userData?.farm?.isActive
                  ? 'true'
                  : 'false'
                : 'true',
            // For Farm Admin
            name:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.name
                : '',
            email:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.email
                : '',
            phoneNo:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.phoneNo
                : '',
            roleId:
              type === 'Update' || type === 'View' ? userData?.roleId : '1',
          }
        : {
            name:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.name
                : '',
            email:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.email
                : '',
            phoneNo:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.phoneNo
                : '',
            roleId:
              type === 'Update' || type === 'View' ? userData?.roleId : '',
            isActive:
              type === 'Update' || type === 'View'
                ? userData?.systemUser?.isActive
                  ? 'true'
                  : 'false'
                : 'true',
            farmId:
              type === 'Update' || type === 'View'
                ? userData?.farm?.farmId?.toString()
                : currentUserRole?.farmId?.toString(),
          },
    validationSchema:
      roleId === '0'
        ? Yup.object().shape({
            // Farm Details Validation
            farmTitle: Yup.string().required('Farm title is required'),
            postalAddress: Yup.string().required('Address is required'),
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
            roleId: Yup.string().required('Role is required'),
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
            roleId: Yup.string().required('Role is required'),
          }),

    onSubmit: values => {
      // Handle form submission
      setIsLoading(true);
      if (type !== 'Update') {
        postData('/users', { ...values, isActive: values?.isActive === 'true' }) // Send form data to the server
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
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        const { farmTitle, postalAddress, isActive, roleId, farmId, ...rest } =
          values;

        const farmObject: {
          farmTitle: string;
          postalAddress: string;
          isActive?: boolean;
        } = {
          farmTitle,
          postalAddress,
        };

        const farmUserObject: { roleId: string; isActive?: boolean } = {
          roleId,
        };

        if (isSystemAdmin) farmObject['isActive'] = isActive === 'true';

        Promise.all([
          putData(`/farm/${userData?.farm?.farmId}`, farmObject),
          putData(`/farm-user/${userData?.farmUserId}`, farmUserObject),
          putData(`/users/${userData?.userId}`, {
            ...rest,
            isActive: isActive === 'true',
          }),
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
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
  });

  const handleNotificationClose = () => setNotification(initialNotification);

  return (
    <main className={'w-full h-screen relative bg-darkColors-700'}>
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
        headerText={roleId === '0' ? 'Farms' : 'Users'}
        breadcrumbs={[
          { title: `Manage ${roleId === '0' ? 'Farm' : 'User'}`, href: '' },
        ]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} ${roleId === '0' ? 'Farm' : 'User'}`}
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
                    value={formik.values?.postalAddress ?? ''}
                    onChange={e =>
                      type !== 'View' &&
                      formik.setFieldValue('postalAddress', e)
                    }
                    styles={inputStyle}
                    error={
                      (formik.touched.postalAddress ||
                        formik.submitCount > 0) &&
                      formik.errors.postalAddress
                        ? formik.errors.postalAddress
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
                value={formik.values?.isActive?.toString()}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('isActive', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            {roleId === farmAdminId && (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="User Role"
                  id="roleId"
                  placeholder="Select User Role"
                  data={[
                    { value: '4', label: 'Farm Manager' },
                    { value: '6', label: 'Accountant' },
                    { value: '8', label: 'Service Manager' },
                    { value: '10', label: 'Warehouse Manager' },
                    { value: '12', label: 'Farm Worker' },
                    { value: '14', label: 'Auditor' },
                  ]}
                  value={formik.values?.roleId}
                  onChange={value =>
                    type !== 'View' && formik.setFieldValue('roleId', value)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.roleId || formik.submitCount > 0) &&
                    formik.errors.roleId
                      ? (formik.errors.roleId as ReactNode)
                      : null
                  }
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
