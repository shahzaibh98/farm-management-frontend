import { LandStatus, LandType } from '@agri/shared-types';

export interface SearchFilter {
  searchValue: string;
  type: string;
  status: string;
}

export const initialSearchValues: SearchFilter = {
  searchValue: '',
  type: 'All',
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
