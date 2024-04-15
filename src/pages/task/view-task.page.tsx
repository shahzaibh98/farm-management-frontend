import { Center, Grid } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DatePicker,
  Paper,
  Select,
  Table,
  Text,
} from '../../concave.agri/components';

import { useSearchParams } from 'react-router-dom';
import { SearchButton } from '../../concave.agri/components/searchbar';
import ResetButton from '../../concave.agri/components/searchbar/resetButton';
import useScreenSize from '../../hooks/useScreenSize';
import { TableMenu } from '../../layout';
import GenericHeader from '../../layout/header.layout';
import SearchComponent from '../../layout/searchBar.layout';
import { SearchValuesType } from '../../types/view-task.type';
import { paginationInfoValue } from '../../utils/common/constant.function';
import { initialSearchValues } from './initial.values';

const TaskView = () => {
  /* /////////////////////////////////////////////////
                       Variable
  /////////////////////////////////////////////////// */

  const navigate = useNavigate();
  const { isSmallScreen } = useScreenSize();

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState(paginationInfoValue);
  const [searchValues, setSearchValues] =
    useState<SearchValuesType>(initialSearchValues);

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') || searchValues.searchValue;
    const assignedTo =
      searchParams.get('assignedTo') || searchValues.assignedTo;
    const associatedTo =
      searchParams.get('associatedTo') || searchValues.associatedTo;
    const progress = searchParams.get('progress') || searchValues.progress;
    const upcomingTask =
      searchParams.get('upcomingTask') || searchValues.upcomingTask;
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
    setSearchValues({
      searchValue,
      assignedTo,
      associatedTo,
      progress,
      upcomingTask,
      dateRange,
    });
  };

  useEffect(() => {
    initializeStateFromQueryParams();
  }, [searchParams]);

  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchValuesType>) => {
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));
  };

  const handleSetParams = () => {
    const newParams = new URLSearchParams();
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

  const handleFetchDataByFilter = () => {};

  const handleSearchButtonClick = () => {
    handleSetParams();
    handleFetchDataByFilter();
  };

  const defaultData = [
    {
      id: 1,
      title: 'Task 1',
      assigned_to: 'John Doe',
      associated_to: 'Project X',
      priority: 'High',
      status: 'In Progress',
      due_date: '2024-04-10',
    },
    {
      id: 2,
      title: 'Task 2',
      assigned_to: 'Jane Smith',
      associated_to: 'Project Y',
      priority: 'Medium',
      status: 'Pending',
      due_date: '2024-04-15',
    },
    {
      id: 3,
      title: 'Task 3',
      assigned_to: 'Alice Johnson',
      associated_to: 'Project Z',
      priority: 'Low',
      status: 'Completed',
      due_date: '2024-04-20',
    },
    {
      id: 4,
      title: 'Task 4',
      assigned_to: 'Bob Brown',
      associated_to: 'Project X',
      priority: 'High',
      status: 'In Progress',
      due_date: '2024-04-25',
    },
    {
      id: 5,
      title: 'Task 5',
      assigned_to: 'Bob Brown',
      associated_to: 'Project X',
      priority: 'High',
      status: 'In Progress',
      due_date: '2024-04-25',
    },
  ];

  const handlePagination = (actionType: string, value?: any) => {
    actionType === 'next'
      ? setPaginationInfo(prevState => ({
          ...prevState,
          currentPage: prevState.currentPage + 1,
        }))
      : actionType === 'previous'
        ? setPaginationInfo(prevState => ({
            ...prevState,
            currentPage: prevState.currentPage - 1,
          }))
        : actionType === 'goto'
          ? setPaginationInfo(prevState => ({
              ...prevState,
              currentPage: value,
            }))
          : actionType === 'rowPerPage' &&
            setPaginationInfo(prevState => ({
              ...prevState,
              rowPerPage: value,
            }));
  };

  const handleResetButtonClick = () => {
    setSearchParams({});
    setSearchValues(initialSearchValues);
  };

  const columns = useMemo(
    () => [
      {
        header: 'TITLE',
        accessorKey: 'title',
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
        header: 'ASSIGNED TO',
        accessorKey: 'assigned_to',
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
        header: 'ASSOCIATED TO',
        accessorKey: 'associated_to',
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
        accessorKey: 'status',
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
        header: 'DUE DATE',
        accessorKey: 'due_date',
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
        header: '',
        accessorKey: 'status',
        size: 55, //starting column size
        minSize: 55, //enforced during column resizing
        maxSize: 55, //enforced during column resizing
        cell: () => <TableMenu />,
      },
    ],
    []
  );
  return (
    <main className={`w-full h-screen relative bg-darkColors-700`}>
      <GenericHeader
        headerText="Task"
        breadcrumbsText="Manage Task"
        isAddOrUpdateButton
        buttonContent="Add Task"
        onButtonClick={() => navigate('add')}
      />
      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <SearchComponent
          searchValue={searchValues.searchValue}
          setValuesById={setValuesById}
          handleSearchButtonClick={handleSearchButtonClick}
          handleResetButtonClick={handleResetButtonClick}
          isSmallScreen={isSmallScreen}
        />
        <Grid className="mt-2">
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Assigned To"
              data={['Me', 'Farm user 1', 'Farm user 2', 'Farm user 3']}
              value={searchValues.assignedTo ?? ''}
              clearable
              onChange={value => setValuesById({ assignedTo: value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Associated To"
              data={[]}
              value={searchValues.associatedTo ?? ''}
              clearable
              onChange={value => setValuesById({ associatedTo: value })}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <Select
              placeholder="Progress"
              data={['In Progress', 'Pending', 'Completed']}
              clearable
              value={searchValues.progress ?? ''}
              onChange={value => setValuesById({ progress: value })}
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
              clearable
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

        <Table
          isLoading={isLoading}
          data={defaultData}
          columns={columns}
          paginationInfo={paginationInfo}
          handlePagination={handlePagination}
        />
      </Paper>
      <div className="h-4" />
    </main>
  );
};
export default TaskView;
