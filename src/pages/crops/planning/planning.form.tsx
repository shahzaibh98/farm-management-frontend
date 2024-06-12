/* eslint-disable react/jsx-key */
import { DonutChart } from '@mantine/charts';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { useFormik } from 'formik';
import { ReactNode, useEffect, useState } from 'react'; // Importing React hooks
import { FaClipboard } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { fetchData, postData, putData } from '../../../api/api';
import { ReactComponent as HarvestIcon } from '../../../assets/svg/sickle.svg';
import {
  Paper as MantinePaper,
  Notification,
  NumberInput,
  Select,
} from '../../../concave.agri/components';
import GenericHeader from '../../../layout/header.layout';
import { inputStyle, textAreaStyle } from '../../../theme/common.style';
import { initialNotification } from '../../../utils/common/constant.objects';

// Importing custom components from the 'concave.agri' project
import { Grid, Textarea, useMantineTheme } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '../../../concave.agri/components';
import {
  capitalizeFirstLetterSentence,
  cleanObject,
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

import { StepIconProps } from '@material-ui/core/StepIcon';
import { styled } from '@material-ui/core/styles';
import {
  IconCheck,
  IconCoins,
  IconEdit,
  IconPlant,
  IconQuestionMark,
} from '@tabler/icons-react';
import * as React from 'react';

const CropPlanningForm = ({ type = 'Add' }) => {
  const theme = useMantineTheme();
  const { id } = useParams(); // Getting the ID from URL params
  const { cropId } = useParams();
  const { referenceData } = useSelector((state: any) => state?.referenceData);
  const navigate = useNavigate();
  const [data, setData] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);

  const { locationData } = useSelector((state: any) => state?.referenceData);

  const [updatedCal, setUpdatedCal] = useState(true);

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
        putData(`/crop-plan/${id}`, cleanObject(values))
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

    if (formik.values) {
      formik.setFieldValue(
        'costOfProductionAtFarmGate',
        costOfProductionAtFarmGate
      );
      formik.setFieldValue('costOfProductionAtMandiGate', totalProductionCost);
      formik.setFieldValue('grossRevenue', grossRevenue);
      formik.setFieldValue('profitPerAcre', profitPerAcre);
      formik.setFieldValue('totalProfit', totalProfit);
    }
  }

  useEffect(() => {
    calculateProductionCost();
  }, [updatedCal]);

  const onChangeAvgCost = (type: string, field: string, e: number | string) => {
    console.log(e, 'Value');
    if (typeof e === 'number' && !isNaN(e)) {
      // Get the average unit from formik values
      const avgUnit = Number(formik.values[`${field}AvgUnit`]);

      // Check if avgUnit is a valid number
      if (!isNaN(avgUnit) && type !== 'Value') {
        formik.setFieldValue(`${field}AvgCost`, e);
        formik.setFieldValue(`${field}TotalPrice`, e * avgUnit);
      } else {
        formik.setFieldValue(`${field}AvgCost`, e);
      }
    } else if (e === '') {
      formik.setFieldValue(`${field}AvgCost`, '');
      formik.setFieldValue(`${field}TotalPrice`, 0);
    } else {
      formik.setFieldValue(`${field}AvgCost`, 0);
    }
    setUpdatedCal(!updatedCal);
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
    } else if (e === '') {
      formik.setFieldValue(`${field}AvgUnit`, '');
      formik.setFieldValue(`${field}TotalPrice`, 0);
    }
    setUpdatedCal(!updatedCal);
  };

  function getSteps() {
    return [
      { label: 'Plan Specifications', icon: <FaClipboard /> },
      { label: 'Planting Details', icon: <FaClipboard /> },
      { label: 'Harvest Details', icon: <FaClipboard /> },
      { label: 'Cost Estimate', icons: <FaClipboard /> },
      { label: 'Completed', icons: <FaClipboard /> },
    ];
  }

  const headingText = (headingText: string) => (
    <div className="font-montserrat text-lg text-newTheme-300 font-bold mb-6 mt-8">
      {headingText}
    </div>
  );

  const unitAndLandComponent = (preparation: any) => {
    return (
      <>
        <Grid
          key={preparation.field}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <div className="font-montserrat text-[12px] text-[#0F783B] font-semibold">
              {preparation.label}
            </div>
            <div className="font-montserrat text-[10px] text-[#D3BF51] font-semibold">
              {`Total Cost: Rs ${
                preparation?.type === 'Value'
                  ? (formik.values &&
                      formik.values[preparation.field + 'AvgCost']) ??
                    0
                  : (formik.values &&
                      formik.values[preparation.field + 'TotalPrice']) ??
                    0
              }`}
            </div>
          </Grid.Col>
          {preparation.type !== 'Value' && (
            <Grid.Col
              span={{ base: 12, md: 4, lg: 4 }}
              style={{ marginLeft: '10px', marginRight: '10px' }}
            >
              <div className="flex flex-row justify-around items-center">
                <div
                  style={{ width: '15%' }}
                  className="font-montserrat text-[10px] text-[#000000] font-semibold"
                >
                  {preparation.unitLabel}
                </div>
                <div style={{ width: '85%' }}>
                  <NumberInput
                    id={preparation.field}
                    placeholder={`Enter units of ${preparation.unitName}`}
                    value={
                      formik.values &&
                      formik.values[preparation.field + 'AvgUnit']
                    }
                    suffix={` ${preparation.unitName}`}
                    min={0}
                    decimalScale={2}
                    hideControls={true}
                    allowNegative={false}
                    onChange={e => onChangeAvgUnit(preparation.field, e)}
                    styles={inputStyle}
                  />
                </div>
              </div>
            </Grid.Col>
          )}
          <Grid.Col
            span={{ base: 12, md: 4, lg: 4 }}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            <div className="flex flex-row justify-around items-center">
              <div
                style={{ width: '15%' }}
                className="font-montserrat text-[10px] text-[#000000] font-semibold"
              >
                {preparation.costFieldLabel}
              </div>
              <div style={{ width: '85%' }}>
                <NumberInput
                  id={preparation.field + 'Cost'}
                  placeholder={capitalizeFirstLetterSentence(
                    preparation?.costLabel
                  )}
                  value={
                    formik.values &&
                    formik.values[preparation.field + 'AvgCost']
                  }
                  prefix="Rs. "
                  min={0}
                  decimalScale={2}
                  hideControls={true}
                  allowNegative={false}
                  onChange={e =>
                    onChangeAvgCost(preparation.type, preparation.field, e)
                  }
                  styles={inputStyle}
                />
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </>
    );
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <div className="ml-2">
            <div className="font-montserrat text-lg text-newTheme-300 font-bold mb-4 mt-8">
              Crop Specification
            </div>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Select
                  label="Land Type"
                  id="landType"
                  placeholder="select Land Type"
                  data={organizeDropDownData(referenceData?.landType)}
                  value={formik.values?.landTypeId}
                  onChange={value => {
                    type !== 'View' &&
                      formik.setFieldValue('landTypeId', value);
                  }}
                  styles={inputStyle}
                />
              </Grid.Col>

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
            </Grid>
          </div>
        );
      case 1:
        return (
          <div className="ml-2">
            <div className="font-montserrat text-lg text-newTheme-300 font-bold mb-4 mt-8">
              Planting Details
            </div>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="days to emerge"
                  id="days to emerge"
                  name="days to emerge"
                  placeholder="Enter Days to Emerge"
                  suffix=" Days"
                  allowDecimal={false}
                  hideControls={true}
                  allowNegative={false}
                  min={1}
                  value={formik.values?.daysToEmerge}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('daysToEmerge', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.noOfPlantings || formik.submitCount > 0) &&
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
                  value={formik.values?.rowSpacing ?? ''}
                  suffix=" cm"
                  hideControls={true}
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
                  value={formik.values?.plantSpacing ?? ''}
                  suffix=" cm"
                  hideControls={true}
                  allowNegative={false}
                  onChange={(e: any) =>
                    type !== 'View' && formik.setFieldValue('plantSpacing', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.plantSpacing || formik.submitCount > 0) &&
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
                  value={formik.values?.plantingDepth ?? ''}
                  suffix=" cm"
                  hideControls={true}
                  allowNegative={false}
                  onChange={(e: any) =>
                    type !== 'View' && formik.setFieldValue('plantingDepth', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.plantingDepth || formik.submitCount > 0) &&
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
                  value={formik.values?.averageHeight ?? ''}
                  suffix=" cm"
                  hideControls={true}
                  allowNegative={false}
                  onChange={(e: any) =>
                    type !== 'View' && formik.setFieldValue('averageHeight', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.averageHeight || formik.submitCount > 0) &&
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
                  value={formik.values?.startMethod ?? ''}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('startMethod', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.startMethod || formik.submitCount > 0) &&
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
                  value={formik.values?.estGerminationRate ?? ''}
                  suffix=" %"
                  min={0}
                  max={100}
                  decimalScale={2}
                  hideControls={true}
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
                  value={formik.values?.seedsPerHole ?? ''}
                  min={0}
                  hideControls={true}
                  allowNegative={false}
                  allowDecimal={false}
                  onChange={(e: any) =>
                    type !== 'View' && formik.setFieldValue('seedsPerHole', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.seedsPerHole || formik.submitCount > 0) &&
                    formik.errors.seedsPerHole
                      ? formik.errors.seedsPerHole
                      : null
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <Textarea
                  placeholder="Enter Instructions For Crop"
                  label="Instructions"
                  value={formik.values?.notesInstructions ?? ''}
                  onChange={e =>
                    type !== 'View' &&
                    formik.setFieldValue('notesInstructions', e.target.value)
                  }
                  autosize
                  minRows={5}
                  styles={textAreaStyle}
                />
              </Grid.Col>
            </Grid>
          </div>
        );
      case 2:
        return (
          <div className="ml-2">
            <div className="font-montserrat text-lg text-newTheme-300 font-bold mb-4 mt-8">
              Harvest Details
            </div>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <NumberInput
                  label="Days to Maturity"
                  id="daysToMaturity"
                  name="daysToMaturity"
                  placeholder="Enter days to maturity"
                  value={formik.values?.daysToMaturity ?? ''}
                  suffix=" days"
                  hideControls={true}
                  allowNegative={false}
                  min={0}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('daysToMaturity', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.daysToMaturity || formik.submitCount > 0) &&
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
                  value={formik.values?.harvestWindow ?? ''}
                  suffix=" days"
                  hideControls={true}
                  allowNegative={false}
                  min={0}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('harvestWindow', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.harvestWindow || formik.submitCount > 0) &&
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
                  value={formik.values?.estLossRate ?? ''}
                  suffix=" %"
                  min={0}
                  max={100}
                  decimalScale={2}
                  hideControls={true}
                  allowNegative={false}
                  onChange={(e: any) =>
                    type !== 'View' && formik.setFieldValue('estLossRate', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.estLossRate || formik.submitCount > 0) &&
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
                  value={formik.values?.harvestUnits ?? ''}
                  onChange={e =>
                    type !== 'View' && formik.setFieldValue('harvestUnits', e)
                  }
                  styles={inputStyle}
                  error={
                    (formik.touched.harvestUnits || formik.submitCount > 0) &&
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
                  value={formik.values?.estRevenue ?? ''}
                  prefix={'Rs. '}
                  min={0}
                  decimalScale={2}
                  hideControls={true}
                  allowNegative={false}
                  onChange={(e: any) => {
                    if (type !== 'View') {
                      formik.setFieldValue('estRevenue', e);
                      setUpdatedCal(!updatedCal);
                    }
                  }}
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
                  value={formik.values?.estYieldPerAcre ?? ''}
                  suffix=" Maund"
                  min={0}
                  decimalScale={2}
                  hideControls={true}
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
          </div>
        );
      case 3:
        return (
          <div className="ml-2">
            {headingText('Cost Of Land Preparation')}
            {landPreparation.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Seed & Sowing')}
            {seedAndSowing.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Irrigation')}
            {irrigation.map(preparation => unitAndLandComponent(preparation))}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Fertilizer')}
            {fertilizers.map(preparation => unitAndLandComponent(preparation))}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Pesticide')}
            {pestControl.map(preparation => unitAndLandComponent(preparation))}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Weedicides')}
            {weeding.map(preparation => unitAndLandComponent(preparation))}{' '}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Dung')}
            {dungManagement.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Harvesting')}
            {harvestingCost.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Cost of Transport')}
            {costOfTransport.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Other Expenses')}
            {otherExpenses.map(preparation =>
              unitAndLandComponent(preparation)
            )}
            <hr className="h-px my-8 mr-8 bg-gray-200 border-0 dark:bg-gray-700" />
            {headingText('Total Estimated Profit For 1 Acre')}
            <Grid>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <div className="font-montserrat text-[11px] text-[#9D9999] font-normal mb-2">
                  The estimated profit per acre of agricultural land is
                  determined by subtracting the total costs of production from
                  the total revenue generated from selling the crops.
                </div>
                <table className="border border-gray-200 mt-4 w-auto">
                  <tr className="bg-green-50">
                    <th className="border border-gray-200 px-4 py-2 bg-[#F3FBF2] text-green-700 w-[50%] text-[#0F783B]">
                      Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2 bg-[#F3FBF2] text-green-700 w-[50%] text-[#0F783B]">
                      Cost
                    </th>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium">
                      Cost Of Production At Farm Gate
                    </td>
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium text-[#D63434]">
                      Rs.{' '}
                      {formik.values &&
                        formik.values?.costOfProductionAtFarmGate}
                    </td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium">
                      Cost Of Production At Mandi Gate
                    </td>
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium text-[#D63434]">
                      Rs.{' '}
                      {formik.values &&
                        formik.values['costOfProductionAtMandiGate']}
                    </td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium">
                      Gross Revenue
                    </td>
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium text-[#00A642]">
                      Rs. {formik.values && formik.values['grossRevenue']}
                    </td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium">
                      Total Profit
                    </td>
                    <td className="border border-gray-200 px-4 py-2 w-[50%] font-montserrat text-[10px] font-medium text-[#00A642]">
                      Rs. {formik.values && formik.values['totalProfit']}
                    </td>
                  </tr>
                </table>
              </Grid.Col>

              {(formik.values?.totalProfit !== 0 ||
                formik.values?.costOfProductionAtMandiGate !== 0 ||
                formik.values?.costOfProductionAtFarmGate !== 0) && (
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <DonutChart
                    data={[
                      {
                        name: 'Estimated Total Profit',
                        value: formik.values?.totalProfit,
                        color: '#00A642',
                      },
                      {
                        name: 'Estimated Total Expenses:',
                        value:
                          formik.values?.costOfProductionAtMandiGate ??
                          formik.values?.costOfProductionAtFarmGate,
                        color: '#D63434',
                      },
                    ]}
                    tooltipDataSource="segment"
                    chartLabel={'Estimated Results'}
                    mx="auto"
                  />
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 3.5, lg: 3.5 }}></Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                      <div className="mt-6 flex justify-between">
                        <div>
                          <div className="flex flex-row justify-start items-center">
                            <div className="w-3 h-3 rounded-full m-1 mr-2 bg-[#00A642]" />
                            <div className="font-montserrat text-[10px] font-semibold m-1 mr-2">
                              Estimated Total Profit:
                            </div>
                            <div className="font-montserrat text-[12px] font-bold m-1 mr-2 text-[#00A642]">
                              Rs. {formik.values?.totalProfit}{' '}
                            </div>
                          </div>
                          <div className="flex justify-start items-center mt-3">
                            <div className="w-3 h-3 rounded-full m-1 mr-2 bg-[#D63434]" />
                            <div className="font-montserrat text-[10px] font-semibold m-1 mr-2">
                              Estimated Total Profit:
                            </div>
                            <div className="font-montserrat text-[12px] font-bold m-1 mr-2 text-[#D63434]">
                              Rs.{' '}
                              {formik.values?.costOfProductionAtMandiGate ??
                                formik.values?.costOfProductionAtFarmGate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              )}
            </Grid>
          </div>
        );
      case 4:
        <></>;
    }
  }

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const ColorlibStepIconRoot = styled('div')(() => ({
    // Background color
    backgroundColor: theme.colors.newThemeColors[1],
    zIndex: 1,
    // Icon color
    color: theme.colors.newThemeColors[0],
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    border: `2px solid ${theme.colors.newThemeColors[0]}`, // Added border property
    cursor: 'pointer', // Added cursor property
    ...{
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
  }));

  const ColorlibStepIconRootActive = styled('div')(() => ({
    // Background color
    backgroundColor: theme.colors.newThemeColors[0],
    zIndex: 1,
    // Icon color
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    border: `2px solid ${theme.colors.newThemeColors[0]}`, // Added border property
    cursor: 'pointer', // Added cursor property
    ...{
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      0: <IconCheck />,
      1: <IconEdit />,
      2: <IconPlant />,
      3: <HarvestIcon className="ml-1.5" />,
      4: <IconCoins />,
      5: <IconQuestionMark />,
    };

    return completed || (active && String(props.icon) === '5') ? (
      <ColorlibStepIconRootActive className={className}>
        {icons['0']}
      </ColorlibStepIconRootActive>
    ) : (
      <ColorlibStepIconRoot className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
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
        headerText={'Crops Planning'}
        breadcrumbs={[{ title: 'Crops Planning', href: '' }]}
        isAddOrUpdateButton={type !== 'View'}
        isAddOrUpdateButtonLoading={isLoading}
        buttonContent={`${type} Crops Planning`}
        onButtonClick={formik.handleSubmit} // Call handleAddFarmAdmin function when button is clicked
      />
      <MantinePaper
        shadow="xs"
        className="flex relative justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <form>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((ele, index) => (
              <Step key={ele.label} onClick={() => setActiveStep(index)}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <div className="font-montserrat text-12px text-[#000000] font-medium">
                    {ele.label}
                  </div>
                </StepLabel>
                <StepContent>{getStepContent(index)}</StepContent>
              </Step>
            ))}
          </Stepper>
        </form>
      </MantinePaper>
    </main>
  );
};

export default CropPlanningForm;
