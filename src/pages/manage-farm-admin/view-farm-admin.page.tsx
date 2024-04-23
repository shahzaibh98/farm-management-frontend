import { Center, Grid, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { SetStateAction, useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import { Paper, Select, Table, Text } from '../../concave.agri/components';
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
import { deleteData, fetchData, putData } from '../../api/api';
import { Notification } from '../../concave.agri/components';
import { User } from '../../types/view-farm-admin.type';
import {
  initialModalInfo,
  initialNotification,
  paginationInfoValue,
} from '../../utils/common/constant.objects';
import {
  extractPageInfo,
  removeEmptyValues,
} from '../../utils/common/function';
import { initialSearchValues } from './initial.values';
import UserForm from './user.form';

const ManageFarmAdmin = () => {
  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') || initialSearchValues.searchValue;
    const status = searchParams.get('status') || initialSearchValues.status;

    // Update state with extracted values
    return {
      searchValue,
      status,
    };
  };

  const initialPaginationFromQueryParams = () => {
    const rowPerPage =
      searchParams.get('rowPerPage') || paginationInfoValue.rowPerPage;

    const currentPage = Number(
      searchParams.get('currentPage') ||
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

  const [modalInfo, setModalInfo] = useState(initialModalInfo);

  /* /////////////////////////////////////////////////
                      functions
  /////////////////////////////////////////////////// */

  const handleAddFarmAdmin = () => setModalInfo({ ...modalInfo, isOpen: true });

  const setValuesById = (valuesById: any) =>
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));

  const handleSetParams = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(searchValues).forEach(([key, value]) => {
      if (key === 'dateRange') {
        if (value[0]) {
          newParams.set('dateRangeStart', value[0]?.toString());
        }
        if (value[1]) {
          newParams.set('dateRangeEnd', value[1]?.toString());
        }
      } else if (value) {
        newParams.set(key, value);
      }
    });
    newParams ? setSearchParams(newParams) : initialSearchValues;
  };

  const handleFetchDataByFilter = () => {
    setIsLoading(true);

    const filterObject = JSON.stringify(
      removeEmptyValues({
        email: searchValues.searchValue,
        isActive:
          searchValues?.status === 'Active'
            ? 'true'
            : searchValues?.status === 'Blocked'
              ? 'false'
              : '',
        roleId: '1',
      })
    );

    fetchData(
      `farm?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`
    )
      .then((response: any) => {
        setTableData(response.data);
        const getPages = extractPageInfo(response.pages);
        setPaginationInfo({
          ...paginationInfo,
          totalRecords: response.total,
          ...getPages,
        });
      })
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleNotificationClose = () => setNotification(initialNotification);

  const handleSearchButtonClick = () => {
    handleSetParams();
    handleFetchDataByFilter();
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
    deleteData(`farm/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Farm Admin deleted successfully',
          title: 'Successfully',
          isEnable: true,
        });
        setTimeout(() => {
          setResetTable(!resetTable);
        });
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleChangeStatus = (id: string | number) => {
    setIsLoading(true);
    const findUserStatus = tableData?.find(
      user => user?.userId === id
    )?.isActive;
    putData(`farm/${id}`, {
      isActive: findUserStatus === 'true' ? 'false' : 'true',
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
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable]);

  // Function to set values based on identifiers

  const columns = useMemo(
    () => [
      {
        header: 'FARM TITLE',
        accessorKey: 'farmTitle',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'NAME',
        accessorKey: 'name',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'EMAIL ADDRESS',
        accessorKey: 'email',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'PHONE NUMBER',
        accessorKey: 'phoneNo',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'STATUS',
        accessorKey: 'isActive',
        cell: (info: { getValue: () => any }) => {
          const isActive = info.getValue();
          return (
            <Center>
              <div className="flex flex-wrap">
                <div
                  className={`w-3 h-3 rounded-full m-1 mr-2 ${isActive === 'true' ? 'bg-green-light' : 'bg-red-light'}`}
                />
                <Text>{isActive === 'true' ? 'Active' : 'Blocked'}</Text>
              </div>
            </Center>
          );
        },
      },
      {
        header: '',
        accessorKey: 'userId',
        size: 55, //starting column size
        minSize: 55, //enforced during column resizing
        maxSize: 55, //enforced during column resizing
        cell: (info: any) => {
          const isActive = info?.row?.original?.isActive;
          const id = info?.row?.original?.userId;
          return (
            <TableMenu
              id={id}
              onDeleteClick={handleDeleteById}
              onEditClick={() =>
                setModalInfo({
                  isOpen: true,
                  type: 'Edit',
                  objectData: info?.row?.original,
                  isReadOnly: false,
                })
              }
              onViewClick={() =>
                setModalInfo({
                  isOpen: true,
                  type: 'View',
                  objectData: info?.row?.original,
                  isReadOnly: true,
                })
              }
              additionalMenuItems={[
                {
                  label: isActive === 'true' ? 'Block' : 'Active',
                  icon:
                    isActive === 'true' ? (
                      <MdDisabledVisible />
                    ) : (
                      <VscVmActive />
                    ),
                  onClick: () => handleChangeStatus(id),
                },
              ]}
            />
          );
        },
      },
    ],
    [tableData]
  );

  return (
    <main className={`w-full h-screen relative bg-darkColors-700`}>
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
        headerText="Farm Admin"
        breadcrumbsText="Manage Farm Admin"
        isAddOrUpdateButton
        buttonContent="Add Farm Admin"
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

      <Modal
        opened={modalInfo.isOpen}
        onClose={() => setModalInfo(initialModalInfo)}
        title="Add Farm Admin"
        size="md"
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.colors.primaryColors[0],
          },
        }}
        transitionProps={{ transition: 'fade-up', duration: 300 }}
      >
        <UserForm
          viewOrUpdate={modalInfo}
          onCloseButton={() => setModalInfo(initialModalInfo)}
          handleNotification={(
            notification: SetStateAction<{
              isSuccess: boolean;
              isEnable: boolean;
              title: string;
              message: string;
            }>
          ) => {
            setModalInfo(initialModalInfo);
            setNotification(notification);
            setResetTable(!resetTable);
          }}
        />
      </Modal>

      <div className="h-4" />
    </main>
  );
};
export default ManageFarmAdmin;
