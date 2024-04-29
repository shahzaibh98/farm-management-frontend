import store from '../../redux';

export const initialSearchValues = {
  searchValue: '',
  status: '',
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

  console.log('filters', filters);

  return filters;
};
