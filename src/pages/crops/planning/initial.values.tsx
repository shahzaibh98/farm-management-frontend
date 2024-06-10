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
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },

  {
    label: 'Deep Ploughing',
    field: 'deepPloughing',
    unitName: 'Hours',
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Planking Ploughing',
    field: 'plankingPloughing',
    unitName: 'Hours',
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Leveling Ploughing',
    field: 'levelingPloughing',
    unitName: 'Hours',
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },
];

export const seedAndSowing = [
  {
    label: 'Seed Quantity',
    field: 'seedQuantity',
    unitName: 'KG',
    costLabel: 'Enter Cost Per Kg',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Seed Drilling',
    field: 'seedDrilling',
    unitName: 'Hours',
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Seed Broadcasting',
    field: 'seedBroadcasting',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    unitLabel: 'Man Day',
    type: 'Unit And Value',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Seed Transmission',
    field: 'seedTransmission',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    unitLabel: 'Man Day',
    type: 'Unit And Value',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Seed Treatment',
    field: 'seedTreatment',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    unitLabel: 'Man Day',
    type: 'Unit And Value',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Bridging',
    field: 'bridging',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
];
export const irrigation = [
  {
    label: 'Cleaning of water courses',
    field: 'cleaningOfWaterCourses',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Private Tubewell',
    field: 'privateTubewell',
    unitName: 'Hours',
    costLabel: 'Enter Cost Per Hour',
    type: 'Unit And Value',
    unitLabel: 'Time',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Labour Cost',
    field: 'labourChargesForIrrigation',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Canal Water rate',
    field: 'canalWaterRate',
    costLabel: 'Enter Cost For Abiania',
    type: 'Value',
    costFieldLabel: 'Cost',
  },
];
export const fertilizers = [
  {
    label: 'Urea',
    field: 'urea',
    unitName: 'Bags',
    costLabel: 'Enter Cost Per Bag',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },
  {
    label: 'DAP',
    field: 'dap',
    unitName: 'Bags',
    costLabel: 'Enter Cost Per Bag',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },

  {
    label: 'Other Fertilizer',
    field: 'otherFertilizer',
    unitName: 'Bags',
    costLabel: 'Enter Cost Per Bag',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Fertilizer Application',
    field: 'fertilizerApplication',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Transportation',
    field: 'transportation',
    costLabel: 'Enter Cost Per Fare',
    type: 'Value',
    costFieldLabel: 'Cost',
  },
];

export const dungManagement = [
  {
    label: 'Dung Trolley',
    field: 'dungTrolley',
    unitName: 'Number',
    costLabel: 'Enter Cost Per Number',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Dung Labour',
    field: 'dungLabour',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
];

export const harvestingCost = [
  {
    label: 'Pick / Dig Cost',
    field: 'pickOrDig',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },

  {
    label: 'Cutting Cost',
    field: 'cutting',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Threshing Cost',
    field: 'threshing',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Machine Harvesting',
    field: 'machineHarvesting',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
];

export const costOfTransport = [
  {
    label: 'Transport Labour',
    field: 'transportLabour',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Bags',
    field: 'transportBags',
    unitName: 'Quantity',
    costLabel: 'Enter Cost Per Bag',
    type: 'Unit And Value',
    unitLabel: 'Quantity',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Transport Rent',
    field: 'transportRent',
    costLabel: 'Cost For Transport Rent',
    type: 'Value',
    costFieldLabel: 'Cost',
  },
];

export const otherExpenses = [
  {
    label: 'Cost of Other Expenses',
    field: 'costOfOtherExpenses',
    costLabel: 'Cost of Other Expenses',
    type: 'Value',
    costFieldLabel: 'Cost',
  },
];

export const pestControl = [
  {
    label: 'Spray Pesticides',
    field: 'sprayPesticides',
    unitName: 'KG / Liter',
    costLabel: 'Enter Cost Per Unit',
    type: 'Unit And Value',
    unitLabel: 'KG / Liter',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Spray Pest Labour',
    field: 'sprayPestLabour',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
];

export const weeding = [
  {
    label: 'Spray Weedicides',
    field: 'sprayWeedicides',
    unitName: 'KG / Liter',
    costLabel: 'Enter Cost Per Unit',
    type: 'Unit And Value',
    unitLabel: 'Kg/Liter',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Spray Weeds Labour',
    field: 'sprayWeedsLabour',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
  },
  {
    label: 'Hoeing Labour',
    field: 'hoeingLabour',
    unitName: 'Man Day',
    costLabel: 'Enter Cost Per Man Day',
    type: 'Unit And Value',
    unitLabel: 'Man Day',
    costFieldLabel: 'Cost',
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
  { data: costOfTransport },
  { data: harvestingCost },
  { data: otherExpenses },
];

export const initialCropPlanFormState = {
  // Crop Specification
  refFarmCropId: '',
  farmCropPlantingId: '',
  landTypeId: '',
  provinceId: '',
  divisionId: '',
  districtId: '',
  tehsilId: '',

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
  labourChargesForIrrigationTotalPrice: null,
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
  dungLabourTotalPrice: null,

  sprayPesticidesAvgUnit: null,
  sprayPesticidesAvgCost: null,
  sprayPesticidesTotalPrice: null,
  sprayPestLabourAvgUnit: null,
  sprayPestLabourAvgCost: null,

  sprayWeedicidesAvgUnit: null,
  sprayWeedicidesAvgCost: null,
  sprayWeedicidesTotalPrice: null,

  sprayWeedsLabourAvgUnit: null,
  sprayWeedsLabourAvgCost: null,
  sprayWeedsLabourTotalPrice: null,

  hoeingLabourAvgUnit: null,
  hoeingLabourAvgCost: null,
  hoeingLabourTotalPrice: null,

  weedRemovalAvgUnit: null,
  weedRemovalAvgCost: null,
  weedRemovalTotalPrice: null,

  machineHarvestingAvgUnit: null,
  machineHarvestingAvgCost: null,
  machineHarvestingTotalPrice: null,
  machineHarvestingIsEnabled: true,

  threshingAvgUnit: null,
  threshingAvgCost: null,
  threshingTotalPrice: null,
  threshingIsEnabled: true,

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

  pickOrDigAvgUnit: null,
  pickOrDigAvgCost: null,
  pickOrDigTotalPrice: null,

  cuttingAvgUnit: null,
  cuttingAvgCost: null,
  cuttingTotalPrice: null,

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
