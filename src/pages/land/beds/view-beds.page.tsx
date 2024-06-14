import { Center, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import {
  Notification,
  Paper,
  Table,
  Text,
} from '../../../concave.agri/components';

// Importing a custom hook to get the screen size

// Importing custom components and layouts
import { TableMenu } from '../../../layout';
import GenericHeader from '../../../layout/header.layout';
import SearchComponent from '../../../layout/searchBar.layout';

// Importing types and constants
import { useSelector } from 'react-redux';
import { deleteData, fetchData } from '../../../api/api';
import DeleteModel from '../../../layout/confimation.modal';
import {
  initialNotification,
  paginationInfoValue,
} from '../../../utils/common/constant.objects';
import {
  extractPageInfo,
  getReferenceName,
  handleSetParams,
  isEmpty,
  removeEmptyValueFilters,
} from '../../../utils/common/function';
import { ReactComponent as FarmIcon } from '../../../assets/svg/farm-boundary.svg';
import {
  SearchFilter,
  initialMapModalInfo,
  initialSearchValues,
} from './initial.values';
import LocationSearch from '../land/searchLocation';
import { handlePaginationValue } from '../../../utils/common/pagination.Helper';

const BedsView = () => {
  const initializeStateFromQueryParams = () => {
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;
    const status = searchParams.get('status') ?? initialSearchValues.status;
    return { searchValue, status };
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
  const { id } = useParams(); // Getting the ID from URL params
  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();

  const [paginationInfo, setPaginationInfo] = useState(
    initialPaginationFromQueryParams()
  );
  const [searchValues, setSearchValues] = useState(
    initializeStateFromQueryParams()
  );
  const [notification, setNotification] = useState(initialNotification);
  // State for notification

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);

  const [allLocationData, setAllLocationData] = useState<any[]>();

  const navigate = useNavigate();

  const [mapModalDetails, setMapModalDetails] = useState(initialMapModalInfo);

  const [deleteInfo, setDeleteInfo] = useState({
    isOpened: false,
    id: '',
    resourceName: '',
  });

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  useEffect(() => {
    getAllLandsAgainstFarm();
  }, [resetTable]);

  const getAllLandsAgainstFarm = () => {
    const filters = removeEmptyValueFilters([
      {
        field: 'farmId',
        operator: 'eq',
        value: userInfo?.farmId?.toString(),
      },
      {
        field: 'landId',
        operator: 'eq',
        value: id,
      },
      { field: 'isBed', operator: 'eq', value: true },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    const fetchUrl = `bed?filter=${filterObject}`;

    fetchData(fetchUrl)
      .then((response: any) => {
        setAllLocationData(response?.data);
      })
      .catch((error: any) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleViewAllLocation = () => {
    setMapModalDetails({
      ...mapModalDetails,
      isOpened: true,
      isMultiple: true,
      isReadOnly: true,
      data: allLocationData,
    });
  };

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

  // Function to set values based on identifiers
  const setValuesById = (valuesById: Partial<SearchFilter>) => {
    setSearchValues((prevFormValues: any) => ({
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
        field: 'landId',
        operator: 'eq',
        value: id,
      },
      { field: 'isBed', operator: 'eq', value: true },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    const fetchUrl = `bed?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`;

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
    deleteData(`bed/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Bed is deleted successfully',
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

  const handleEditClick = (navId: string) =>
    navigate(`/lands/${id}/beds/edit/${navId}`);
  const handleViewClick = (navId: string) =>
    navigate(`/lands/${id}/beds/view/${navId}`);

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  const columns = useMemo(
    () => [
      {
        header: <div className="flex text-start ml-2">NAME</div>,
        accessorKey: 'name',

        cell: (info: any) => {
          const id = info?.row?.original?.bedId;
          return (
            <div className="flex ml-2" onClick={() => handleViewClick(id)}>
              <p className="text-center">{info.getValue()}</p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">LENGTH</div>,
        accessorKey: 'length',

        cell: (info: any) => {
          const rowData = info?.row?.original;
          return (
            <div className="flex flex-row">
              <p className="text-center ml-4">{rowData?.length}</p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">WIDTH</div>,
        accessorKey: 'width',

        cell: (info: any) => {
          const rowData = info?.row?.original;

          return (
            <div className="flex flex-row">
              <p className="text-center ml-4">{rowData?.width}</p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">AREA</div>,
        accessorKey: 'area',

        cell: (info: any) => {
          const rowInfo = info?.row?.original;
          return (
            <div className="flex">
              <p className="text-center">
                {`${Number(rowInfo?.area) > 0.01 ? Number(rowInfo?.area).toFixed(2) + ' ' + getReferenceName('areaUnit', rowInfo?.areaUnitId) : Number(rowInfo?.area) === 0 ? '' : 'Less than 0.01'} `}
              </p>
            </div>
          );
        },
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
                  onClick={() =>
                    setMapModalDetails({
                      isOpened: true,
                      isReadOnly: true,
                      isMultiple: false,
                      data: rowData,
                    })
                  }
                />
              </Center>
            )
          );
        },
      },
      {
        header: 'Action',
        accessorKey: 'bedId',
        cell: (info: any) => {
          const id = info?.row?.original?.bedId;
          return (
            <Center>
              <TableMenu
                id={id}
                onDeleteClick={id =>
                  setDeleteInfo({ isOpened: true, id, resourceName: 'Bed' })
                }
                onEditClick={handleEditClick}
                onViewClick={handleViewClick}
              />
            </Center>
          );
        },
      },
    ],
    [tableData]
  );

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
        headerText="Beds"
        breadcrumbs={[
          { title: 'Land', href: '/lands' },
          { title: 'Manage Beds', href: '' },
        ]}
        isAddOrUpdateButton={false}
        secondButtonContent="View All Beds"
        isSecondButton={allLocationData && allLocationData?.length > 0}
        onSecondButtonClick={handleViewAllLocation}
      />

      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
      >
        <div className="mt-4">
          <SearchComponent
            placeholder="Search by name..."
            searchValue={searchValues.searchValue}
            setValuesById={setValuesById}
            handleSearchButtonClick={() => handlePagination('goto', 1)}
            handleResetButtonClick={handleResetButtonClick}
          />
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
            onClose={() => setMapModalDetails(initialMapModalInfo)}
            opened={mapModalDetails?.isOpened}
            title={'Location Boundaries'}
            size={'xl'}
            centered={true} // true,
          >
            <LocationSearch
              onLocationSelect={() => {}}
              onClose={() => setMapModalDetails(initialMapModalInfo)}
              isReadOnly={mapModalDetails?.isReadOnly}
              data={mapModalDetails?.data}
              isMultiple={mapModalDetails?.isMultiple}
            />
          </Modal>
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

export default BedsView;
