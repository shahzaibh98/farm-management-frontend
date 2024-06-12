import { Grid, Paper, Select, Title, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../../api/api';
import {
  Notification,
  Text,
  TextInput,
} from '../../../concave.agri/components';
import { FileDropzone } from '../../../concave.agri/components/dropzone';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle } from '../../../theme/common.style';
import { initialNotification } from '../../../utils/common/constant.objects';

const CropForm = ({
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
  const [cropData, setCropData] = useState<any>();

  const { roleId, ...userInfo } = useSelector(
    (state: any) => state?.userInfo?.userInfo
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id)
      fetchData(`${apiEndPoint}/${id}`)
        .then((data: any) => setCropData(data))
        .catch(err => console.error(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? cropData
        : {
            name: '',
            category: '',
            image: '',
            noOfPlantings: '',
            cropType: '',
            startMethod: '',
            plantSpacing: '',
            rowSpacing: '',
            farmId: userInfo?.farmId,
          },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Crop name is required'),
      category: Yup.string().required('Category is required'),
      // image: Yup.string().required('Image is required'),
    }),
    onSubmit: values => {
      setIsLoading(true);
      if (type !== 'Update')
        postData(`/${apiEndPoint}`, values)
          .then(() => {
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
  {
    console.log('Image URL', formik.values?.image);
  }
  return (
    <main className={'w-full min-h-screen relative bg-darkColors-700'}>
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
        breadcrumbs={[
          {
            title: `${type} ${pageLabel} ${type === 'View' ? 'from' : 'to'} System`,
            href: '',
          },
        ]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} ${pageLabel}`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <form>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Crop Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="cropName"
                label="Crop Name"
                name="cropName"
                placeholder="Enter your crop name..."
                value={formik.values?.name ?? ''}
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
              <Select
                label="Crop Category"
                id="status"
                placeholder="Select Category"
                data={[
                  'Important crops',
                  'Fruits and vegetables',
                  'Fodder',
                  'Oily crops commodities',
                  'Pulses',
                  'Browses',
                ]}
                value={formik.values?.category}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('category', value)
                }
                styles={inputStyle}
                error={
                  (formik.touched.category || formik.submitCount > 0) &&
                  formik.errors.category
                    ? (formik.errors.category as ReactNode)
                    : null
                }
              />
            </Grid.Col>
          </Grid>
          <Grid gutter="md">
            <Grid.Col span={{ base: 6 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: 'rgb(75 85 99)',
                }}
              >
                {'Crop'} Image
              </Text>

              <FileDropzone imageURL={formik?.values?.image} />
            </Grid.Col>
          </Grid>

          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Season & Methods
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Crop Season"
                id="status"
                placeholder="Select Crop Season"
                data={['All Season', 'Rabi', 'Kharif']}
                value={formik.values?.cropType}
                onChange={value =>
                  type !== 'View' && formik.setFieldValue('cropType', value)
                }
                styles={inputStyle}
              />
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </main>
  );
};

export default CropForm;
