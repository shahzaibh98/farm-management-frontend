import {
  Button,
  Grid,
  Paper,
  Select,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../api/api';
import {
  Modal,
  Notification,
  NumberInput,
  TextInput,
} from '../../concave.agri/components';
import GenericHeader from '../../layout/header.layout';
import { inputStyle } from '../../theme/common.style';

// Importing custom components from the 'concave.agri' project
import {
  AreaUnitEn,
  IRRIGATIONMETHOD,
  LandStatus,
  LandType,
  SoilType,
} from '@agri/shared-types';
import { IconMap } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../concave.agri/components';
import { initialNotification } from '../../utils/common/constant.objects';
import { initialMapModalInfo } from './initial.values';
import LocationSearch from './searchLocation';
import { Country, State, City } from 'country-state-city';

const ManageLand = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const [mapModalDetails, setMapModalDetails] = useState(initialMapModalInfo);

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
      fetchData(`land/${id}`)
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
        postData('/land', {
          ...values,
          estimatedCost: values.estimatedCost.toString(),
        }) // Send form data to the server
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: 'Land created successfully',
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
          putData(`/land/${id}`, {
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
        headerText="Farm Location"
        breadcrumbsText="Manage Farm Location"
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} Location`}
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
            Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="name"
                label="Location Name"
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
              <Select
                id="landType "
                label="Type"
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
          </Grid>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Location
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="country"
                label="Country"
                name="country"
                placeholder="Enter your country..."
                value={formik.values?.country ?? ''}
                onChange={e => {
                  if (type !== 'View') {
                    const getCountry = Country.getAllCountries()?.find(
                      country => country.name === e
                    );

                    setLocationData({
                      ...locationData,
                      countryCode: getCountry?.isoCode ?? '',
                    });

                    formik.setFieldValue('country', e);
                    formik.setFieldValue('provinceOrState', '');
                    formik.setFieldValue('cityOrTown', '');
                  }
                }}
                data={[
                  /* eslint-disable-next-line */
                  ...Country?.getAllCountries()?.map(country => {
                    return country?.name;
                  }),
                ]}
                searchable
                styles={inputStyle}
                error={
                  formik.errors.country &&
                  (formik.touched.country || formik.submitCount > 0)
                    ? (formik.errors.country as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="province"
                label="Province/State"
                name="provinceOrState"
                searchable
                placeholder="Enter your province or state..."
                value={formik.values?.provinceOrState ?? ''}
                disabled={!formik.values?.country}
                data={[
                  { label: 'None', value: '' },
                  /* eslint-disable-next-line */
                  ...State?.getStatesOfCountry(locationData?.countryCode)?.map(
                    state => state?.name
                  ),
                ]}
                onChange={e => {
                  if (type !== 'View') {
                    const getState = State.getAllStates()?.find(
                      state =>
                        state.name === e &&
                        state.countryCode === locationData?.countryCode
                    );

                    setLocationData({
                      ...locationData,
                      stateCode: getState?.isoCode ?? '',
                    });
                    formik.setFieldValue('provinceOrState', e);
                  }
                }}
                styles={inputStyle}
                error={
                  formik.errors.provinceOrState &&
                  (formik.touched.provinceOrState || formik.submitCount > 0)
                    ? (formik.errors.provinceOrState as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="city"
                label="City/Town"
                name="cityOrTown"
                searchable
                placeholder="Enter your city or town..."
                value={formik.values?.cityOrTown ?? ''}
                disabled={!formik.values?.provinceOrState}
                data={[
                  { label: 'None', value: '' },
                  ...City.getCitiesOfState(
                    locationData?.countryCode,
                    locationData?.stateCode
                  ).map((city: { name: any }) => city.name),
                ]}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('cityOrTown', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.cityOrTown &&
                  (formik.touched.cityOrTown || formik.submitCount > 0)
                    ? (formik.errors.cityOrTown as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="address"
                label="Address"
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
          </Grid>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Addition Info
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="status"
                label="Status"
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
              <Select
                id="soilType"
                label="Soil Type"
                placeholder="Select Soil Type..."
                data={[...Object.values(SoilType)]}
                value={formik.values?.soilType}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('soilType', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="irrigationMethod"
                label="Irrigation Method"
                placeholder="Select Method..."
                data={[...Object.values(IRRIGATIONMETHOD)]}
                value={formik.values?.irrigationMethod}
                onChange={value =>
                  type !== 'View' &&
                  formik.setFieldValue('irrigationMethod', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Estimate Cost"
                name="estimatedCost"
                placeholder="Enter your Estimate Cost..."
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

          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Mark Location Boundaries
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Button
                variant="outline"
                autoContrast
                color={theme.colors.secondaryColors[0]}
                size="md"
                onClick={() => {
                  setMapModalDetails({
                    isOpened: true,
                    isReadOnly: false,
                    isMultiple: false,
                    data: formik.values,
                  });
                }}
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                rightSection={
                  <IconMap style={{ width: rem(18), height: rem(18) }} />
                }
              >
                <Text tt="capitalize" fs="italic" p={2}>
                  {'Mark Boundaries'}
                </Text>
              </Button>
            </Grid.Col>
          </Grid>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="area"
                label="Land Area"
                name="area"
                placeholder="Enter your Land Area..."
                value={formik.values?.area ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('area', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.area &&
                  (formik.touched.area || formik.submitCount > 0)
                    ? formik.errors.area
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="areaUnit"
                label="Area Unit"
                placeholder="Select areaUnit..."
                data={[...Object.values(AreaUnitEn)]}
                value={formik.values?.areaUnit}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('areaUnit', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
          </Grid>

          <Modal
            styles={{
              title: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: theme.colors.primaryColors[0],
              },
            }}
            transitionProps={{ transition: 'fade-up', duration: 300 }}
            onClose={() => setMapModalDetails(initialMapModalInfo)}
            opened={mapModalDetails?.isOpened}
            title={'Location Boundaries'}
            size={'xl'}
          >
            <LocationSearch
              onLocationSelect={object => {
                formik.setFieldValue('coordinates', object?.coordinates);
                formik.setFieldValue('markLocation', object?.markLocation);
                formik.setFieldValue(
                  'area',
                  isNaN(object?.totalArea) ? 0 : object?.totalArea
                );
                formik.setFieldValue('areaUnit', AreaUnitEn.ACRES);
                setMapModalDetails(initialMapModalInfo);
              }}
              onClose={() => setMapModalDetails(initialMapModalInfo)}
              isReadOnly={type === 'View'}
              data={mapModalDetails?.data}
            />
          </Modal>
        </form>
      </Paper>
    </main>
  );
};

export default ManageLand;
