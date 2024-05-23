import {
  Button,
  Grid,
  Paper,
  Select,
  Title,
  useMantineTheme,
} from '@mantine/core';
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
import { isPkTelePhoneNumber } from '../../utils/common/function';
import { DateTimePicker } from '@mantine/dates';

const CropPlanningForm = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();

  const { roleId, ...userInfo } = useSelector(
    (state: any) => state?.userInfo?.userInfo
  );
  const [selectedSeedCategory, setSelectedSeedCategory] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (id)
      fetchData(`users/${id}`)
        .then((data: any) => setUserData(data.data))
        .catch(err => console.log(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? { ...userData, address: userData?.farm?.address }
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
      // Handle form submission
      setIsLoading(true);
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
          })
          .finally(() => {
            setIsLoading(false);
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
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
  });

  const handleNotificationClose = () => setNotification(initialNotification);
  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

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
        headerText={roleId === '0' ? `Crop` : `Users`}
        breadcrumbsText={`${type} ${roleId === '0' ? `Crop` : `Users`} to System`} // Call handleAddFarmAdmin function when button is clicked
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} ${roleId === '0' ? `Crop` : `User`}`}
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
                Crop Planning Detail
              </Title>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <TextInput
                    id="farmTitle"
                    label="Crop Name"
                    name="farmTitle"
                    placeholder="Enter your crop name..."
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
                  <label>Plowing Date</label>
                  <DateTimePicker
                    placeholder="plowing date"
                    withAsterisk
                    value={
                      formik?.values?.startDateTime &&
                      new Date(formik?.values?.startDateTime)
                    }
                    onChange={value =>
                      formik.setFieldValue('startDateTime', value)
                    }
                    error={
                      !!(
                        formik.errors.startDateTime &&
                        formik.touched.startDateTime
                      )
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <label>Swoing Date</label>
                  <DateTimePicker
                    placeholder="swoing date"
                    withAsterisk
                    value={
                      formik?.values?.startDateTime &&
                      new Date(formik?.values?.startDateTime)
                    }
                    onChange={value =>
                      formik.setFieldValue('startDateTime', value)
                    }
                    error={
                      !!(
                        formik.errors.startDateTime &&
                        formik.touched.startDateTime
                      )
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Seed Category"
                    id="status"
                    placeholder="select Category"
                    data={[
                      { label: 'Breeder ', value: 'true' },
                      { label: 'Certified ', value: 'false' },
                    ]}
                    value={formik.values?.isActive}
                    onChange={value => {
                      type !== 'View' &&
                        formik.setFieldValue('isActive', value);
                      setSelectedSeedCategory(value);
                    }}
                    styles={inputStyle}
                  />
                </Grid.Col>
                {selectedSeedCategory && (
                  <>
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                      <TextInput
                        label="Seeds Per Kg"
                        id="seedsPerKg"
                        name="seedsPerKg"
                        placeholder="Enter kg..."
                        value={formik.values?.seedsPerKg}
                        onChange={e =>
                          type !== 'View' &&
                          formik.setFieldValue('seedsPerKg', e)
                        }
                        styles={inputStyle}
                        error={
                          (formik.touched.seedsPerKg ||
                            formik.submitCount > 0) &&
                          formik.errors.seedsPerKg
                            ? formik.errors.seedsPerKg
                            : null
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                      <TextInput
                        label="Seeds Rate"
                        id="seedsRate"
                        name="seedsRate"
                        placeholder="Enter rate..."
                        value={formik.values?.seedsRate}
                        onChange={e =>
                          type !== 'View' &&
                          formik.setFieldValue('seedsRate', e)
                        }
                        styles={inputStyle}
                        error={
                          (formik.touched.seedsRate ||
                            formik.submitCount > 0) &&
                          formik.errors.seedsRate
                            ? formik.errors.seedsRate
                            : null
                        }
                      />
                    </Grid.Col>
                  </>
                )}
              </Grid>
            </>
          )}

          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            {`${roleId === '0' ? 'Crop Land Planning' : 'User'} Detail`}
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Fertilizer"
                id="status"
                placeholder="select Fertilizer"
                data={[
                  { label: 'Engro Fertilizer ', value: 'true' },
                  { label: 'Fauji Fertilizer ', value: 'false' },
                ]}
                value={formik.values?.isActive}
                onChange={value => {
                  type !== 'View' && formik.setFieldValue('isActive', value);
                  setSelectedSeedCategory(value);
                }}
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Fertilizer Cost"
                id="name"
                name="name"
                placeholder="Enter cost..."
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
                label="Irrigation"
                id="email"
                name="email"
                placeholder="Enter irrigation..."
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
                label="Water Cost"
                id="phoneNo"
                name="phoneNo"
                placeholder="Enter cost"
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
                label="Medicine"
                id="status"
                placeholder="select medicine"
                data={[
                  { label: 'insecticides ', value: 'true' },
                  { label: 'herbicides ', value: 'false' },
                ]}
                value={formik.values?.isActive}
                onChange={value => {
                  type !== 'View' && formik.setFieldValue('isActive', value);
                  setSelectedSeedCategory(value);
                }}
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Medicine Cost"
                id="phoneNo"
                name="phoneNo"
                placeholder="Enter cost"
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
              <label>Harvesting Date</label>
              <DateTimePicker
                placeholder="harvesting date"
                withAsterisk
                value={
                  formik?.values?.startDateTime &&
                  new Date(formik?.values?.startDateTime)
                }
                onChange={value => formik.setFieldValue('startDateTime', value)}
                error={
                  !!(
                    formik.errors.startDateTime && formik.touched.startDateTime
                  )
                }
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

export default CropPlanningForm;
