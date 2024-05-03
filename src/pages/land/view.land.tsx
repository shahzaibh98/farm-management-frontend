import { Center, Grid, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { SetStateAction, useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { CiCalendarDate, CiViewTable } from 'react-icons/ci'; // Importing icons from 'react-icons/ci'
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import {
  DatePicker,
  Notification,
  Paper,
  Select,
  Table,
  Tabs,
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
import { useSelector } from 'react-redux';
import { deleteData, fetchData } from '../../api/api';
import { SearchValuesType } from '../../types/view-task.type';
import {
  initialModalInfo,
  initialNotification,
  paginationInfoValue,
} from '../../utils/common/constant.objects';
import {
  extractPageInfo,
  formatTimestamp,
  getDateRange,
  removeEmptyValueFilters,
} from '../../utils/common/function';
import { initialSearchValues } from './initial.values';

const LandView = () => {
  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') || initialSearchValues.searchValue;
    const assignedTo =
      searchParams.get('assignedTo') || initialSearchValues.assignedTo;
    const associatedTo =
      searchParams.get('associatedTo') || initialSearchValues.associatedTo;
    const progress =
      searchParams.get('progress') || initialSearchValues.progress;
    const upcomingTask =
      searchParams.get('upcomingTask') || initialSearchValues.upcomingTask;
    const dateRangeStart = searchParams.get('dateRangeStart');
    const dateRangeEnd = searchParams.get('dateRangeEnd');

    // Convert dateRangeStart and dateRangeEnd to date objects
    let dateRange: [Date | null, Date | null] = [null, null];
    if (dateRangeStart && dateRangeEnd) {
      dateRange = [
        new Date(dateRangeStart) ?? null,
        new Date(dateRangeEnd) ?? null,
      ];
    }

    // Update state with extracted values
    return {
      searchValue,
      assignedTo,
      associatedTo,
      progress,
      upcomingTask,
      dateRange,
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
  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();

  // State for pagination information
  const [paginationInfo, setPaginationInfo] = useState(
    initialPaginationFromQueryParams()
  );

  // State for search values
  const [searchValues, setSearchValues] = useState<SearchValuesType>(
    initializeStateFromQueryParams()
  );

  // State for notification
  const [notification, setNotification] = useState(initialNotification);
  const [modalInfo, setModalInfo] = useState(initialModalInfo);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);
  const [userList, setUserList] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState('Table');

  const navigate = useNavigate();

  const handleAddFarmAdmin = () => {
    navigate('/lands/add');
  };

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  const handleAddLand = () => setModalInfo({ ...modalInfo, isOpen: true });

  useEffect(() => {
    initializeStateFromQueryParams();
    initialPaginationFromQueryParams();
  }, [searchParams]);

  useEffect(() => {
    fetchData(
      `users?rpp=10&page=1&filter={"filter":[{"field":"farmId","operator":"eq","value":${userInfo.farmId}}]}`
    )
      .then((response: any) => {
        const users = response.data?.map((user: { name: any; userId: any }) => {
          return { label: user.name, value: user.userId?.toString() };
        });
        const newArray = [
          { label: 'Me', value: userInfo.farmId?.toString() },
          { label: 'Others', value: 'Others' },
          { label: 'All', value: 'All' },
          ...users,
        ];
        setUserList(newArray);
      })
      .catch(error => {
        const newArray = [
          { label: 'Me', value: userInfo.farmId?.toString() },
          { label: 'Others', value: 'Others' },
          { label: 'All', value: 'All' },
        ];
        setUserList(newArray);
        console.log(error);
      });
  }, []);
  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchValuesType>) => {
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
          newParams.set('dateRangeStart', value[0].toISOString());
        }
        if (value[1]) {
          newParams.set('dateRangeEnd', value[1].toISOString());
        }
      } else if (value) {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const handleFetchDataByFilter = () => {
    setIsLoading(true);

    const filters = removeEmptyValueFilters([]);

    const filterObject = JSON.stringify({ filter: filters });

    const tableFetchUrl = `task?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}&{"task.startDateTime":"ASC"}`;
    const calendarFetchUrl = `task?filter=${filterObject}&{"task.startDateTime":"ASC"}`;

    fetchData(activeTab === 'Table' ? tableFetchUrl : calendarFetchUrl)
      .then((response: any) => {
        setTableData(response.data);
        const getPages = extractPageInfo(response.pages);
        setPaginationInfo({
          ...paginationInfo,
          totalRecords: response.total,
          totalPages: getPages?.totalPages ?? 0,
        });
      })
      .catch((error: any) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchButtonClick = () => {
    handleSetParams();
    handleFetchDataByFilter();
  };

  const handleNotificationClose = () => setNotification(initialNotification);
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
    deleteData(`task/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Task is deleted successfully',
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

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [
    resetTable,
    paginationInfo?.currentPage,
    paginationInfo?.rowPerPage,
    activeTab,
  ]);

  const columns = useMemo(
    () => [
      {
        header: 'TITLE',
        accessorKey: 'taskTitle',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'ASSIGNED TO',
        accessorKey: 'assigned',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name ?? ''}
            </p>
          </div>
        ),
      },
      {
        header: 'ASSOCIATED TO',
        accessorKey: 'associatedTo',
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
        header: 'PRIORITY',
        accessorKey: 'priority',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => {
          const priority = info.getValue();
          return (
            <Center>
              <div className="flex flex-wrap">
                <div
                  className={`w-3 h-3 rounded-full m-1 mr-2 ${priority === 'Low' ? 'bg-green-light' : priority === 'Medium' ? 'bg-yellow-light' : 'bg-red-light'}`}
                />
                <Text>{priority}</Text>
              </div>
            </Center>
          );
        },
      },
      {
        header: 'STATUS',
        accessorKey: 'taskStatus',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'DUE DATE',
        accessorKey: 'endDateTime',
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {formatTimestamp(info.getValue()) ?? ''}
            </p>
          </div>
        ),
      },
      {
        header: '',
        accessorKey: 'taskId',
        size: 55, //starting column size
        minSize: 55, //enforced during column resizing
        maxSize: 55, //enforced during column resizing
        cell: (info: any) => {
          const id = info?.row?.original?.taskId;
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
            />
          );
        },
      },
    ],
    [tableData]
  );

  const searchAndFilter = () => {
    return (
      <>
        <SearchComponent
          placeholder="Search by title..."
          searchValue={searchValues.searchValue}
          setValuesById={setValuesById}
          handleSearchButtonClick={handleSearchButtonClick}
          handleResetButtonClick={handleResetButtonClick}
        />
        <Grid className="mt-2">
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}></Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}></Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}></Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}></Grid.Col>
          {searchValues?.upcomingTask === 'Custom Range' && (
            <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
              <DatePicker
                type="range"
                placeholder="Select a date range"
                value={searchValues.dateRange ?? ''}
                onChange={value =>
                  setValuesById({
                    dateRange: value as [Date | null, Date | null],
                  })
                }
              />
            </Grid.Col>
          )}

          {isSmallScreen && (
            <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
              <div className="flex flex-row justify-between">
                <SearchButton onSearchButtonClick={handleSearchButtonClick} />
                <ResetButton onResetButtonClick={handleResetButtonClick} />
              </div>
            </Grid.Col>
          )}
        </Grid>
      </>
    );
  };

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
        headerText="Land"
        breadcrumbsText="Manage Land"
        isAddOrUpdateButton
        buttonContent="Add Land"
        onButtonClick={handleAddFarmAdmin} // Call handleAddTask function when button is clicked
      />

      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <div className="mt-4">
          {searchAndFilter()}
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
export default LandView;
