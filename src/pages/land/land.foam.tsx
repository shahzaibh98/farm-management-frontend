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

// Importing custom components from the 'concave.agri' project
import { Text } from '../../concave.agri/components';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // Importing useParams hook
import { initialNotification } from '../../utils/common/constant.objects';

const ManageLand = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const navigate = useNavigate();
  const [landData, setLandData] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [initialLocation, setInitialLocation] = useState({
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    fetchData(`users/${id}`)
      .then((data: any) => setLandData(data.data))
      .catch(err => console.log(err));
  }, [id]);
  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setInitialLocation({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        error => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);
  const [showLatLongFields, setShowLatLongFields] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? landData
        : {
            landName: '',
            type: '',
            farmId: '',
            area: '',
            areaUnit: '',
            country: '',
            province: '',
            district: '',
            tehsil: '',
            coordinates: [],
            markLocation: [],
            address: '',
            soilType: '',
            status: '',
            estimatedCost: '',
            irrigationMethod: '',
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
          },
    validationSchema: Yup.object().shape({
      // Farm Details Validation
      landName: Yup.string().required('landName is required'),
      address: Yup.string().required('Address is required'),
      area: Yup.number()
        .typeError('Area must be a number')
        .required('Area is required'),
    }),
    onSubmit: values => {
      if (type !== 'Update')
        postData('/land', values) // Send form data to the server
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
        const { name, ...rest } = values;

        Promise.all([
          putData(`/land/${values?.farmId}`, {
            name,
          }),
          putData(`/land/${id}`, rest),
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
  const locationOptions = [
    { label: 'Field', value: 'Field' },
    { label: 'Greenhouse', value: 'Greenhouse' },
    { label: 'GrowRoom', value: 'GrowRoom' },
    { label: 'Pasture', value: 'Pasture' },
    { label: 'Paddock', value: 'Paddock' },
    { label: 'Other', value: 'Other' },
  ];
  const Areaoptions = [
    { label: 'Square Feet', value: 'sqft' },
    { label: 'Square Meter', value: 'sqm' },
    { label: 'Acre', value: 'acre' },
    { label: 'Hectare', value: 'hectare' },
    { label: 'Square Kilometer', value: 'sqkm' },
    // Add more options as needed
  ];
  const soilTypeOptions = [
    { label: 'Sandy', value: 'Sandy' },
    { label: 'Clay', value: 'Clay' },
    { label: 'Loamy', value: 'Loamy' },
    { label: 'Silty', value: 'Silty' },
    { label: 'Peaty', value: 'Peaty' },
    { label: 'Chalky', value: 'Chalky' },
    { label: 'Rocky', value: 'Rocky' },
    // Add more options as needed
  ];
  const statusoptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Fallow', value: 'Fallow' },
    { label: 'Leased', value: 'Leased' },
    { label: 'Other', value: 'Other' },
  ];
  const Irrigationoptions = [
    { label: 'Drip Irrigation', value: 'Drip Irrigation' },
    { label: 'Sprinkler Irrigation', value: 'Sprinkler Irrigation' },
    { label: 'Furrow Irrigation', value: 'Furrow Irrigation' },
    { label: 'Surface Irrigation', value: 'Surface Irrigation' },
    { label: 'Subsurface Irrigation', value: 'Subsurface Irrigation' },
    { label: 'Pivot Irrigation', value: 'Pivot Irrigation' },
    // Add more options as needed
  ];
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
        headerText="Land"
        breadcrumbsText="Manage Land"
        isAddOrUpdateButton
        buttonContent="Add Land"
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <form>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Land Detail
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="landName"
                label="Land Name"
                name="landName"
                placeholder="Enter your land name..."
                value={formik.values?.landName ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('landName', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.landName &&
                  (formik.touched.landName || formik.submitCount > 0)
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="landType "
                label="Land Type"
                placeholder="Select type..."
                data={locationOptions}
                value={formik.values?.landType}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('landType', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="area"
                label="Land Area"
                name="area"
                placeholder="Enter your Land Area..."
                value={formik.values?.area ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('area', parseFloat(e))
                }
                styles={inputStyle}
                error={
                  formik.errors.area &&
                  (formik.touched.area || formik.submitCount > 0)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="areaUnit"
                label="Area Unit"
                placeholder="Select areaUnit..."
                data={Areaoptions}
                value={formik.values?.areaUnit}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('areaUnit', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="country"
                label="Country"
                name="country"
                placeholder="Enter your country..."
                value={formik.values?.country ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('country', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.country &&
                  (formik.touched.country || formik.submitCount > 0)
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="province"
                label="Province/State"
                name="provinceOrState"
                placeholder="Enter your country..."
                value={formik.values?.province ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('province', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.province &&
                  (formik.touched.province || formik.submitCount > 0)
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="district"
                label="District"
                name="district"
                placeholder="Enter your district..."
                value={formik.values?.district ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('district', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.district &&
                  (formik.touched.district || formik.submitCount > 0)
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="tehsil"
                label="Tehsil"
                name="tehsil"
                placeholder="Enter your tehsil..."
                value={formik.values?.tehsil ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('tehsil', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.tehsil &&
                  (formik.touched.tehsil || formik.submitCount > 0)
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
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="soilType"
                label="Soil Type"
                placeholder="Select Soil Type..."
                data={soilTypeOptions}
                value={formik.values?.soilType}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('soilType', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="status"
                label="Status"
                placeholder="Select Status..."
                data={statusoptions}
                value={formik.values?.status}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('status', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
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
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="irrigationMethod"
                label="Irrigation Method"
                placeholder="Select Method..."
                data={Irrigationoptions}
                value={formik.values?.irrigationMethod}
                onChange={value =>
                  type !== 'View' &&
                  formik.setFieldValue('irrigationMethod', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="coordinates"
                label="Coordinates"
                name="coordinates"
                placeholder="Enter coordinates..."
                value={formik.values?.coordinates ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('coordinates', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.coordinates &&
                  (formik.touched.coordinates || formik.submitCount > 0)
                }
              />
            </Grid.Col>
            {showLatLongFields && (
              <>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <TextInput
                    id="latitude"
                    label="Latitude"
                    name="latitude"
                    placeholder="Enter latitude..."
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <TextInput
                    id="longitude"
                    label="Longitude"
                    name="longitude"
                    placeholder="Enter longitude..."
                    value={formik.values.longitude}
                    onChange={formik.handleChange}
                  />
                </Grid.Col>
              </>
            )}
          </Grid>
          <button
            onClick={e => {
              e.preventDefault();
              setShowLatLongFields(!showLatLongFields);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            {showLatLongFields ? 'Hide Lat Long Fields' : 'Add Lat Long Fields'}
          </button>
        </form>
      </Paper>
    </main>
  );
};

export default ManageLand;
