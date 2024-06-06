export const initialSearchValues = {
  searchValue: '',
  landTypeId: '',
  provinceId: '',
  divisionId: '',
  districtId: '',
  tehsilId: '',
};

export interface SearchFilter {
  searchValue: string;
  type: string;
  status: string;
}

interface MapModalInfo {
  isOpened: boolean;
  isReadOnly: boolean;
  isMultiple: boolean;
  data: any; // Change 'any' to the specific type of 'data' if it has a known type
}

export const initialMapModalInfo: MapModalInfo = {
  isOpened: false,
  isReadOnly: true,
  isMultiple: false,
  data: null,
};

export const landPreparation = [
  {
    label: 'Ploughing',
    field: 'ploughing',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },

  {
    label: 'Deep Ploughing',
    field: 'deepPloughing',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },
  {
    label: 'Planking Ploughing',
    field: 'plankingPloughing',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },
  {
    label: 'Leveling Ploughing',
    field: 'levelingPloughing',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },
];

export const seedAndSowing = [
  {
    label: 'Seed Quantity',
    field: 'seedQuantity',
    unitName: 'KG',
    costLabel: 'Avg. Cost Per Kg',
    type: 'Unit And Value',
  },
  {
    label: 'Seed Drilling',
    field: 'seedDrilling',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },
  {
    label: 'Seed Broadcasting',
    field: 'seedBroadcasting',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Seed Transmission',
    field: 'seedTransmission',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Seed Treatment',
    field: 'seedTreatment',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Bridging',
    field: 'bridging',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
];
export const irrigation = [
  {
    label: 'Cleaning of water courses',
    field: 'cleaningOfWaterCourses',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Canal Water rate',
    field: 'canalWaterRate',
    costLabel: 'Avg. Cost For Abiania',
    type: 'Value',
  },
  {
    label: 'Private Tubewell',
    field: 'privateTubewell',
    unitName: 'Hours',
    costLabel: 'Avg. Cost Per Hour',
    type: 'Unit And Value',
  },
  {
    label: 'Labour Cost',
    field: 'labourChargesForIrrigation',
    unitName: 'Day',
    costLabel: 'Avg. Cost Per Day',
    type: 'Unit And Value',
  },
];
export const fertilizers = [
  {
    label: 'Urea',
    field: 'urea',
    unitName: 'Bags',
    costLabel: 'Avg. Cost Per Bag',
    type: 'Unit And Value',
  },
  {
    label: 'DAP',
    field: 'dap',
    unitName: 'Bags',
    costLabel: 'Avg. Cost Per Bag',
    type: 'Unit And Value',
  },

  {
    label: 'Other Fertilizer',
    field: 'otherFertilizer',
    unitName: 'Bags',
    costLabel: 'Avg. Cost Per Bag',
    type: 'Unit And Value',
  },
  {
    label: 'Fertilizer Application',
    field: 'fertilizerApplication',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Transportation',
    field: 'transportation',
    costLabel: 'Avg. Cost Per Fare',
    type: 'Value',
  },
];

export const dungManagement = [
  {
    label: 'Dung Trolley',
    field: 'dungTrolley',
    unitName: 'Number',
    costLabel: 'Avg. Cost Per Number',
    type: 'Unit And Value',
  },
  {
    label: 'Dung Labour',
    field: 'dungLabour',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
];

export const harvestingCost = [
  {
    label: 'Pick / Dig Cost',
    field: 'pickDigCost',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },

  {
    label: 'Cutting Cost',
    field: 'cuttingCost',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Threshing Cost',
    field: 'threshingCost',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Machine Harvesting',
    field: 'machineHarvesting',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
];

export const costOfTransport = [
  {
    label: 'Transport Rent',
    field: 'transportRent',
    costLabel: 'Cost For Transport Rent',
    type: 'Value',
  },
  {
    label: 'Transport Labour',
    field: 'transportLabour',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Bags',
    field: 'transportBags',
    unitName: 'No.',
    costLabel: 'Avg. Cost Per Bag',
    type: 'Unit And Value',
  },
];

export const otherExpenses = [
  {
    label: 'Cost of Other Expenses',
    field: 'costOfOtherExpenses',
    costLabel: 'Cost of Other Expenses',
    type: 'Value',
  },
];

export const pestControl = [
  {
    label: 'Spray Pesticides',
    field: 'sprayPesticides',
    costLabel: 'Avg. Cost Per Unit',
    type: 'Unit Select and Value',
  },
  {
    label: 'Spray Pest Labour',
    field: 'sprayPestLabour',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
];

export const weeding = [
  {
    label: 'Spray Weedicides',
    field: 'sprayWeedicides',
    costLabel: 'Avg. Cost Per Unit',
    type: 'Unit Select and Value',
  },
  {
    label: 'Spray Weeds Labour',
    field: 'sprayWeedsLabour',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
  {
    label: 'Hoeing Labour',
    field: 'hoeingLabour',
    unitName: 'Man Day',
    costLabel: 'Avg. Cost Per Man Day',
    type: 'Unit And Value',
  },
];

export const farmCost = [
  { data: landPreparation },
  { data: seedAndSowing },
  { data: irrigation },
  { data: fertilizers },
  { data: pestControl },
  { data: weeding },
  { data: dungManagement },
  { data: harvestingCost },
  { data: otherExpenses },
];

export const initialCropPlanFormState = {
  // Crop Specification
  refFarmCropId: '',
  farmCropPlantingId: '',

  // Crop Details
  daysToEmerge: null,
  plantingSpacing: null,
  rowSpacing: null,
  plantingDepth: null,
  averageHeight: null,
  startMethod: '',
  estGerminationRate: null,
  seedsPerHole: null,
  notesInstructions: '',
  // autoCreateTasks: false, // nullable

  // Harvest Details
  daysToMaturity: null,
  harvestWindow: null,
  estLossRate: null,
  harvestUnits: '',
  estRevenue: null,
  estYieldPerAcre: null,

  // Cost Estimate

  deepPloughingAvgUnit: null,
  deepPloughingAvgCost: null,
  deepPloughingTotalPrice: null,
  ploughingAvgUnit: null,
  ploughingAvgCost: null,
  ploughingTotalPrice: null,
  plankingPloughingAvgUnit: null,
  plankingPloughingAvgCost: null,
  plankingPloughingTotalPrice: null,
  levelingPloughingAvgUnit: null,
  levelingPloughingAvgCost: null,
  levelingPloughingTotalPrice: null,
  seedQuantityAvgUnit: null,
  seedQuantityAvgCost: null,
  seedQuantityTotalPrice: null,
  seedDrillingAvgUnit: null,
  seedDrillingAvgCost: null,
  seedDrillingTotalPrice: null,
  seedBroadcastingAvgUnit: null,
  seedBroadcastingAvgCost: null,
  seedBroadcastingTotalPrice: null,
  seedTransmissionAvgUnit: null,
  seedTransmissionAvgCost: null,
  seedTransmissionTotalPrice: null,
  seedTreatmentAvgUnit: null,
  seedTreatmentAvgCost: null,
  seedTreatmentTotalPrice: null,
  bridgingAvgUnit: null,
  bridgingAvgCost: null,
  bridgingTotalPrice: null,
  cleaningOfWaterCoursesAvgUnit: null,
  cleaningOfWaterCoursesAvgCost: null,
  cleaningOfWaterCoursesTotalPrice: null,
  canalWaterRateAvgCost: null,
  privateTubewellAvgUnit: null,
  privateTubewellAvgCost: null,
  privateTubewellTotalPrice: null,
  labourChargesForIrrigationAvgUnit: null,
  labourChargesForIrrigationAvgCost: null,
  ureaAvgUnit: null,
  ureaAvgCost: null,
  ureaTotalPrice: null,
  dapAvgUnit: null,
  dapAvgCost: null,
  dapTotalPrice: null,
  otherFertilizerAvgUnit: null,
  otherFertilizerAvgCost: null,
  otherFertilizerTotalPrice: null,
  fertilizerApplicationAvgUnit: null,
  fertilizerApplicationAvgCost: null,
  fertilizerApplicationTotalPrice: null,
  transportationAvgCost: null,
  dungTrolleyAvgNo: null,
  dungTrolleyAvgCost: null,
  dungTrolleyTotalPrice: null,
  dungLabourAvgUnit: null,
  dungLabourAvgCost: null,
  sprayPesticidesAvgUnit: null,
  sprayPesticidesAvgCost: null,
  sprayPesticidesTotalPrice: null,
  sprayPestLabourAvgUnit: null,
  sprayPestLabourAvgCost: null,

  weedRemovalAvgUnit: null,
  weedRemovalAvgCost: null,
  weedRemovalTotalPrice: null,

  machineHarvestingAvgUnit: null,
  machineHarvestingAvgCost: null,
  machineHarvestingTotalPrice: null,
  machineHarvestingIsEnabled: true,

  threshingCostAvgUnit: null,
  threshingCostAvgCost: null,
  threshingCostTotalPrice: null,
  threshingCostIsEnabled: true,

  labourAvgUnit: null,
  labourAvgCost: null,
  labourTotalPrice: null,
  transportAvgUnit: null,
  transportAvgCost: null,
  transportTotalPrice: null,

  deepPloughingIsEnabled: true,
  ploughingIsEnabled: true,
  plankingPloughingIsEnabled: true,
  levelingPloughingIsEnabled: true,

  seedQuantityIsEnabled: true,
  seedDrillingIsEnabled: true,
  seedBroadcastingIsEnabled: true,
  seedTransmissionIsEnabled: true,
  seedTreatmentIsEnabled: true,
  bridgingIsEnabled: true,

  cleaningOfWaterCoursesIsEnabled: true,
  canalWaterRateIsEnabled: true,
  privateTubewellIsEnabled: true,
  labourChargesForIrrigationIsEnabled: true,
  ureaIsEnabled: true,
  dapIsEnabled: true,
  otherFertilizerIsEnabled: true,
  fertilizerApplicationIsEnabled: true,
  transportationIsEnabled: true,
  dungTrolleyIsEnabled: true,
  dungLabourIsEnabled: true,
  sprayPesticidesIsEnabled: true,

  sprayWeedicidesUnit: 'Liter',
  sprayPesticidesUnit: 'Liter',

  sprayPestLabourIsEnabled: true,
  sprayWeedicidesIsEnabled: true,

  sprayWeedsLabourIsEnabled: true,
  hoeingLabourIsEnabled: true,
  pickDigCostIsEnabled: true,
  cuttingCostIsEnabled: true,

  transportLabourAvgUnit: null,
  transportLabourAvgCost: null,
  transportLabourTotalPrice: null,
  transportRentAvgUnit: null,
  transportRentAvgCost: null,
  transportRentTotalPrice: null,
  transportBagsAvgUnit: null,
  transportBagsAvgCost: null,
  transportBagsTotalPrice: null,

  transportBagsIsEnabled: true,
  transportRentIsEnabled: true,
  transportLabourIsEnabled: true,

  // Cost of other expenses

  costOfOtherExpensesIsEnabled: true,
  costOfOtherExpensesAvgCost: null,

  // Calculations
  costOfProductionAtMandiGate: null,
  costOfProductionAtFarmGate: null,
  avgYieldPerAcre: null,
  grossRevenue: null,
  profitPerAcre: null,
  totalProfit: null,

  totalAcre: 1,
};
