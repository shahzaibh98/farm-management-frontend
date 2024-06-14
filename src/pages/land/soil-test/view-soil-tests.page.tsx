import { Center, Modal, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks
import { deleteData, fetchData } from '../../../api/api';
import {
  Notification,
  Paper,
  Table,
  Text,
} from '../../../concave.agri/components';
import { TableMenu } from '../../../layout';
import DeleteModel from '../../../layout/confimation.modal';
import GenericHeader from '../../../layout/header.layout';
import SearchComponent from '../../../layout/searchBar.layout';
import {
  initialNotification,
  paginationInfoValue,
} from '../../../utils/common/constant.objects';
import {
  extractPageInfo,
  formatTimestamp,
  handleSetParams,
  removeEmptyValueFilters,
} from '../../../utils/common/function';
import LocationSearch from '../land/searchLocation';
import {
  SearchFilter,
  initialMapModalInfo,
  initialSearchValues,
} from './initial.values';
import { handlePaginationValue } from '../../../utils/common/pagination.Helper';

const SoilTestView = () => {
  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;

    return {
      searchValue,
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
  const { id } = useParams(); // Getting the ID from URL params

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();

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

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  // State for table data
  const [tableData, setTableData] = useState([]);

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
        field: 'landId',
        operator: 'eq',
        value: id,
      },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    const fetchUrl = `soil-test?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`;

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
    deleteData(`soil-test/${id}`)
      .then(() => {
        setNotification({
          isSuccess: true,
          message: 'Successfully deleted soil test',
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

  const handleViewClick = (navId: string) =>
    navigate(`/lands/${id}/soil-tests/view/${navId}`);
  const handleEditClick = (navId: string) =>
    navigate(`/lands/${id}/soil-tests/edit/${navId}`);

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  const columns = useMemo(
    () => [
      {
        header: <div className="flex text-start ml-2">REPORT DATE</div>,
        accessorKey: 'testReportDate',

        cell: (info: any) => {
          const id = info?.row?.original?.soilTestId;
          return (
            <div className="flex ml-2" onClick={() => handleViewClick(id)}>
              <p className="text-center hover:text-secondaryColors-100">
                {formatTimestamp(info.getValue()) ?? ''}
              </p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">LABORATORY NAME</div>,
        accessorKey: 'laboratoryName',

        cell: (info: { getValue: () => any }) => (
          <div className="flex ml-2">
            <p className="text-center hover:cursor-default">
              {info.getValue() ?? ''}
            </p>
          </div>
        ),
      },
      {
        header: <div className="flex text-start">SOIL TYPE</div>,
        accessorKey: 'soilType',

        cell: (info: any) => {
          const rowData = info?.row?.original;
          return (
            <div className="flex flex-row">
              <p className="text-center ml-4">{info.getValue()?.name ?? ''}</p>
            </div>
          );
        },
      },
      {
        header: <div className="flex text-start">PH</div>,
        accessorKey: 'pH',

        cell: (info: { getValue: () => any }) => (
          <div className="flex ml-2">
            <p className="text-center">
              {info.getValue() ? info.getValue() + ' %' : ''}
            </p>
          </div>
        ),
      },
      {
        header: <div className="flex text-start">EC</div>,
        accessorKey: 'eC',

        cell: (info: { getValue: () => any }) => (
          <div className="flex ml-2">
            <p className="text-center">
              {info.getValue() ? info.getValue() + ' %' : ''}
            </p>
          </div>
        ),
      },

      {
        header: 'Action',
        accessorKey: 'soilTestId',
        cell: (info: any) => {
          const id = info?.row?.original?.soilTestId;
          return (
            <Center>
              <TableMenu
                id={id}
                onDeleteClick={id =>
                  setDeleteInfo({
                    isOpened: true,
                    id,
                    resourceName: 'Soil Test',
                  })
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
        headerText="Soil Test"
        breadcrumbs={[
          // { title: 'Lands', href: '/lands' },
          { title: 'Soil Test', href: '' },
        ]}
        isAddOrUpdateButton={true}
        buttonContent="Add Soil Test"
        onButtonClick={() => navigate(`/lands/${id}/soil-tests/add`)}
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
export default SoilTestView;
