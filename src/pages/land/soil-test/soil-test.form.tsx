import {
  Grid,
  Group,
  Paper,
  Select,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { IconFileDescription, IconUpload, IconX } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useRef, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { fetchData, postData, putData } from '../../../api/api';
import {
  Notification,
  NumberInput,
  Text,
  TextInput,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle } from '../../../theme/common.style';
import { initialNotification } from '../../../utils/common/constant.objects';
import {
  capitalizeFirstLetter,
  organizeDropDownData,
} from '../../../utils/common/function';

const SoilTestForm = ({
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

  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleReject = (rejectedFiles: FileRejection[]) => {
    setFile(null);
  };

  const renderPreview = () => {
    if (!file) return null;

    const fileType = file.type.split('/')[0];
    if (fileType === 'image') {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          style={{ width: '100%', height: 'auto', marginTop: 16 }}
        />
      );
    } else if (fileType === 'application' && file.type === 'application/pdf') {
      return (
        <object
          data={URL.createObjectURL(file)}
          type="application/pdf"
          style={{ width: '100%', height: '500px', marginTop: 16 }}
        >
          <embed src={URL.createObjectURL(file)} type="application/pdf" />
        </object>
      );
    } else {
      return (
        <div style={{ marginTop: 16 }}>
          <Text size="sm">File: {file.name}</Text>
          <Text size="sm">Type: {file.type}</Text>
        </div>
      );
    }
  };

  const navigate = useNavigate();
  const [cropData, setCropData] = useState<any>();

  const { referenceData } = useSelector((state: any) => state?.referenceData);

  const [isLoading, setIsLoading] = useState(false);
  const soilNutrientContentFields = [
    'nitrogen',
    'phosphorus',
    'potassium',
    'sulfur',
    'zinc',
    'iron',
    'manganese',
    'copper',
    'boron',
    'calcium',
    'magnesium',
  ];

  useEffect(() => {
    if (id && (type === 'Update' || type === 'View'))
      fetchData(`${apiEndPoint}/${id}`)
        .then((data: any) => setCropData(data))
        .catch(err => console.error(err));
  }, [apiEndPoint, id, type]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? cropData
        : {
            laboratoryName: '',
            testSampleDate: null,
            testReportDate: null,
            soilTypeId: '',
            soilColor: '',
            pH: '',
            eC: '',
            nitrogen: 0,
            phosphorus: 0,
            potassium: 0,
            sulfur: 0,
            zinc: 0,
            iron: 0,
            manganese: 0,
            copper: 0,
            boron: 0,
            calcium: 0,
            magnesium: 0,
            landId: id,
          },
    validationSchema: Yup.object().shape({
      testReportDate: Yup.date().required('Test Report Date is required'),
      soilTypeId: Yup.string().required('Soil Type is required'),
      pH: Yup.number().min(0).required('pH is required'),
      eC: Yup.number().min(0).required('EC is required'),
    }),
    onSubmit: values => {
      setIsLoading(true);
      if (type !== 'Update')
        postData(`/${apiEndPoint}`, values)
          .then(() => {
            setNotification({
              isSuccess: true,
              message: `${pageLabel} created successfully`,
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
          // { title: 'Lands', href: '/lands' },
          // { title: 'Soil Test', href: '/soil-tests' },
          { title: `${type} ${pageLabel}`, href: '' },
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
            Laboratory Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                id="labName"
                label="Name"
                name="Name"
                placeholder="Enter your laboratory name..."
                value={formik.values?.laboratoryName ?? ''}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('laboratoryName', e)
                }
                styles={inputStyle}
                error={
                  (formik.touched.laboratoryName || formik.submitCount > 0) &&
                  formik.errors.laboratoryName
                    ? formik.errors.laboratoryName
                    : null
                }
              />
            </Grid.Col>
          </Grid>
          <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Date Information
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateTimePicker
                id="reportDate"
                label="Report Date"
                placeholder="Select Report Date"
                styles={inputStyle}
                value={
                  formik.values?.testReportDate &&
                  new Date(formik?.values?.testReportDate)
                }
                onChange={value =>
                  formik.setFieldValue('testReportDate', value)
                }
                error={
                  (formik.touched.testReportDate || formik.submitCount > 0) &&
                  formik.errors.testReportDate
                    ? (formik.errors.testReportDate as ReactNode)
                    : null
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <DateTimePicker
                id="sampleDate"
                label="Sample Date"
                placeholder="Select Sample Date"
                styles={inputStyle}
                value={
                  formik.values?.testSampleDate &&
                  new Date(formik?.values?.testSampleDate)
                }
                onChange={value =>
                  formik.setFieldValue('testSampleDate', value)
                }
                error={
                  (formik.touched.testSampleDate || formik.submitCount > 0) &&
                  formik.errors.testSampleDate
                    ? (formik.errors.testSampleDate as ReactNode)
                    : null
                }
              />
            </Grid.Col>
          </Grid>

          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Soil Sample Identification
          </Title>
          <Grid gutter="md">
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
                error={
                  (formik.touched.soilTypeId || formik.submitCount > 0) &&
                  formik.errors.soilTypeId
                    ? (formik.errors.soilTypeId as ReactNode)
                    : null
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Soil Color"
                id="soilColor"
                name="soilColor"
                placeholder="Enter color of the Soil"
                value={formik.values?.soilColor}
                onChange={e =>
                  type !== 'View' && formik.setFieldValue('soilColor', e)
                }
                styles={inputStyle}
                error={
                  (formik.touched.soilColor || formik.submitCount > 0) &&
                  formik.errors.soilColor
                    ? formik.errors.soilColor
                    : null
                }
              />
            </Grid.Col>
          </Grid>
          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Soil Chemical Properties
          </Title>
          <Grid gutter="md">
            {['pH', 'eC'].map(item => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={item}>
                <NumberInput
                  id={item}
                  label={capitalizeFirstLetter(item)}
                  name={item}
                  placeholder={`Enter value of ${capitalizeFirstLetter(item)}...`}
                  value={
                    formik?.values &&
                    formik.values[item] !== undefined &&
                    formik?.values[item] !== 0
                      ? formik?.values[item]
                      : '' ?? ''
                  }
                  min={0}
                  max={100}
                  decimalScale={2}
                  hideControls
                  suffix="%"
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue(item, e)
                  }
                  styles={inputStyle}
                  error={
                    formik.errors[item] &&
                    (formik.touched[item] || formik.submitCount > 0)
                      ? formik.errors[item]
                      : null
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Soil Nutrient Content
          </Title>
          <Grid gutter="md">
            {soilNutrientContentFields?.map(item => (
              <Grid.Col span={{ base: 6, md: 6, lg: 4 }} key={item}>
                <NumberInput
                  id={item}
                  label={capitalizeFirstLetter(item)}
                  name={item}
                  min={0}
                  max={100}
                  decimalScale={2}
                  suffix="%"
                  hideControls
                  placeholder={`Enter value of ${capitalizeFirstLetter(item)}...`}
                  value={
                    formik?.values &&
                    formik.values[item] !== undefined &&
                    formik.values[item] !== 0
                      ? formik.values[item]
                      : '' ?? ''
                  }
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue(item, e)
                  }
                  styles={inputStyle}
                  error={
                    formik.errors[item] &&
                    (formik.touched[item] || formik.submitCount > 0)
                      ? formik.errors[item]
                      : null
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
          <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
            Attachment
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Dropzone
                onDrop={handleDrop}
                onReject={handleReject}
                maxSize={5 * 1024 ** 2}
              >
                {file ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    {renderPreview()}
                  </div>
                ) : (
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: 'none' }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-blue-6)',
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-red-6)',
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconFileDescription
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-dimmed)',
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text size="xl" inline>
                        Drag attachments here or click to select files
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Attach file for soil test, but file should not exceed 5
                        MB
                      </Text>
                    </div>
                  </Group>
                )}
              </Dropzone>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </main>
  );
};

export default SoilTestForm;
