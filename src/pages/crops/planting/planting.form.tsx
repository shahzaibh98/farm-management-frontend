import { Grid, Paper, Select, Title, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../../api/api';
import {
  Notification,
  NumberInput,
  TextInput,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle } from '../../../theme/common.style';

// Importing custom components from the 'concave.agri' project
import { AreaUnitEn, LandStatus, LandType } from '@agri/shared-types';
import { DateTimePicker } from '@mantine/dates';
import { Country, State } from 'country-state-city';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../../concave.agri/components';
import { initialNotification } from '../../../utils/common/constant.objects';

const ManagePlanting = ({
  type = 'Add',
  pageLabel,
  apiEndPoint,
}: {
  type?: string;
  pageLabel: string;
  apiEndPoint: string;
}) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const navigate = useNavigate();
  const [landData, setLandData] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);

  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  const [locationData, setLocationData] = useState({
    countryCode: '',
    stateCode: '',
    cityCode: '',
  });

  useEffect(() => {
    if (id)
      fetchData(`${apiEndPoint}/${id}`)
        .then((data: any) => {
          setLandData(data);
          const getCountry = Country.getAllCountries()?.find(
            country => country.name === data?.country
          );

          const getState = State.getAllStates()?.find(
            state =>
              state.name === data?.provinceOrState &&
              state.countryCode === getCountry?.isoCode
          );

          setLocationData({
            ...locationData,
            countryCode: getCountry?.isoCode ?? '',
            stateCode: getState?.isoCode ?? '',
          });
        })
        .catch((err: any) => console.log(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? landData
        : {
            name: '',
            type: '',
            farmId: userInfo.farmId,
            area: '',
            areaUnit: AreaUnitEn.ACRES,
            country: '',
            provinceOrState: '',
            cityOrTown: '',
            coordinates: [],
            markLocation: null,
            address: '',
            soilType: '',
            status: '',
            estimatedCost: '',
            irrigationMethod: '',
          },
    validationSchema: Yup.object().shape({
      // Land Validation Schema
      name: Yup.string().required('Land Name is required'),
      type: Yup.string().required('Land Type is required'),

      area: Yup.number()
        .typeError('Area must be a number')
        .required('Area is required'),
      areaUnit: Yup.string().required('Area Unit is required'),
      country: Yup.string().required('Country is required'),
      provinceOrState: Yup.string().required('Province/State is required'),
      coordinates: Yup.array()
        .min(2, 'Coordinates are required')
        .required('Coordinates are required'),
    }),
    onSubmit: values => {
      setIsLoading(true);
      if (type !== 'Update')
        postData(`/${apiEndPoint}`, {
          ...values,
          estimatedCost: values.estimatedCost.toString(),
        }) // Send form data to the server
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: `${pageLabel} created successfully`,
              title: 'Successfully',
              isEnable: true,
            });
            setTimeout(() => {
              navigate(-1);
            }, 2000);
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
        Promise.all([
          putData(`/${apiEndPoint}/${id}`, {
            ...values,
            estimatedCost: values.estimatedCost.toString(),
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
            }, 2000);
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
    <main className={`w-full h-screen relative bg-darkColors-700 mb-4`}>
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
        headerText={pageLabel}
        breadcrumbs={[{ title: `Manage ${pageLabel}`, href: '' }]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} ${pageLabel}`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
        mb={10}
      >
        <form>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Planting Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="landType "
                label="Planting Method"
                placeholder="Select type..."
                data={[...Object.values(LandType)]}
                value={formik.values?.type}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('type', value)
                }
                styles={inputStyle}
                error={
                  (formik.errors?.type && formik.touched.type) ||
                  formik.submitCount > 0
                    ? (formik.errors?.type as ReactNode)
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="name"
                label="Planting Space"
                name="name"
                placeholder="Enter your location name..."
                value={formik.values?.name ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('name', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.name &&
                  (formik.touched.name || formik.submitCount > 0)
                    ? formik.errors.name
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateTimePicker
                label="Planting Date and Time"
                placeholder="Planting start date and time"
                withAsterisk
                value={
                  formik?.values?.startDateTime &&
                  new Date(formik?.values?.startDateTime)
                }
                styles={inputStyle}
                onChange={value => formik.setFieldValue('startDateTime', value)}
                error={
                  !!(
                    formik.errors.startDateTime && formik.touched.startDateTime
                  )
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="status"
                label="Planting Status"
                placeholder="Select Status..."
                data={[...Object.values(LandStatus)]}
                value={formik?.values?.status ?? ''}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('status', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="name"
                label="No of Plant"
                name="name"
                placeholder="Enter your no of plants..."
                value={formik.values?.name ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('name', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.name &&
                  (formik.touched.name || formik.submitCount > 0)
                    ? formik.errors.name
                    : null
                }
              />
            </Grid.Col>
          </Grid>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Land Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Row Spacing"
                name="address"
                placeholder="Enter your Address..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Row Length"
                name="address"
                placeholder="Enter your Address..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateTimePicker
                placeholder="expected start date and time"
                label="expected end date and time"
                withAsterisk
                styles={inputStyle}
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
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateTimePicker
                label="Actual harvesting date and time"
                placeholder="actual start date and time"
                withAsterisk
                styles={inputStyle}
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
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Actual Yield"
                name="address"
                placeholder="Enter your yield..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Expected Yield"
                name="address"
                placeholder="Enter your expected yield..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
          </Grid>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Addition Info
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Seed Company"
                name="address"
                placeholder="Enter your company..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="status"
                label="Seed Type"
                placeholder="Select type..."
                data={[...Object.values(LandStatus)]}
                value={formik?.values?.status ?? ''}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('status', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Lot Number"
                name="estimatedCost"
                placeholder="Enter your iot number..."
                value={formik.values?.estimatedCost ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('estimatedCost', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.estimatedCost &&
                  (formik.touched.estimatedCost || formik.submitCount > 0)
                    ? formik.errors.estimatedCost
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Seed Per Hole"
                name="estimatedCost"
                placeholder="Enter your iot number..."
                value={formik.values?.estimatedCost ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('estimatedCost', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.estimatedCost &&
                  (formik.touched.estimatedCost || formik.submitCount > 0)
                    ? formik.errors.estimatedCost
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Tray Size"
                name="address"
                placeholder="Enter your tray size..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Starts Per Tray"
                name="address"
                placeholder="Enter your starts per tray..."
                value={formik.values?.address ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('address', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.address &&
                  (formik.touched.address || formik.submitCount > 0)
                    ? formik.errors.address
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Number of trays"
                name="estimatedCost"
                placeholder="Enter your no of trays..."
                value={formik.values?.estimatedCost ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('estimatedCost', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.estimatedCost &&
                  (formik.touched.estimatedCost || formik.submitCount > 0)
                    ? formik.errors.estimatedCost
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Tray Number"
                name="estimatedCost"
                placeholder="Enter your tray
                 number..."
                value={formik.values?.estimatedCost ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('estimatedCost', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.estimatedCost &&
                  (formik.touched.estimatedCost || formik.submitCount > 0)
                    ? formik.errors.estimatedCost
                    : null
                }
              />
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </main>
  );
};

export default ManagePlanting;
