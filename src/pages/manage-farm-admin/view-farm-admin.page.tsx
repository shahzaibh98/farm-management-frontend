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
import { MdDisabledVisible, MdOutlineBlock } from 'react-icons/md';
import { deleteData, fetchData } from '../../api/api';
import { Notification } from '../../concave.agri/components';
import { User } from '../../types/view-farm-admin.type';
import {
  initialNotification,
  paginationInfoValue,
} from '../../utils/common/constant.objects';
import { initialSearchValues } from './initial.values';
import UserForm from './user.form';
import { VscVmActive } from 'react-icons/vsc';

const ManageFarmAdmin = () => {
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

  // State for modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for resetting table
  const [resetTable, setResetTable] = useState(false);

  // State for pagination information
  const [paginationInfo, setPaginationInfo] = useState(paginationInfoValue);

  // State for search values
  const [searchValues, setSearchValues] = useState(initialSearchValues);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  // State for table data
  const [tableData, setTableData] = useState<User[]>([]);

  /* /////////////////////////////////////////////////
                      functions
  /////////////////////////////////////////////////// */

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddFarmAdmin = () => {
    toggleModal(); // Open the modal when "Add Task" button is clicked
  };

  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') || searchValues.searchValue;
    const status = searchParams.get('status') || searchValues.status;

    // Update state with extracted values
    setSearchValues({
      searchValue,
      status,
    });
  };

  const initialPaginationFromQueryParams = () => {
    const rowPerPage =
      searchParams.get('rowPerPage') || paginationInfoValue.rowPerPage;

    const currentPage = Number(
      searchParams.get('currentPage') ||
        paginationInfoValue.currentPage?.toString()
    );
    setPaginationInfo({ ...paginationInfoValue, rowPerPage, currentPage });
  };

  const setValuesById = (valuesById: any) => {
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));
  };

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
    setSearchParams(newParams);
  };

  const handleFetchDataByFilter = () => {
    setIsLoading(true);
    fetchData('farm')
      .then((response: any) => setTableData(response))
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleNotificationClose = () => {
    setNotification(initialNotification);
  };

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
      currentPage > 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage + 1).toString());
    } else if (actionType === 'previous') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
      currentPage > 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage - 1).toString());
    } else if (actionType === 'goto') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: value,
      }));
      value > 2
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
  };

  const handleDeleteById = (id: string) => {
    setIsLoading(true);
    deleteData(`farm/${id}`)
      .then(response => console.log(response))
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  useEffect(() => {
    handleSearchButtonClick();
  }, [paginationInfo]);

  useEffect(() => {
    initializeStateFromQueryParams();
    initialPaginationFromQueryParams();
  }, [searchParams]);

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
          const priority = info.getValue();
          console.log(`${info.getValue()} ${priority}`);
          return (
            <Center>
              <div className="flex flex-wrap">
                <div
                  className={`w-3 h-3 rounded-full m-1 mr-2 ${priority === '1' ? 'bg-green-light' : 'bg-red-light'}`}
                />
                <Text>{priority === '1' ? 'Active' : 'Blocked'}</Text>
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
              additionalMenuItems={[
                {
                  label: isActive ? 'Block' : 'Active',
                  icon: isActive ? <MdDisabledVisible /> : <VscVmActive />,
                  onClick: () => {
                    console.log('blocked');
                  },
                },
              ]}
            />
          );
        },
      },
    ],
    []
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
            placeholder="Search by name..."
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
        opened={isModalOpen}
        onClose={toggleModal}
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
          onCloseButton={toggleModal}
          handleNotification={(
            notification: SetStateAction<{
              isSuccess: boolean;
              isEnable: boolean;
              title: string;
              message: string;
            }>
          ) => {
            toggleModal();
            setNotification(notification);
          }}
        />
      </Modal>

      <div className="h-4" />
    </main>
  );
};
export default ManageFarmAdmin;
