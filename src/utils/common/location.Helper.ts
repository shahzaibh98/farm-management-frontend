// locationHelpers.ts

// Define TypeScript interfaces
interface LocationItem {
  [x: string]: any;
}

interface LocationData {
  provinces: LocationItem[];
  divisions: LocationItem[];
  districts: LocationItem[];
  tehsils: LocationItem[];
  [key: string]: LocationItem[];
}

// Create options for a select field
export const createOptions = (
  items: LocationItem[],
  labelKey: string,
  valueKey: string
) => [
  { label: 'None', value: '' },
  ...items.map(item => ({
    label: item[labelKey],
    value: item[valueKey],
  })),
];

// Filter items by parent id
export const filterByParentId = (
  items: LocationItem[],
  parentIdKey: string,
  parentId: any
) => (!parentId ? items : items.filter(item => item[parentIdKey] === parentId));

// Get divisions
export const getDivisions = (provinceId: any, locationData: LocationData) =>
  createOptions(
    filterByParentId(locationData.divisions || [], 'provinceId', provinceId),
    'name',
    'divisionId'
  );

// Get districts
export const getDistricts = (divisionId: any, locationData: LocationData) =>
  createOptions(
    filterByParentId(locationData.districts || [], 'divisionId', divisionId),
    'name',
    'districtId'
  );

// Get tehsils
export const getTehsils = (districtId: any, locationData: LocationData) =>
  createOptions(
    filterByParentId(locationData.tehsils || [], 'districtId', districtId),
    'name',
    'tehsilId'
  );

const findItemById = (list: any[], id: any, idKey: string) =>
  list.find((item: { [x: string]: any }) => item[idKey] === id);

export const handleDivision = (locationData: any, value: string) => {
  const selectedDivision = findItemById(
    locationData.divisions,
    value,
    'divisionId'
  );
  if (selectedDivision) {
    const selectedProvince = findItemById(
      locationData.provinces,
      selectedDivision.provinceId,
      'provinceId'
    );
    return {
      provinceId: selectedProvince.provinceId,
      divisionId: value,
      districtId: '',
      tehsilId: '',
    };
  }
};

export const handleDistrict = (locationData: any, value: string) => {
  const selectedDistrict = findItemById(
    locationData.districts,
    value,
    'districtId'
  );
  if (selectedDistrict) {
    const selectedDivision = findItemById(
      locationData.divisions,
      selectedDistrict.divisionId,
      'divisionId'
    );
    const selectedProvince = findItemById(
      locationData.provinces,
      selectedDivision.provinceId,
      'provinceId'
    );
    return {
      provinceId: selectedProvince.provinceId,
      divisionId: selectedDivision.divisionId,
      districtId: value,
      tehsilId: '',
    };
  }
};

export const handleTehsil = (locationData: any, value: string) => {
  const selectedTehsil = findItemById(locationData.tehsils, value, 'tehsilId');
  if (selectedTehsil) {
    const selectedDistrict = findItemById(
      locationData.districts,
      selectedTehsil.districtId,
      'districtId'
    );
    const selectedDivision = findItemById(
      locationData.divisions,
      selectedDistrict.divisionId,
      'divisionId'
    );
    const selectedProvince = findItemById(
      locationData.provinces,
      selectedDivision.provinceId,
      'provinceId'
    );
    return {
      provinceId: selectedProvince.provinceId,
      divisionId: selectedDivision.divisionId,
      districtId: selectedDistrict.districtId,
      tehsilId: value,
    };
  }
};
