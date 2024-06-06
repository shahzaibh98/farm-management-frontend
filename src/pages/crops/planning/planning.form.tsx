/* eslint-disable react/jsx-key */
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { useSelector } from 'react-redux';
import { fetchData, postData, putData } from '../../../api/api';
import {
  Notification,
  NumberInput,
  Paper,
  Select,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle, textAreaStyle } from '../../../theme/common.style';
import { initialNotification } from '../../../utils/common/constant.objects';

// Importing custom components from the 'concave.agri' project
import {
  Grid,
  Group,
  Radio,
  Stepper,
  Textarea,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCircleCheck,
  IconShieldCheck,
  IconUserCheck,
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../../concave.agri/components';
import {
  calculateTotalCost,
  cleanObject,
} from '../../../utils/common/function';
import {
  getDistricts,
  getDivisions,
  getTehsils,
  handleDistrict,
  handleDivision,
  handleTehsil,
} from '../../../utils/common/location.Helper';
import {
  costOfTransport,
  dungManagement,
  farmCost,
  fertilizers,
  harvestingCost,
  initialCropPlanFormState,
  irrigation,
  landPreparation,
  otherExpenses,
  pestControl,
  seedAndSowing,
  weeding,
} from './initial.values';

const CropPlanningForm = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params
  const { cropId } = useParams();
  const [active, setActive] = useState(0);

  const navigate = useNavigate();
  const [data, setData] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);

  const { locationData } = useSelector((state: any) => state?.referenceData);

  useEffect(() => {
    if (id)
      fetchData(`crop-plan/${id}`)
        .then((data: any) => setData(data))
        .catch(err => console.log(err));
  }, [id]);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      type === 'Update' || type === 'View'
        ? data
        : { ...initialCropPlanFormState, refFarmCropId: cropId },
    onSubmit: values => {
      // Handle form submission
      setIsLoading(true);
      if (type !== 'Update')
        postData('/crop-plan', cleanObject(values)) // Send form data to the server
          .then(() => {
            // Handle successful form submission
            setNotification({
              isSuccess: true,
              message: 'Crop plan created successfully',
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
        putData(`/crop-plan/${values?.farmId}`, cleanObject(values))
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

  const handleNotificationClose = () => setNotification(initialNotification);

  useEffect(() => {
    formik.values && calculateProductionCost();
  }, [formik.values]);

  function calculateProductionCost() {
    let costOfProductionAtMandiGate = 0;
    let costOfProductionAtFarmGate = 0;

    // Helper function to calculate cost
    const calculateCost = (items: any) => {
      return items?.reduce((total: any, item: any) => {
        item?.data?.forEach((dataItem: any) => {
          const field = dataItem.field;
          if (
            dataItem.type === 'Unit And Value' ||
            dataItem.type === 'Unit Select and Value'
          ) {
            if (formik.values && formik.values[field + 'TotalPrice']) {
              total += formik.values[field + 'TotalPrice'];
            }
          } else if (dataItem.type === 'Value') {
            if (formik.values && formik.values[field + 'AvgCost']) {
              total += formik.values[field + 'AvgCost'];
            }
          }
        });
        return total;
      }, 0);
    };

    costOfProductionAtFarmGate = calculateCost(farmCost);
    costOfProductionAtMandiGate = calculateCost(costOfTransport);

    const totalProductionCost =
      costOfProductionAtFarmGate + costOfProductionAtMandiGate;
    const grossRevenue =
      formik.values && formik.values['estRevenue'] * formik.values['totalAcre'];
    const profitPerAcre =
      formik.values && formik.values['estRevenue'] - totalProductionCost;
    const totalProfit =
      formik.values && profitPerAcre * formik.values['totalAcre'];

    formik.setFieldValue(
      'costOfProductionAtFarmGate',
      costOfProductionAtFarmGate
    );
    formik.setFieldValue('costOfProductionAtMandiGate', totalProductionCost);
    formik.setFieldValue('grossRevenue', grossRevenue);
    formik.setFieldValue('profitPerAcre', profitPerAcre);
    formik.setFieldValue('totalProfit', totalProfit);
  }

  const onChangeAvgCost = (field: string, e: number | string) => {
    if (typeof e === 'number' && !isNaN(e)) {
      // Get the average unit from formik values
      const avgUnit = Number(formik.values[`${field}AvgUnit`]);

      // Check if avgUnit is a valid number
      if (!isNaN(avgUnit)) {
        formik.setFieldValue(`${field}AvgCost`, e);
        formik.setFieldValue(`${field}TotalPrice`, e * avgUnit);
      }
    }
  };

  const onChangeAvgUnit = (field: string, e: number | string) => {
    if (typeof e === 'number' && !isNaN(e)) {
      // Get the average cost from formik values
      const avgCost = Number(formik.values[`${field}AvgCost`]);

      // Check if avgCost is a valid number
      if (!isNaN(avgCost)) {
        formik.setFieldValue(`${field}AvgUnit`, e);
        formik.setFieldValue(`${field}TotalPrice`, e * avgCost);
      }
    }
  };

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
        headerText={'Crops Planning'}
        breadcrumbs={[{ title: 'Crops Planning', href: '' }]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} Crops Planning`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <Paper
        shadow="xs"
        className="flex relative justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <form>
          <Stepper
            active={active}
            onStepClick={setActive}
            mt={15}
            completedIcon={
              <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
            }
            orientation="vertical"
          >
            <Stepper.Step
              icon={
                <IconUserCheck style={{ width: rem(18), height: rem(18) }} />
              }
            ></Stepper.Step>
            <Stepper.Step>
              <>
                <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Planting Details
                </Title>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="days to emerge"
                      id="days to emerge"
                      name="days to emerge"
                      placeholder="Enter Days to Emerge"
                      suffix=" Days"
                      allowDecimal={false}
                      allowNegative={false}
                      min={1}
                      value={formik.values?.daysToEmerge}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue('daysToEmerge', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.noOfPlantings ||
                          formik.submitCount > 0) &&
                        formik.errors.noOfPlantings
                          ? formik.errors.noOfPlantings
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Row Spacing"
                      id="rowSpacing"
                      name="rowSpacing"
                      placeholder="Enter row Spacing"
                      value={formik.values?.rowSpacing}
                      suffix=" cm"
                      allowNegative={false}
                      onChange={e =>
                        type !== 'View' && formik.setFieldValue('rowSpacing', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.rowSpacing || formik.submitCount > 0) &&
                        formik.errors.rowSpacing
                          ? formik.errors.rowSpacing
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Plant Spacing"
                      id="plantingSpacing"
                      name="plantingSpacing"
                      placeholder="Enter plant spacing"
                      value={formik.values?.plantSpacing}
                      suffix=" cm"
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('plantSpacing', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.plantSpacing ||
                          formik.submitCount > 0) &&
                        formik.errors.plantSpacing
                          ? formik.errors.plantSpacing
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Planting Depth"
                      id="plantingDepth"
                      name="plantingDepth"
                      placeholder="Enter plant depth"
                      value={formik.values?.plantingDepth}
                      suffix=" cm"
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('plantingDepth', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.plantingDepth ||
                          formik.submitCount > 0) &&
                        formik.errors.plantingDepth
                          ? formik.errors.plantingDepth
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Average Height "
                      id="averageHeight"
                      name="averageHeight"
                      placeholder="Enter Average Height "
                      value={formik.values?.averageHeight}
                      suffix=" cm"
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('averageHeight', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.averageHeight ||
                          formik.submitCount > 0) &&
                        formik.errors.averageHeight
                          ? formik.errors.averageHeight
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Select
                      label="Start Method"
                      id="startMethod"
                      name="startMethod"
                      placeholder="Enter start method"
                      data={[
                        'Bulbs',
                        'Container',
                        'Direct sow',
                        'Grafting',
                        'Grown in Trays',
                        'Root Stock',
                        'Start in Trays',
                        'Transplant',
                        'Transplant in Ground',
                        'Other',
                      ]}
                      value={formik.values?.startMethod}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue('startMethod', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.startMethod ||
                          formik.submitCount > 0) &&
                        formik.errors.startMethod
                          ? (formik.errors.startMethod as ReactNode)
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Est. Germination Rate "
                      id="estGerminationRate"
                      name="estGerminationRate"
                      placeholder="Enter estimated Germination Rate"
                      value={formik.values?.estGerminationRate}
                      suffix=" %"
                      min={0}
                      max={100}
                      decimalScale={2}
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('estGerminationRate', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.estGerminationRate ||
                          formik.submitCount > 0) &&
                        formik.errors.estGerminationRate
                          ? formik.errors.estGerminationRate
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Seed Per Hole"
                      id="seedPerHole"
                      name="seedPerHole"
                      placeholder="Enter seed per hole"
                      value={formik.values?.seedsPerHole}
                      min={0}
                      allowNegative={false}
                      allowDecimal={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('seedsPerHole', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.seedsPerHole ||
                          formik.submitCount > 0) &&
                        formik.errors.seedsPerHole
                          ? formik.errors.seedsPerHole
                          : null
                      }
                    />
                  </Grid.Col>
                </Grid>
                <Grid className="mb-16">
                  <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                    <Textarea
                      placeholder="Enter Instructions For Crop"
                      label="Instructions"
                      value={formik.values?.notesInstructions}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue(
                          'notesInstructions',
                          e.target.value
                        )
                      }
                      autosize
                      minRows={8}
                      styles={textAreaStyle}
                    />
                  </Grid.Col>
                </Grid>
              </>
            </Stepper.Step>
            <Stepper.Step
              icon={
                <IconShieldCheck style={{ width: rem(18), height: rem(18) }} />
              }
            >
              <>
                <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Harvest Details
                </Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Days to Maturity"
                      id="daysToMaturity"
                      name="daysToMaturity"
                      placeholder="Enter days to maturity"
                      value={formik.values?.daysToMaturity}
                      suffix=" days"
                      allowNegative={false}
                      min={0}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue('daysToMaturity', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.daysToMaturity ||
                          formik.submitCount > 0) &&
                        formik.errors.daysToMaturity
                          ? formik.errors.daysToMaturity
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Harvest window"
                      id="harvestWindow"
                      name="harvestWindow"
                      placeholder="Enter harvest window"
                      value={formik.values?.harvestWindow}
                      suffix=" days"
                      allowNegative={false}
                      min={0}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue('harvestWindow', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.harvestWindow ||
                          formik.submitCount > 0) &&
                        formik.errors.harvestWindow
                          ? formik.errors.harvestWindow
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Est. loss Rate "
                      id="estLossRate"
                      name="estLossRate"
                      placeholder="Enter estimated loss rate"
                      value={formik.values?.estLossRate}
                      suffix=" %"
                      min={0}
                      max={100}
                      decimalScale={2}
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('estLossRate', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.estLossRate ||
                          formik.submitCount > 0) &&
                        formik.errors.estLossRate
                          ? formik.errors.estLossRate
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Select
                      label="Harvest Units"
                      id="harvestUnits"
                      name="harvestUnits"
                      placeholder="Enter harvest units"
                      data={['KG', 'Maund']}
                      value={formik.values?.harvestUnits}
                      onChange={e =>
                        type !== 'View' &&
                        formik.setFieldValue('harvestUnits', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.harvestUnits ||
                          formik.submitCount > 0) &&
                        formik.errors.harvestUnits
                          ? (formik.errors.harvestUnits as ReactNode)
                          : null
                      }
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label="Est. Revenue Amount"
                      id="estRevenueAmount"
                      name="estRevenueAmount"
                      placeholder="Enter estimated revenue amount"
                      value={formik.values?.estRevenue}
                      prefix={'Rs. '}
                      min={0}
                      decimalScale={2}
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' && formik.setFieldValue('estRevenue', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.estRevenue || formik.submitCount > 0) &&
                        formik.errors.estRevenue
                          ? formik.errors.estRevenue
                          : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <NumberInput
                      label={'Est. Yield Per Acre '}
                      id="estYield"
                      name="estYield"
                      placeholder="Enter Yield Per Acre"
                      value={formik.values?.estYieldPerAcre}
                      suffix=" Maund"
                      min={0}
                      decimalScale={2}
                      allowNegative={false}
                      onChange={(e: any) =>
                        type !== 'View' &&
                        formik.setFieldValue('estYieldPerAcre', e)
                      }
                      styles={inputStyle}
                      error={
                        (formik.touched.estYieldPerAcre ||
                          formik.submitCount > 0) &&
                        formik.errors.estYieldPerAcre
                          ? formik.errors.estYieldPerAcre
                          : null
                      }
                    />
                  </Grid.Col>
                </Grid>
              </>
            </Stepper.Step>
            <Stepper.Step
              icon={
                <IconShieldCheck style={{ width: rem(18), height: rem(18) }} />
              }
            >
              <>
                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Land Preparation
                </Title>
                <Grid>
                  {landPreparation.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        <div className="flex flex-row mt-2 space-x-4">
                          <NumberInput
                            id={preparation.field}
                            placeholder={`Avg. Unit in ${preparation.unitName}`}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgUnit']
                            }
                            suffix={` ${preparation.unitName}`}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgUnit(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field + 'Cost'}
                            placeholder={'Avg. Cost Per Hour'}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgCost']
                            }
                            prefix="Rs. "
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgCost(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field}
                            placeholder={'Total Price'}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'TotalPrice']
                            }
                            prefix="Rs. "
                            hideControls={true}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            styles={inputStyle}
                          />
                        </div>
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Seed & Sowing
                </Title>
                <Grid>
                  {seedAndSowing.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        <div className="flex flex-row mt-2 space-x-4">
                          <NumberInput
                            id={preparation.field}
                            placeholder={`Avg. Unit in ${preparation.unitName}`}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgUnit']
                            }
                            suffix={` ${preparation.unitName}`}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgUnit(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field + 'Cost'}
                            placeholder={preparation.costLabel}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgCost']
                            }
                            prefix="Rs. "
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgCost(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field}
                            placeholder={'Total Price'}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'TotalPrice']
                            }
                            prefix="Rs. "
                            hideControls={true}
                            onChange={e => {
                              !!false && console.log(e);
                            }}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            styles={inputStyle}
                          />
                        </div>
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Irrigation
                </Title>
                <Grid>
                  {irrigation.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Unit And Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <NumberInput
                              id={preparation.field}
                              placeholder={`Avg. Unit in ${preparation.unitName}`}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgUnit']
                              }
                              suffix={` ${preparation.unitName}`}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e => {
                                formik.setFieldValue(
                                  `${preparation.field}AvgUnit`,
                                  e
                                );

                                onChangeAvgUnit(preparation.field, e);
                              }}
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                        {preparation.type === 'Value' && (
                          <Grid>
                            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                              <NumberInput
                                mt={5}
                                mr={10}
                                placeholder={preparation.costLabel}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                                }
                                prefix="Rs. "
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgCost`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </Grid.Col>
                          </Grid>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Fertilizer
                </Title>
                <Grid>
                  {fertilizers.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Unit And Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <NumberInput
                              id={preparation.field}
                              placeholder={`Avg. Unit in ${preparation.unitName}`}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgUnit']
                              }
                              suffix={` ${preparation.unitName}`}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgUnit(preparation.field, e)
                              }
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                        {preparation.type === 'Value' && (
                          <Grid>
                            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                              <NumberInput
                                mt={5}
                                mr={10}
                                placeholder={preparation.costLabel}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                                }
                                prefix="Rs. "
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgCost`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </Grid.Col>
                          </Grid>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Pesticides
                </Title>
                <Grid>
                  {pestControl.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Unit And Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <NumberInput
                              id={preparation.field}
                              placeholder={`Avg. Unit in ${preparation.unitName}`}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgUnit']
                              }
                              suffix={` ${preparation.unitName}`}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgUnit(preparation.field, e)
                              }
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                        {preparation.type === 'Unit Select and Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <div>
                              <Radio.Group
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'Unit']
                                }
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field + 'Unit'}`,
                                    e
                                  );
                                }}
                              >
                                <Group mt="xs">
                                  <Radio value="Liter" label="Liter" />
                                  <Radio value="KG" label="KG" />
                                </Group>
                              </Radio.Group>
                              <NumberInput
                                mt={2}
                                id={preparation.field}
                                placeholder={`Avg. Unit  ${preparation.unitName ? `in ${preparation.unitName}` : ''}`}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgUnit']
                                }
                                suffix={` ${preparation.unitName}`}
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgUnit`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </div>
                            <NumberInput
                              mt={32}
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              mt={32}
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Weedicides
                </Title>
                <Grid>
                  {weeding.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Unit And Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <NumberInput
                              id={preparation.field}
                              placeholder={`Avg. Unit in ${preparation.unitName}`}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgUnit']
                              }
                              suffix={` ${preparation.unitName}`}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgUnit(preparation.field, e)
                              }
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              isReadOnly={true}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                        {preparation.type === 'Unit Select and Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <div>
                              <Radio.Group
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'Unit']
                                }
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field + 'Unit'}`,
                                    e
                                  );
                                }}
                              >
                                <Group mt="xs">
                                  <Radio value="Liter" label="Liter" />
                                  <Radio value="KG" label="KG" />
                                </Group>
                              </Radio.Group>
                              <NumberInput
                                mt={2}
                                id={preparation.field}
                                placeholder={`Avg. Unit  ${preparation.unitName ? `in ${preparation.unitName}` : ''}`}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgUnit']
                                }
                                suffix={` ${preparation.unitName}`}
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgUnit`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </div>
                            <NumberInput
                              mt={32}
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              id={preparation.field}
                              mt={32}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Dung
                </Title>
                <Grid>
                  {dungManagement.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        <div className="flex flex-row mt-2 space-x-4">
                          <NumberInput
                            id={preparation.field}
                            placeholder={`Avg. Unit in ${preparation.unitName}`}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgUnit']
                            }
                            suffix={` ${preparation.unitName}`}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgUnit(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field + 'Cost'}
                            placeholder={preparation.costLabel}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgCost']
                            }
                            prefix="Rs. "
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgCost(preparation.field, e)
                            }
                            styles={inputStyle}
                          />

                          <NumberInput
                            id={preparation.field}
                            placeholder={'Total Price'}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'TotalPrice']
                            }
                            prefix="Rs. "
                            hideControls={true}
                            onChange={e => {
                              !!false && console.log(e);
                            }}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            styles={inputStyle}
                          />
                        </div>
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Harvesting
                </Title>
                <Grid>
                  {harvestingCost.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        <div className="flex flex-row mt-2 space-x-4">
                          <NumberInput
                            id={preparation.field}
                            placeholder={`Avg. Unit in ${preparation.unitName}`}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgUnit']
                            }
                            suffix={` ${preparation.unitName}`}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e =>
                              onChangeAvgUnit(preparation.field, e)
                            }
                            styles={inputStyle}
                          />
                          <NumberInput
                            id={preparation.field + 'Cost'}
                            placeholder={preparation.costLabel}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'AvgCost']
                            }
                            prefix="Rs. "
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            onChange={e => {
                              formik.setFieldValue(
                                `${preparation.field}AvgCost`,
                                e
                              );
                            }}
                            styles={inputStyle}
                          />

                          <NumberInput
                            id={preparation.field}
                            placeholder={'Total Price'}
                            value={
                              formik.values &&
                              formik.values[preparation.field + 'TotalPrice']
                            }
                            prefix="Rs. "
                            hideControls={true}
                            onChange={e => {
                              !!false && console.log(e);
                            }}
                            min={0}
                            decimalScale={2}
                            allowNegative={false}
                            styles={inputStyle}
                          />
                        </div>
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Cost of Transport
                </Title>
                <Grid>
                  {costOfTransport.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Unit And Value' && (
                          <div className="flex flex-row mt-2 space-x-4">
                            <NumberInput
                              id={preparation.field}
                              placeholder={`Avg. Unit in ${preparation.unitName}`}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgUnit']
                              }
                              suffix={` ${preparation.unitName}`}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgUnit(preparation.field, e)
                              }
                              styles={inputStyle}
                            />
                            <NumberInput
                              id={preparation.field + 'Cost'}
                              placeholder={preparation.costLabel}
                              value={
                                formik.values &&
                                formik.values[preparation.field + 'AvgCost']
                              }
                              prefix="Rs. "
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              onChange={e =>
                                onChangeAvgCost(preparation.field, e)
                              }
                              styles={inputStyle}
                            />

                            <NumberInput
                              id={preparation.field}
                              placeholder={'Total Price'}
                              value={calculateTotalCost(
                                formik.values &&
                                  formik.values[preparation.field + 'AvgUnit'],
                                formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                              )}
                              prefix="Rs. "
                              hideControls={true}
                              onChange={e => {
                                !!false && console.log(e);
                              }}
                              min={0}
                              decimalScale={2}
                              allowNegative={false}
                              styles={inputStyle}
                            />
                          </div>
                        )}
                        {preparation.type === 'Value' && (
                          <Grid>
                            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                              <NumberInput
                                mt={5}
                                mr={10}
                                placeholder={preparation.costLabel}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                                }
                                prefix="Rs. "
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgCost`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </Grid.Col>
                          </Grid>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>
                <Title order={3} c={theme.colors.darkColors[2]} mt={10} mb={15}>
                  Other Expense
                </Title>
                <Grid>
                  {otherExpenses.map(preparation => (
                    <Grid.Col
                      key={preparation.field}
                      span={{ base: 12, md: 6, lg: 6 }}
                    >
                      <div className="flex flex-col" key={preparation.field}>
                        <Text fw={700} c="rgb(75 85 99)" size="md">
                          {preparation.label}
                        </Text>
                        {preparation.type === 'Value' && (
                          <Grid>
                            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                              <NumberInput
                                mt={5}
                                mr={10}
                                placeholder={preparation.costLabel}
                                value={
                                  formik.values &&
                                  formik.values[preparation.field + 'AvgCost']
                                }
                                prefix="Rs. "
                                min={0}
                                decimalScale={2}
                                allowNegative={false}
                                onChange={e => {
                                  formik.setFieldValue(
                                    `${preparation.field}AvgCost`,
                                    e
                                  );
                                }}
                                styles={inputStyle}
                              />
                            </Grid.Col>
                          </Grid>
                        )}
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>
                <Title order={3} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                  Estimate Profit
                </Title>
                <Grid>
                  <Grid.Col>
                    <Text>Cost Of Production At Farm Gate</Text>
                    <Text>
                      {formik.values &&
                        formik.values['costOfProductionAtFarmGate']}
                    </Text>
                  </Grid.Col>
                  <Grid.Col>
                    <Text>Cost Of Production At Mandi Gate</Text>
                    <Text>
                      {formik.values &&
                        formik.values['costOfProductionAtMandiGate']}
                    </Text>
                  </Grid.Col>
                  <Grid.Col>
                    <Text>Gross Revenue</Text>
                    <Text>
                      {formik.values && formik.values['grossRevenue']}
                    </Text>
                  </Grid.Col>
                  <Grid.Col>
                    <Text className="mb-16">Total Profit</Text>
                    <Text>{formik.values && formik.values['totalProfit']}</Text>
                  </Grid.Col>
                </Grid>
              </>
            </Stepper.Step>
          </Stepper>
          {active === 0 && (
            <>
              <Title order={2} c={theme.colors.darkColors[2]} mt={25} mb={15}>
                Plan Specifications
              </Title>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Land Type"
                    id="landType"
                    placeholder="select Land Type"
                    // Todo : change to referenece table
                    data={['Irrigated', 'Rainfed']}
                    value={formik.values?.isActive}
                    onChange={value => {
                      type !== 'View' &&
                        formik.setFieldValue('isActive', value);
                    }}
                    styles={inputStyle}
                  />
                </Grid.Col>
              </Grid>
              <Grid gutter={'md'}>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    id="province"
                    label="Province"
                    name="provinceOrState"
                    searchable
                    placeholder="Select province against plan"
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
                    placeholder="Select division against plan"
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
              </Grid>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    id="district"
                    label="District"
                    name="district"
                    searchable
                    placeholder="Select district against plan"
                    value={formik.values?.districtId ?? ''}
                    data={getDistricts(formik.values?.divisionId, locationData)}
                    onChange={e =>
                      type !== 'View' && handleDistrictChange(e ?? '')
                    }
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
                    placeholder="Select tehsil against plan"
                    value={formik.values?.tehsilId ?? ''}
                    data={getTehsils(formik.values?.districtId, locationData)}
                    onChange={e =>
                      type !== 'View' && handleTehsilChange(e ?? '')
                    }
                    styles={inputStyle}
                    error={
                      formik.errors.tehsilId &&
                      (formik.touched.tehsilId || formik.submitCount > 0)
                        ? (formik.errors.tehsilId as ReactNode)
                        : null
                    }
                  />
                </Grid.Col>
              </Grid>
            </>
          )}
        </form>
      </Paper>
    </main>
  );
};

export default CropPlanningForm;
