import store from '../../redux';
import { farmAdminId } from '../../utils/common/constant.objects';

export const initialSearchValues = {
  searchValue: '',
  status: '',
};

export const buildFilters = (searchValues: {
  searchValue: any;
  status: string;
}) => {
  const userInfo = store.getState()?.userInfo;

  const roleId = userInfo?.isSystemAdmin
    ? '0'
    : userInfo?.currentRole?.roleMode === 'farms'
      ? userInfo?.currentRole?.currentFarmRole?.roleId
      : userInfo?.currentRole?.currentCompanyRole?.roleId;

  const currentRole =
    userInfo?.currentRole?.roleMode === 'farms'
      ? userInfo?.currentRole?.currentFarmRole?.roleId
      : userInfo?.currentRole?.currentCompanyRole?.roleId;

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
          ? true
          : searchValues?.status === 'Blocked'
            ? false
            : '',
    },
  ];

  if (roleId === '0') {
    filters.push({
      field: 'roleId',
      operator: 'eq',
      value: Number(farmAdminId),
    });
  } else if (roleId === farmAdminId) {
    filters.push(
      {
        field: 'roleId',
        operator: 'neq',
        value: 0,
      },
      {
        field: 'roleId',
        operator: 'neq',
        value: Number(farmAdminId),
      },
      {
        field: 'farmId',
        operator: 'eq',
        value: currentRole.farmId?.toString(),
      }
    );
  }
  return filters;
};
