import { Center, Grid, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
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
import { LandStatus, LandType } from '@agri/shared-types';
import { useSelector } from 'react-redux';
import { deleteData, fetchData } from '../../api/api';
import { ReactComponent as FarmIcon } from '../../assets/svg/farm-boundary.svg';
import {
  initialModalInfo,
  initialNotification,
  paginationInfoValue,
} from '../../utils/common/constant.objects';
import {
  extractPageInfo,
  isEmpty,
  removeEmptyValueFilters,
} from '../../utils/common/function';
import { SearchFilter, initialSearchValues } from './initial.values';
import LocationSearch from './searchLocation';

const LandView = () => {
  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;
    const type = searchParams.get('type') ?? initialSearchValues.type;
    const status = searchParams.get('status') ?? initialSearchValues.status;

    // Update state with extracted values
    return {
      searchValue,
      type,
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
  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);
  const [open, setOpen] = useState(false);

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();

  // State for pagination information
  const [paginationInfo, setPaginationInfo] = useState(
    initialPaginationFromQueryParams()
  );

  // State for search values
  const [searchValues, setSearchValues] = useState<SearchFilter>(
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

  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchFilter>) => {
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

    const filters = removeEmptyValueFilters([
      {
        field: 'name',
        operator: 'like',
        value: searchValues.searchValue,
      },
      {
        field: 'status',
        operator: 'eq',
        value: searchValues?.status ?? '',
      },
      {
        field: 'type',
        operator: 'eq',
        value: searchValues?.type ?? '',
      },
      {
        field: 'farmId',
        operator: 'eq',
        value: userInfo?.farmId?.toString(),
      },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    const fetchUrl = `land?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`;

    fetchData(fetchUrl)
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
      searchParams.get('rowPerPage') ?? paginationInfoValue.rowPerPage;
    const currentPage = Number(
      searchParams.get('currentPage') ??
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
    deleteData(`land/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Land is deleted successfully',
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
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  const columns = useMemo(
    () => [
      {
        header: 'LAND NAME',
        accessorKey: 'name',
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
        header: 'LAND TYPE',
        accessorKey: 'type',
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
        header: 'AREA',
        accessorKey: 'area',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: any) => {
          const rowInfo = info?.row?.original;
          return (
            <div className="flex items-center justify-center">
              <p className="text-sm lg:text-base text-center">
                {`${rowInfo?.area}  ${rowInfo?.areaUnit}`}
              </p>
            </div>
          );
        },
      },
      {
        header: 'SOIL TYPE',
        accessorKey: 'soilType',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => {
          return (
            <div className="flex items-center justify-center">
              <p className="text-sm lg:text-base text-center">
                {info.getValue()}
              </p>
            </div>
          );
        },
      },
      {
        header: 'STATUS',
        accessorKey: 'status',
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
        header: 'BOUNDARIES',
        accessorKey: 'coordinates',
        cell: (info: any) => {
          const rowData = info?.row?.original;
          return (
            !isEmpty(rowData?.coordinates) && (
              <Center mt={5}>
                <FarmIcon
                  height={24}
                  width={24}
                  opacity={0.8}
                  className="cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </Center>
            )
          );
        },
      },
      {
        header: '',
        accessorKey: 'landId',
        size: 55, //starting column size
        minSize: 55, //enforced during column resizing
        maxSize: 55, //enforced during column resizing
        cell: (info: any) => {
          const id = info?.row?.original?.landId;
          return (
            <TableMenu
              id={id}
              onDeleteClick={handleDeleteById}
              onEditClick={() => navigate(`/lands/edit/${id}`)}
              onViewClick={() => navigate(`/lands/view/${id}`)}
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
          placeholder="Search by name..."
          searchValue={searchValues.searchValue}
          setValuesById={setValuesById}
          handleSearchButtonClick={handleSearchButtonClick}
          handleResetButtonClick={handleResetButtonClick}
        />
        <Grid className="mt-2">
          <Grid.Col span={{ base: 12, md: 6, lg: 2.5 }}>
            <Select
              placeholder="Land Type"
              data={[...Object.values(LandType)]}
              value={searchValues.type ?? ''}
              onChange={value => value && setValuesById({ type: value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 2.5 }}>
            <Select
              placeholder="Land Status"
              data={[...Object.values(LandStatus)]}
              value={searchValues.status ?? ''}
              onChange={value => value && setValuesById({ status: value })}
            />
          </Grid.Col>
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
        // onButtonClick={() => setOpen(true)} // Call handleAddTask function when button is clicked
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
          <Modal
            styles={{
              title: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: theme.colors.primaryColors[0],
              },
            }}
            transitionProps={{ transition: 'fade-up', duration: 300 }}
            onClose={() => setOpen(false)}
            opened={!true}
            title={'Land Boundaries'}
            size={'xl'}
          >
            <LocationSearch
              onLocationSelect={() => {}}
              isReadOnly={!true}
              color="#800080"
            />
          </Modal>
        </div>
      </Paper>

      <div className="h-4" />
    </main>
  );
};
export default LandView;
