import { Grid, Title, rem, useMantineTheme } from '@mantine/core';
import { IconMap } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../../api/api';
import {
  Button,
  Modal,
  Notification,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle } from '../../../theme/common.style';
import { initialNotification } from '../../../utils/common/constant.objects';
import {
  numberInputValue,
  organizeDropDownData,
} from '../../../utils/common/function';

import { initialMapModalInfo } from '../land/initial.values';
import LocationSearch from '../land/searchLocation';

const ManageBed = ({
  type = 'Add',
  pageLabel,
  apiEndPoint,
}: {
  type: 'Add' | 'View' | 'Update';
  pageLabel: string;
  apiEndPoint: string;
}) => {
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

  const { referenceData } = useSelector((state: any) => state?.referenceData);

  useEffect(() => {
    if (id)
      fetchData(`${apiEndPoint}/${id}`)
        .then((data: any) => {
          setLandData(data);
        })
        .catch((err: any) => console.error(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? landData
        : {
            // Information
            name: '',

            // Dimensional information
            width: '',
            length: '',

            // Marking information
            coordinates: [],
            area: 0,
            areaUnitId: '1',

            farmId: currentUser?.farmId?.toString(),
            landId: id,
          },

    validationSchema: Yup.object().shape({
      name: Yup.string().required('Land Name is required'),
      coordinates: Yup.array().when([], (coordinates, schema) => {
        if (coordinates && coordinates.length > 0) {
          return schema.min(2, 'Coordinates are required').nullable();
        }
        return schema.nullable();
      }),
    }),
    onSubmit: values => {
      setIsLoading(true);
      if (type !== 'Update')
        postData(`/${apiEndPoint}`, values) // Send form data to the server
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
        putData(`/${apiEndPoint}/${id}`, values)
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: `${pageLabel} Updated successfully`,
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
    <main className={'w-full h-screen relative bg-darkColors-700 mb-4'}>
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
        breadcrumbsText={`Manage Farm ${pageLabel}`}
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
            Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="name"
                label="Bed Name"
                name="name"
                placeholder="Enter your bed name..."
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
            Dimensional Information
          </Title>
          <Grid gutter="md">
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
                label="Area"
                name="area"
                placeholder="Enter your Area..."
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
                placeholder="Select Area Unit..."
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

export default ManageBed;
