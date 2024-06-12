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
import { fetchData, postData, putData } from '../../../api/api';
import {
  Modal,
  Notification,
  NumberInput,
  TextInput,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle } from '../../../theme/common.style';

// Importing custom components from the 'concave.agri' project
import { IconMap } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../../concave.agri/components';
import { initialNotification } from '../../../utils/common/constant.objects';
import {
  numberInputValue,
  organizeDropDownData,
} from '../../../utils/common/function';
import {
  getDistricts,
  getDivisions,
  getTehsils,
  handleDistrict,
  handleDivision,
  handleTehsil,
} from '../../../utils/common/location.Helper';
import { initialMapModalInfo } from './initial.values';
import LocationSearch from './searchLocation';

const ManageLand = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params

  const [mapModalDetails, setMapModalDetails] = useState(initialMapModalInfo);

  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const currentUser = isSystemAdmin
    ? 0
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole
      : currentRole?.currentCompanyRole;

  const navigate = useNavigate();
  const [landData, setLandData] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);

  const { locationData, referenceData } = useSelector(
    (state: any) => state?.referenceData
  );

  useEffect(() => {
    if (id)
      fetchData(`land/${id}`)
        .then((data: any) => {
          setLandData(data);
        })
        .catch((err: any) => console.error(err));
  }, [id]);

  const updateFormikValues = (values: {
    [x: string]: any;
    provinceId?: any;
    divisionId?: any;
    districtId?: any;
    tehsilId?: any;
  }) => {
    Object.keys(values).forEach(key => {
      formik.setFieldValue(key, values[key]);
    });
  };

  const handleProvinceChange = (value: string) =>
    updateFormikValues({
      provinceId: value,
      divisionId: '',
      districtId: '',
      tehsilId: '',
    });

  const handleDivisionChange = (value: string) => {
    const data = handleDivision(locationData, value);
    if (data) updateFormikValues(data);
  };

  const handleDistrictChange = (value: string) => {
    const data = handleDistrict(locationData, value);
    if (data) updateFormikValues(data);
  };

  const handleTehsilChange = (value: string) => {
    const data = handleTehsil(locationData, value);
    if (data) updateFormikValues(data);
  };

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? landData
        : {
            name: '',
            locationTypeId: '',
            farmId: currentUser?.farmId?.toString(),
            area: '',
            areaUnitId: '1',

            provinceId: '',
            divisionId: '',
            districtId: '',
            tehsilId: '',

            // plantingMethodId: '',

            // // For Beds
            // noOfBeds: '',
            // width: '',
            // length: '',

            coordinates: [],
            markLocation: null,
            postalAddress: '',
            soilTypeId: '',
            ownershipId: '',
            estimatedCost: '',
            irrigationMethodId: '',
          },
    validationSchema: Yup.object().shape({
      // Land Validation Schema
      name: Yup.string().required('Land Name is required'),
      locationTypeId: Yup.string().required('Land Type is required'),

      area: Yup.number()
        .typeError('Area must be a number')
        .required('Area is required'),
      areaUnitId: Yup.string().required('Area Unit is required'),
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
    <main className={'w-full min-h-screen relative bg-darkColors-700 mb-4'}>
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
        breadcrumbs={[{ title: 'Manage Farm Location', href: '' }]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} Location`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
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
                data={organizeDropDownData(referenceData?.locationType)}
                value={formik.values?.locationTypeId}
                onChange={value =>
                  type !== 'View' &&
                  formik.setFieldValue('locationTypeId', value)
                }
                styles={inputStyle}
                error={
                  (formik.errors?.locationTypeId &&
                    formik.touched.locationTypeId) ||
                  formik.submitCount > 0
                    ? (formik.errors?.locationTypeId as ReactNode)
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
                id="province"
                label="Province"
                name="provinceOrState"
                searchable
                placeholder="Enter your province..."
                value={formik.values?.provinceId ?? ''}
                data={[
                  { label: 'None', value: '' },
                  ...(locationData && locationData.provinces
                    ? locationData.provinces.map(
                        (e: { name: any; provinceId: any }) => ({
                          label: e.name || '',
                          value: e.provinceId || '',
                        })
                      )
                    : []),
                ]}
                onChange={(e: string | null) =>
                  type !== 'View' && handleProvinceChange(e ?? '')
                }
                styles={inputStyle}
                error={
                  formik.errors.provinceId &&
                  (formik.touched.provinceId || formik.submitCount > 0)
                    ? (formik.errors.provinceId as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="division"
                label="Division"
                name="division"
                searchable
                placeholder="Enter your division..."
                value={formik.values?.divisionId ?? ''}
                data={getDivisions(formik.values?.provinceId, locationData)}
                onChange={e => {
                  type !== 'View' && handleDivisionChange(e ?? '');
                }}
                styles={inputStyle}
                error={
                  formik.errors.divisionId &&
                  (formik.touched.divisionId || formik.submitCount > 0)
                    ? (formik.errors.divisionId as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="district"
                label="District"
                name="district"
                searchable
                placeholder="Enter your district..."
                value={formik.values?.districtId ?? ''}
                data={getDistricts(formik.values?.divisionId, locationData)}
                onChange={e => type !== 'View' && handleDistrictChange(e ?? '')}
                styles={inputStyle}
                error={
                  formik.errors?.districtId &&
                  (formik.touched?.districtId || formik.submitCount > 0)
                    ? (formik.errors?.districtId as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="tehsil"
                label="Tehsil"
                name="=tehsil"
                searchable
                placeholder="Enter your tehsil..."
                value={formik.values?.tehsilId ?? ''}
                data={getTehsils(formik.values?.districtId, locationData)}
                onChange={e => type !== 'View' && handleTehsilChange(e ?? '')}
                styles={inputStyle}
                error={
                  formik.errors.tehsilId &&
                  (formik.touched.tehsilId || formik.submitCount > 0)
                    ? (formik.errors.tehsilId as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="postalAddress"
                label="Address"
                name="postalAddress"
                placeholder="Enter your address..."
                value={formik.values?.postalAddress ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('postalAddress', e)
                }
                styles={inputStyle}
                error={
                  formik.errors.postalAddress &&
                  (formik.touched.postalAddress || formik.submitCount > 0)
                    ? formik.errors.postalAddress
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
                id="Ownership"
                label="Ownership"
                placeholder="Select Ownership..."
                data={organizeDropDownData(referenceData?.ownership)}
                value={formik?.values?.ownershipId ?? ''}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('ownershipId', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="soilType"
                label="Soil Type"
                placeholder="Select Soil Type..."
                data={organizeDropDownData(referenceData?.soilType)}
                value={formik.values?.soilTypeId}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('soilTypeId', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                id="irrigationMethod"
                label="Irrigation Method"
                placeholder="Select Method..."
                data={organizeDropDownData(referenceData?.irrigationMethod)}
                value={formik.values?.irrigationMethodId}
                onChange={value =>
                  type !== 'View' &&
                  formik.setFieldValue('irrigationMethodId', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <NumberInput
                id="estimatedCost"
                label="Estimate Cost"
                name="estimatedCost"
                prefix="Rs."
                min={0}
                placeholder="Enter your Estimate Cost..."
                value={numberInputValue(formik.values?.estimatedCost)}
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
          {/* <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Planting Method
          </Title>
          <Grid gutter="md">
            {organizeDropDownData(referenceData?.plantingMethod)?.map(card => (
              <Grid.Col key={card.label} span={{ base: 12, md: 6, lg: 3 }}>
                <GlassCard
                  label={card.label}
                  value={card.value}
                  isSelected={formik.values?.plantingMethodId === card.value}
                  onSelected={label =>
                    type !== 'View' &&
                    formik.setFieldValue('plantingMethodId', label)
                  }
                />
              </Grid.Col>
            ))}

            {formik.values?.plantingMethodId ===
              organizeDropDownData(referenceData?.plantingMethod)?.find(
                e => e.label === 'Beds'
              )?.value && (
              <Grid.Col span={{ base: 12, md: 3, lg: 4 }}>
                <NumberInput
                  id="noOfBeds"
                  label="Number of beds"
                  name="Number of beds"
                  allowDecimal={false}
                  min={0}
                  max={100}
                  placeholder="Enter number of beds..."
                  value={numberInputValue(formik.values?.noOfBeds)}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('noOfBeds', e)
                  }
                  styles={inputStyle}
                  error={
                    formik.errors.noOfBeds &&
                    (formik.touched.noOfBeds || formik.submitCount > 0)
                      ? formik.errors.noOfBeds
                      : null
                  }
                />
              </Grid.Col>
            )}
            {formik.values?.plantingMethodId ===
              organizeDropDownData(referenceData?.plantingMethod)?.find(
                e => e.label === 'Beds'
              )?.value && (
              <Grid.Col span={{ base: 12, md: 3, lg: 4 }}>
                <NumberInput
                  id="budWidth"
                  label="Width of beds"
                  name="Width of  beds"
                  min={0}
                  placeholder="Enter width of Beds..."
                  value={numberInputValue(formik.values?.width)}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('width', e)
                  }
                  styles={inputStyle}
                  error={
                    formik.errors.width &&
                    (formik.touched.width || formik.submitCount > 0)
                      ? formik.errors.width
                      : null
                  }
                />
              </Grid.Col>
            )}
            {formik.values?.plantingMethodId ===
              organizeDropDownData(referenceData?.plantingMethod)?.find(
                e => e.label === 'Beds'
              )?.value && (
              <Grid.Col span={{ base: 12, md: 3, lg: 4 }}>
                <NumberInput
                  id="bedsLength"
                  label="Length of beds"
                  name="Length of beds"
                  min={0}
                  placeholder="Enter length of Beds..."
                  value={numberInputValue(formik.values?.length)}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('length', e)
                  }
                  styles={inputStyle}
                  error={
                    formik.errors.length &&
                    (formik.touched.length || formik.submitCount > 0)
                      ? formik.errors.width
                      : null
                  }
                />
              </Grid.Col>
            )}
          </Grid> */}

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
                data={organizeDropDownData(referenceData?.areaUnit)}
                value={formik.values?.areaUnitId}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('areaUnitId', value)
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
                formik.setFieldValue('areaUnit', '1');
                setMapModalDetails(initialMapModalInfo);
              }}
              onClose={() => setMapModalDetails(initialMapModalInfo)}
              isReadOnly={type === 'View'}
              type={type}
              data={mapModalDetails?.data}
            />
          </Modal>
        </form>
      </Paper>
    </main>
  );
};

export default ManageLand;
