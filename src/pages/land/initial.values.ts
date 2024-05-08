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

export const initialMapModalInfo = {
  isOpened: false,
  isReadOnly: true,
  data: null,
};
