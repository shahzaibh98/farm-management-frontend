import { LandStatus, LandType } from '@agri/shared-types';

export interface SearchFilter {
  searchValue: string;
  type: string;
  status: string;
}

export const initialSearchValues: SearchFilter = {
  searchValue: '',
  type: LandType.Fields,
  status: LandStatus.ACTIVE,
};
