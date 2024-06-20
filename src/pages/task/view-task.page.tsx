import { Center, Grid, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { SetStateAction, useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { CiCalendarDate, CiViewTable } from 'react-icons/ci'; // Importing icons from 'react-icons/ci'
import { useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

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
  handleSetParams,
  removeEmptyValueFilters,
} from '../../utils/common/function';
import MyCalendar from '../calendar/calendar';
import { initialSearchValues } from './initial.values';
import { TaskForm } from './task.form';
import { TaskStatus } from '@agri/shared-types';
import { handlePaginationValue } from '../../utils/common/pagination.Helper';

const TaskView = () => {
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
  const userInfo = useSelector(
    (state: any) => state?.userInfo?.currentFarmRole
  );

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

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  const handleAddTask = () => setModalInfo({ ...modalInfo, isOpen: true });

  useEffect(() => {
    const initialQueryParam = initializeStateFromQueryParams();
    const initialPagination = initialPaginationFromQueryParams();
    setSearchValues(initialQueryParam);
    setPaginationInfo(initialPagination);
    setResetTable(!resetTable);
  }, [searchParams]);

  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const currentUser = isSystemAdmin
    ? 0
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole
      : currentRole?.currentCompanyRole;

  useEffect(() => {
    fetchData(
      `farm-user?filter={"filter":[{"field":"farmId","operator":"eq","value":${currentUser.farmId}}]}`
    )
      .then((response: any) => {
        console.log('Response', response);
        const users = response.data?.map(
          (user: { systemUser: { name: any; userId: any } }) => {
            return {
              label: user.systemUser.name,
              value: user.systemUser.userId?.toString(),
            };
          }
        );
        console.log('Users', users);
        const newArray = [
          { label: 'Me', value: userInfo.userId?.toString() },
          { label: 'Others', value: 'Others' },
          { label: 'All', value: 'All' },
          ...users.filter(
            (user: { label: string; value: string }) =>
              user.value !== userInfo.userId?.toString()
          ),
        ];
        setUserList(newArray);
      })
      .catch(() => {
        const newArray = [
          { label: 'Me', value: currentUser?.userId?.toString() },
          { label: 'Others', value: 'Others' },
          { label: 'All', value: 'All' },
        ];
        setUserList(newArray);
      });
  }, []);
  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchValuesType>) => {
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));
  };

  const handleFetchDataByFilter = () => {
    setIsLoading(true);
    const filters = removeEmptyValueFilters([
      {
        field: 'taskTitle',
        operator: 'like',
        value: searchValues.searchValue,
      },
      {
        field: 'assignedTo',
        operator: searchValues?.assignedTo === 'Others' ? 'neq' : 'eq',
        value:
          searchValues?.assignedTo === 'All'
            ? ''
            : (searchValues?.assignedTo === 'Others'
                ? userInfo?.userId
                : searchValues?.assignedTo) ?? '', // Default value: 'All' or userInfo?.userId, // Default value: 'Me'
      },
      {
        field: 'associatedTo',
        operator: 'eq',
        value: searchValues?.associatedTo ?? '',
      },
      {
        field: 'taskStatus',
        operator: 'eq',
        value: searchValues?.progress, // Default value: 'In Progress'
      },
      {
        field: 'startDateTime',
        operator: 'gte',
        value:
          searchValues?.upcomingTask === 'Custom Range'
            ? searchValues?.dateRange[0]?.toISOString()
            : getDateRange(searchValues?.upcomingTask ?? '')[0],
      },
      {
        field: 'startDateTime',
        operator: 'lte',
        value:
          searchValues?.upcomingTask === 'Custom Range'
            ? searchValues?.dateRange[1]?.toISOString()
            : getDateRange(searchValues?.upcomingTask ?? '')[1],
      },
      {
        field: 'farmId',
        operator: 'eq',
        value: userInfo?.farmId?.toString(),
      },
    ]);

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
      .catch((error: any) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchButtonClick = () => {
    handleSetParams(
      searchParams,
      searchValues,
      initialSearchValues,
      setSearchParams
    );
    handleFetchDataByFilter();
  };

  const handleNotificationClose = () => setNotification(initialNotification);
  const handlePagination = (actionType: string, value?: any) =>
    handlePaginationValue(
      actionType,
      value,
      searchParams,
      paginationInfo,
      setPaginationInfo,
      setSearchParams
    );

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
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, activeTab]);

  useEffect(() => {
    const newSearchValues = initializeStateFromQueryParams();
    const newPaginationInfo = initialPaginationFromQueryParams();

    if (JSON.stringify(newSearchValues) !== JSON.stringify(searchValues)) {
      setSearchValues(newSearchValues);
    }

    if (JSON.stringify(newPaginationInfo) !== JSON.stringify(paginationInfo)) {
      setPaginationInfo(newPaginationInfo);
    }
  }, [searchParams]);

  const columns = useMemo(
    () => [
      {
        header: 'TITLE',
        accessorKey: 'taskTitle',

        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: 'ASSIGNED TO',

        cell: (info: any) => {
          const rowData = info?.row?.original;
          return (
            <div className="flex items-center justify-center">
              <p className="text-center">
                {rowData?.assigned?.systemUser?.name}
              </p>
            </div>
          );
        },
      },
      {
        header: 'ASSOCIATED TO',
        accessorKey: 'associatedTo',

        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: 'PRIORITY',
        accessorKey: 'priority',

        cell: (info: { getValue: () => any }) => {
          const priority = info.getValue();
          return (
            <div className="flex flex-wrap">
              <div
                className={`w-3 h-3 rounded-full m-1 mr-2 ${priority === 'Low' ? 'bg-green-light' : priority === 'Medium' ? 'bg-yellow-light' : 'bg-red-light'}`}
              />
              <Text>{priority}</Text>
            </div>
          );
        },
      },
      {
        header: 'STATUS',
        accessorKey: 'taskStatus',
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: 'START DATE',
        accessorKey: 'startDateTime',
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">
              {formatTimestamp(info.getValue()) ?? ''}
            </p>
          </div>
        ),
      },
      {
        header: <div className="flex text-start">Action</div>,
        accessorKey: 'taskId',
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
          handleSearchButtonClick={() => handlePagination('goto', 1)}
          handleResetButtonClick={handleResetButtonClick}
        />
        <Grid className="mt-2">
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Assigned To"
              data={userList}
              value={searchValues.assignedTo ?? ''}
              onChange={value => value && setValuesById({ assignedTo: value })}
              // allowDeselect={false}
              searchable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Associated To"
              data={[]}
              value={searchValues.associatedTo ?? ''}
              onChange={value => setValuesById({ associatedTo: value })}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Progress"
              data={['All', ...Object.values(TaskStatus)]}
              value={searchValues.progress ?? ''}
              onChange={value => value && setValuesById({ progress: value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Upcoming Task"
              data={[
                'All',
                'Today',
                'Tomorrow',
                'This Week',
                'Next Week',
                'Next Month',
                'Custom Range',
              ]}
              value={searchValues?.upcomingTask ?? ''}
              onChange={value => setValuesById({ upcomingTask: value })}
            />
          </Grid.Col>
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
    <main className={'w-full min-h-screen relative bg-darkColors-700'}>
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
        headerText="Task"
        breadcrumbs={[{ title: 'Manage Task', href: '' }]}
        isAddOrUpdateButton
        buttonContent="Add Task"
        onButtonClick={handleAddTask} // Call handleAddTask function when button is clicked
      />

      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <Tabs
          onChange={value => setActiveTab(value)}
          tabs={[
            {
              value: 'Table',
              label: 'Table',
              icon: <CiViewTable size={24} />,
              component: (
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
              ),
            },
            {
              value: 'Calendar',
              label: 'Calendar',
              icon: <CiCalendarDate size={24} />,
              component: (
                <div className="mt-5">
                  {searchAndFilter()}
                  <div className="h-4" />
                  <MyCalendar
                    taskList={tableData}
                    handleClickTask={(object: any) => {
                      setModalInfo({
                        isOpen: true,
                        type: 'Edit',
                        objectData: object,
                        isReadOnly: false,
                      });
                    }}
                  />
                </div>
              ),
            },
          ]}
        ></Tabs>
      </Paper>
      <Modal
        opened={modalInfo.isOpen}
        onClose={() => setModalInfo(initialModalInfo)}
        title={`${modalInfo.type} Task`}
        size="lg"
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.colors.primaryColors[0],
          },
        }}
        className="addtaskModal"
        transitionProps={{ transition: 'fade-up', duration: 300 }}
      >
        <TaskForm
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
export default TaskView;
