import { Center, Grid, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project

import {
  Notification,
  Paper,
  Select,
  Table,
  Text,
} from '../../concave.agri/components';
import { SearchButton } from '../../concave.agri/components/searchbar';
import ResetButton from '../../concave.agri/components/searchbar/resetButton';

// Importing a custom hook to get the screen size
import useScreenSize from '../../hooks/useScreenSize';

// Importing custom components and layouts
import { TableMenu } from '../../layout';
import GenericHeader from '../../layout/header.layout';
import SearchComponent from '../../layout/searchBar.layout';

// Importing types and constants
import { MdDisabledVisible } from 'react-icons/md';
import { VscVmActive } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { deleteData, fetchData, putData } from '../../api/api';
import { User } from '../../types/view-farm-admin.type';
import {
  initialNotification,
  paginationInfoValue,
  systemRoles,
} from '../../utils/common/constant.objects';
import {
  extractPageInfo,
  removeEmptyValueFilters,
} from '../../utils/common/function';
import { buildFilters, initialSearchValues } from './initial.values';
import { isActive } from '@tiptap/react';

const ManageUser = () => {
  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;
    const status = searchParams.get('status') ?? initialSearchValues.status;

    // Update state with extracted values
    return {
      searchValue,
      status,
    };
  };

  const initialPaginationFromQueryParams = () => {
    const rowPerPage =
      searchParams.get('rowPerPage') ?? paginationInfoValue.rowPerPage;

    const currentPage = Number(
      searchParams.get('currentPage') ??
        paginationInfoValue.currentPage?.toString()
    );
    return { ...paginationInfoValue, rowPerPage, currentPage };
  };

  /* /////////////////////////////////////////////////
                       Variable
  /////////////////////////////////////////////////// */
  // Initialize the useMantineTheme hook for accessing theme variables
  const theme = useMantineTheme();

  const { isSmallScreen } = useScreenSize();
  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const roleId = isSystemAdmin
    ? '0'
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole?.roleId
      : currentRole?.currentCompanyRole?.roleId;

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  // State for search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for pagination information
  const [paginationInfo, setPaginationInfo] = useState(
    initialPaginationFromQueryParams()
  );

  // State for search values
  const [searchValues, setSearchValues] = useState(
    initializeStateFromQueryParams()
  );

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  // State for table data
  const [tableData, setTableData] = useState<User[]>([]);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  /* /////////////////////////////////////////////////
                      functions
  /////////////////////////////////////////////////// */

  const navigate = useNavigate();

  const handleAddFarmAdmin = () => {
    navigate(roleId === '0' ? '/manage-farm/add' : '/manage-users/add');
  };

  const setValuesById = (valuesById: any) =>
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));

  const handleSetParams = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    newParams && setSearchParams(newParams);
  };

  const handleFetchDataByFilter = () => {
    setIsLoading(true);

    const filters = removeEmptyValueFilters(buildFilters(searchValues));

    const filterObject = JSON.stringify({ filter: filters });

    fetchData(
      `users${'/farm-users'}?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`
    )
      .then((response: any) => {
        setTableData(response.data);
        const getPages = extractPageInfo(response.pages);
        setPaginationInfo({
          ...paginationInfo,
          totalRecords: response.total,
          totalPages: getPages?.totalPages ?? 0,
        });
      })
      .catch(error => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleNotificationClose = () => setNotification(initialNotification);

  const handleSearchButtonClick = () => {
    handleSetParams();
    handleFetchDataByFilter();
  };

  const getStatus = (
    roleId: string,
    rowData: { systemUser: { isActive: any }; farm: { isActive: any } }
  ) => {
    if (roleId !== '0') {
      return rowData?.systemUser?.isActive ? 'Active' : 'Blocked';
    } else {
      return rowData?.farm?.isActive ? 'Active' : 'Blocked';
    }
  };

  const handlePagination = (actionType: string, value?: any) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentPage = paginationInfo.currentPage;

    if (actionType === 'next') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage + 1,
      }));
      currentPage < 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage + 1).toString());
    } else if (actionType === 'previous') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
      currentPage < 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage - 1).toString());
    } else if (actionType === 'goto' && value !== currentPage) {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: value,
      }));
      value < 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', value);
    } else if (actionType === 'rowPerPage') {
      setPaginationInfo(prevState => ({
        ...prevState,
        rowPerPage: value,
      }));
      if (value === '10' || value === '50' || value === '100') {
        newParams.set('rowPerPage', value);
      } else {
        newParams.delete('rowPerPage');
      }
    }
    setSearchParams(newParams);
  };

  const handleResetButtonClick = () => {
    const newParams = new URLSearchParams();
    const rowPerPage =
      searchParams.get('rowPerPage') || paginationInfoValue.rowPerPage;
    const currentPage = Number(
      searchParams.get('currentPage') ||
        paginationInfoValue.currentPage?.toString()
    );
    if (rowPerPage !== '5') newParams.set('rowPerPage', rowPerPage);
    if (currentPage > 2) newParams.set('currentPage', currentPage.toString());
    setSearchParams(newParams);
    setSearchValues(initialSearchValues);
    setResetTable(!resetTable);
  };

  const handleDeleteById = (id: string) => {
    setIsLoading(true);
    deleteData(`users/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Deleted successfully',
          title: 'Successfully',
          isEnable: true,
        });
        setTimeout(() => {
          setResetTable(!resetTable);
        });
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleChangeStatus = (id: string | number, currentStatus: boolean) => {
    setIsLoading(true);

    putData(roleId === '0' ? `farm/${id}` : `users/${id}`, {
      isActive: !currentStatus,
    })
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Status has been changed successfully',
          title: 'Successfully',
          isEnable: true,
        });
        setTimeout(() => {
          setResetTable(!resetTable);
        });
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  // Function to set values based on identifiers

  const commonColumns = [
    {
      header: 'NAME',
      size: 50,
      minSize: 50,
      maxSize: 500,
      cell: (info: any) => {
        const rowObject = info?.row?.original;
        return (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {rowObject?.systemUser?.name}
            </p>
          </div>
        );
      },
    },
    {
      header: 'EMAIL ADDRESS',
      size: 50,
      minSize: 50,
      maxSize: 500,
      cell: (info: any) => {
        const rowObject = info?.row?.original;
        return (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {rowObject?.systemUser?.email}
            </p>
          </div>
        );
      },
    },
    {
      header: 'PHONE NUMBER',
      size: 50,
      minSize: 50,
      maxSize: 500,
      cell: (info: any) => {
        const rowObject = info?.row?.original;
        return (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {rowObject?.systemUser?.phoneNo}
            </p>
          </div>
        );
      },
    },
    {
      header: 'STATUS',
      accessorKey: 'isActive',
      cell: (info: any) => {
        const rowData = info?.row?.original;
        return (
          <Center>
            <div className="flex flex-wrap">
              <div
                className={`w-3 h-3 rounded-full m-1 mr-2 ${
                  roleId !== '0'
                    ? rowData?.systemUser?.isActive
                      ? 'bg-green-light'
                      : 'bg-red-light'
                    : rowData?.farm?.isActive
                      ? 'bg-green-light'
                      : 'bg-red-light'
                }`}
              />
              <Text>{getStatus(roleId, rowData)}</Text>
            </div>
          </Center>
        );
      },
    },
    {
      header: '',
      accessorKey: 'userId',
      size: 55,
      minSize: 55,
      maxSize: 55,
      cell: (info: any) => {
        const rowData = info?.row?.original;
        const id = rowData?.farmUserId;
        const farmId = rowData?.farm?.farmId;
        return (
          <TableMenu
            id={id}
            onDeleteClick={handleDeleteById}
            onViewClick={id =>
              navigate(
                `/manage-${roleId === '0' ? 'farm' : 'users'}/view/${id}`
              )
            }
            onEditClick={() =>
              navigate(
                `/manage-${roleId === '0' ? 'farm' : 'users'}/edit/${id}`
              )
            }
            additionalMenuItems={[
              {
                label:
                  roleId !== '0'
                    ? rowData?.systemUser?.isActive
                      ? 'Blocked'
                      : 'Active'
                    : rowData?.farm?.isActive
                      ? 'Blocked'
                      : 'Active',
                icon:
                  roleId !== '0' ? (
                    rowData?.systemUser?.isActive ? (
                      <MdDisabledVisible />
                    ) : (
                      <VscVmActive />
                    )
                  ) : rowData?.farm?.isActive ? (
                    <MdDisabledVisible />
                  ) : (
                    <VscVmActive />
                  ),
                onClick: () =>
                  handleChangeStatus(
                    roleId === '0' ? farmId : id,
                    roleId === '0'
                      ? rowData?.farm?.isActive
                      : rowData?.systemUser?.isActive
                  ),
              },
            ]}
          />
        );
      },
    },
  ];

  const columns = useMemo(() => {
    if (roleId === '0') {
      return [
        {
          header: 'FARM TITLE',
          accessorKey: 'farm',
          size: 50,
          minSize: 50,
          maxSize: 500,
          cell: (info: { getValue: () => any }) => (
            <div className="flex items-center justify-center">
              <p className="text-sm lg:text-base text-center">
                {info.getValue()?.farmTitle}
              </p>
            </div>
          ),
        },
        ...commonColumns,
      ];
    } else {
      return [
        ...commonColumns.slice(0, 1), // Add the first common column
        {
          header: 'ROLE',
          accessorKey: 'roleId',
          size: 50,
          minSize: 50,
          maxSize: 500,
          cell: (info: { getValue: () => any }) => (
            <div className="flex items-center justify-center">
              <p className="text-sm lg:text-base text-center">
                {systemRoles.find(e => e.id === info.getValue())?.name}
              </p>
            </div>
          ),
        },
        ...commonColumns.slice(1), // Add the remaining common columns
      ];
    }
  }, [resetTable, tableData]);

  return (
    <main className={'w-full h-screen relative bg-darkColors-700'}>
      {notification.isEnable && (
        <Notification
          title={notification.title}
          withClose
          color={notification.isSuccess ? theme.colors.primaryColors[0] : 'red'}
          handleCloseNotification={handleNotificationClose}
        >
          <Text fw={500}>{notification.message}</Text>
        </Notification>
      )}
      <GenericHeader
        headerText={roleId === '0' ? 'Farm' : 'User'}
        breadcrumbsText={`Manage ${roleId === '0' ? 'Farm' : 'User'}`}
        isAddOrUpdateButton
        buttonContent={`Add ${roleId === '0' ? 'Farm' : 'User'}`}
        onButtonClick={handleAddFarmAdmin} // Call handleAddFarmAdmin function when button is clicked
      />

      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <div className="mt-4">
          <SearchComponent
            placeholder="Search by email address..."
            searchValue={searchValues.searchValue}
            setValuesById={setValuesById}
            handleSearchButtonClick={handleSearchButtonClick}
            handleResetButtonClick={handleResetButtonClick}
          />
          <Grid className="mt-2">
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="Status"
                data={['Active', 'Blocked']}
                value={searchValues.status ?? ''}
                onChange={value => setValuesById({ status: value })}
              />
            </Grid.Col>

            {isSmallScreen && (
              <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
                <div className="flex flex-row justify-between">
                  <SearchButton onSearchButtonClick={handleSearchButtonClick} />
                  <ResetButton onResetButtonClick={handleResetButtonClick} />
                </div>
              </Grid.Col>
            )}
          </Grid>
          <Table
            isLoading={isLoading}
            data={tableData}
            columns={columns}
            paginationInfo={paginationInfo}
            handlePagination={handlePagination}
          />
        </div>
      </Paper>

      <div className="h-4" />
    </main>
  );
};
export default ManageUser;
