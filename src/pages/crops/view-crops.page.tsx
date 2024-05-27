import { Grid, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

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
import {
  Notification,
  Paper,
  Select,
  Table,
  Text,
} from '../../concave.agri/components';
import {
  initialNotification,
  paginationInfoValue,
} from '../../utils/common/constant.objects';
import {
  extractPageInfo,
  removeEmptyValueFilters,
} from '../../utils/common/function';
import { initialSearchValues } from './initial.values';

const ManageCrops = ({
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
    const category =
      searchParams.get('category') ?? initialSearchValues.category;

    // Update state with extracted values
    return {
      searchValue,
      category,
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
  const { roleId, ...userInfo } = useSelector(
    (state: any) => state?.userInfo?.userInfo
  );

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
  const [tableData, setTableData] = useState([]);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  /* /////////////////////////////////////////////////
                      functions
  /////////////////////////////////////////////////// */

  const navigate = useNavigate();

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

    const filters = removeEmptyValueFilters([
      {
        field: 'name',
        operator: 'like',
        value: searchValues.searchValue,
      },
      {
        field: 'category',
        operator: 'eq',
        value: searchValues?.category ?? '',
      },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    fetchData(
      `${apiEndPoint}?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}&orderBy={"ref_farm_crop.name": "ASC"}`
    )
      .then((response: any) => {
        setTableData(response.data);
        const getPages = extractPageInfo(response?.pages);
        setPaginationInfo({
          ...paginationInfo,
          totalRecords: response?.total,
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
    deleteData(`${apiEndPoint}/${id}`)
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

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  // Function to set values based on identifiers

  const columns = useMemo(() => {
    return [
      {
        header: <div className="flex text-start ml-2">CROP NAME</div>,
        accessorKey: 'image',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: any) => {
          const cropInfo = info?.row?.original;
          return (
            <div className="flex ml-2">
              <p className="text-sm lg:text-base text-center">
                <div className="flex items-center">
                  <img
                    src={cropInfo.image}
                    alt="Crop_Image"
                    className="rounded-full w-7 h-7 mr-3"
                    loading="lazy"
                  />
                  <p> {cropInfo.name}</p>
                </div>
              </p>
            </div>
          );
        },
      },
      {
        header: 'CATEGORY',
        accessorKey: 'category',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'SEASON',
        accessorKey: 'cropType',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()}
            </p>
          </div>
        ),
      },
      {
        header: 'START METHOD',
        accessorKey: 'startMethod',
        size: 50,
        minSize: 50,
        maxSize: 500,
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
        accessorKey: 'userId',
        size: 55,
        minSize: 55,
        maxSize: 55,
        cell: (info: any) => {
          const id = info?.row?.original?.refFarmCropId;
          return (
            <TableMenu
              id={id}
              onDeleteClick={handleDeleteById}
              onViewClick={id => navigate(`/${routeName}/view/${id}`)}
              onEditClick={() => navigate(`/${routeName}/edit/${id}`)}
            />
          );
        },
      },
    ];
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
        headerText={pageLabel}
        breadcrumbsText={`Manage ${pageLabel}`}
        isAddOrUpdateButton
        buttonContent={`Add ${pageLabel}`}
        onButtonClick={() => navigate(`/${routeName}/add`)} // Call handleAddFarmAdmin function when button is clicked
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
                placeholder="Category"
                data={[
                  'All',
                  'Browses',
                  'Important crops',
                  'Fruits and vegetables',
                  'Fodder',
                  'Oily crops commodities',
                  'Pulses',
                ]}
                value={searchValues.category ?? ''}
                onChange={value => setValuesById({ category: value })}
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
export default ManageCrops;
