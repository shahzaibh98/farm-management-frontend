import store from '../../redux';

export const initialSearchValues = {
  searchValue: '',
  status: '',
  type: 'All',
};

export const buildFilters = (searchValues: {
  searchValue: any;
  status: string;
}) => {
  const userInfo = store.getState()?.userInfo?.userInfo;

  const filters = [
    {
      field: 'email',
      operator: 'like',
      value: searchValues.searchValue,
    },
    {
      field: 'isActive',
      operator: 'eq',
      value:
        searchValues?.status === 'Active'
          ? 'true'
          : searchValues?.status === 'Blocked'
            ? 'false'
            : '',
    },
  ];

  if (userInfo?.roleId === '0') {
    filters.push({
      field: 'roleId',
      operator: 'eq',
      value: 1,
    });
  } else if (userInfo?.roleId === '1') {
    filters.push(
      {
        field: 'roleId',
        operator: 'neq',
        value: 0,
      },
      {
        field: 'roleId',
        operator: 'neq',
        value: 1,
      },
      {
        field: 'farmId',
        operator: 'eq',
        value: userInfo?.farmId?.toString(),
      }
    );
  }
  return filters;
};

import { LandStatus, LandType } from '@agri/shared-types';

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
