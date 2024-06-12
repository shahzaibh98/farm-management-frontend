import { Grid, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import {
  Notification,
  Paper,
  Select,
  Table,
  Text,
} from '../../../concave.agri/components';
import { SearchButton } from '../../../concave.agri/components/searchbar';
import ResetButton from '../../../concave.agri/components/searchbar/resetButton';

// Importing a custom hook to get the screen size
import useScreenSize from '../../../hooks/useScreenSize';

// Importing custom components and layouts
import { TableMenu } from '../../../layout';
import GenericHeader from '../../../layout/header.layout';
import SearchComponent from '../../../layout/searchBar.layout';

// Importing types and constants
import { useSelector } from 'react-redux';
import { deleteData, fetchData } from '../../../api/api';

import {
  initialNotification,
  paginationInfoValue,
} from '../../../utils/common/constant.objects';
import {
  extractPageInfo,
  handleSetParams,
  removeEmptyValueFilters,
} from '../../../utils/common/function';

import DeleteModel from '../../../layout/confimation.modal';
import { SearchFilter, initialSearchValues } from './initial.values';
import { handlePaginationValue } from '../../../utils/common/pagination.Helper';

const PlantingView = ({
  pageLabel,
  apiEndPoint,
  routeName,
}: {
  pageLabel: string;
  apiEndPoint: string;
  routeName: string;
}) => {
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
      searchParams.get('rowPerPage') ?? paginationInfo.rowPerPage;

    const currentPage = Number(
      searchParams.get('currentPage') ?? paginationInfo.currentPage?.toString()
    );

    setPaginationInfo({ ...paginationInfo, rowPerPage, currentPage });
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
  const [paginationInfo, setPaginationInfo] = useState(paginationInfoValue);

  // State for search values
  const [searchValues, setSearchValues] = useState(initialSearchValues);

  // State for notification
  const [notification, setNotification] = useState(initialNotification);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const [deleteInfo, setDeleteInfo] = useState({
    isOpened: false,
    id: '',
    resourceName: '',
  });

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchFilter>) => {
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));
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
        value: searchValues?.status,
      },
      {
        field: 'type',
        operator: 'eq',
        value: searchValues?.type,
      },
      {
        field: 'farmId',
        operator: 'eq',
        value: userInfo?.farmId?.toString(),
      },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    const fetchUrl = `${apiEndPoint}?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`;

    fetchData(fetchUrl)
      .then((response: any) => {
        // setTableData(response.data);
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
    deleteData(`${apiEndPoint}/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: `${pageLabel} is deleted successfully`,
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

  const handleViewClick = (id: string) => navigate(`/${routeName}/view/${id}`);
  const handleEditClick = (id: string) => navigate(`/${routeName}/edit/${id}`);

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  const columns = useMemo(
    () => [
      {
        header: <div className="flex text-start ml-2">PLANTING METHOD</div>,
        accessorKey: 'Planting Method',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex ml-2">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: <div className="flex text-start">ROW SPACING</div>,
        accessorKey: 'row spacing',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: any) => {
          const rowData = info?.row?.original;
          return (
            <div className="flex flex-row">
              <p className="text-center ml-4">{rowData?.type}</p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">SEED COMPANY</div>,
        accessorKey: 'area',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
        cell: (info: any) => {
          const rowInfo = info?.row?.original;
          return (
            <div className="flex">
              <p className="text-center"></p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">ACTUAL YIELD</div>,
        accessorKey: 'soilType',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => {
          return (
            <div className="flex">
              <p className="text-center">{info.getValue()}</p>
            </div>
          );
        },
      },
      {
        header: 'PLANTING STATUS',
        accessorKey: 'status',
        size: 50, //starting column size
        minSize: 50, //enforced during column resizing
        maxSize: 200, //enforced during column resizing
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
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
              onDeleteClick={id =>
                setDeleteInfo({ isOpened: true, id, resourceName: pageLabel })
              }
              onEditClick={handleEditClick}
              onViewClick={handleViewClick}
            />
          );
        },
      },
    ],
    [tableData]
  );

  return (
    <main className={`w-full min-h-screen relative bg-darkColors-700`}>
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
        headerText={`${pageLabel}`}
        breadcrumbs={[{ title: `Manage ${pageLabel}`, href: '' }]}
        isAddOrUpdateButton
        buttonContent={`Add ${pageLabel}`}
        onButtonClick={() => navigate(`/${routeName}/add`)}
      />

      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <div className="mt-4">
          <SearchComponent
            placeholder="Search by crop name..."
            searchValue={searchValues.searchValue}
            setValuesById={setValuesById}
            handleSearchButtonClick={() => handlePagination('goto', 1)}
            handleResetButtonClick={handleResetButtonClick}
          />
          <Grid className="mt-2">
            <Grid.Col span={{ base: 12, md: 6, lg: 2.5 }}>
              <Select
                placeholder="Location Type"
                data={[{ label: 'All', value: 'All' }]}
                value={searchValues.type ?? ''}
                onChange={value => value && setValuesById({ type: value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 2.5 }}>
              <Select
                placeholder="Location Status"
                data={[{ label: 'All', value: 'All' }]}
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
      <DeleteModel
        onDelete={handleDeleteById}
        id={deleteInfo?.id}
        opened={deleteInfo?.isOpened}
        setOpened={() =>
          setDeleteInfo({
            isOpened: false,
            id: '',
            resourceName: '',
          })
        }
        resourceName={deleteInfo?.resourceName}
      />
    </main>
  );
};
export default PlantingView;
