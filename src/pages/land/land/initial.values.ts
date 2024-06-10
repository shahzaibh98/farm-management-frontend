export interface SearchFilter {
  searchValue: string;
  locationTypeId: string;
  status: string;
}

export const initialSearchValues: any = {
  searchValue: '',
  locationTypeId: 'All',
  status: 'All',
};

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
