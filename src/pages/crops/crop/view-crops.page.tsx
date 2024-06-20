import { Center, Grid, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

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
  Notification,
  Paper,
  Select,
  Table,
  Text,
} from '../../../concave.agri/components';
import {
  initialNotification,
  paginationInfoValue,
} from '../../../utils/common/constant.objects';
import {
  extractPageInfo,
  handleSetParams,
  removeEmptyValueFilters,
} from '../../../utils/common/function';
import { initialSearchValues } from './initial.values';
import { MdOutlineLineStyle } from 'react-icons/md';
import { handlePaginationValue } from '../../../utils/common/pagination.Helper';

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
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;
    const category =
      searchParams.get('category') ?? initialSearchValues.category;

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
  const [paginationInfo, setPaginationInfo] = useState(
    initialPaginationFromQueryParams()
  );
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
    setSearchValues((prevFormValues: any) => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));

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
    handleSetParams(
      searchParams,
      searchValues,
      initialSearchValues,
      setSearchParams
    );
    handleFetchDataByFilter();
  };

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

  const handleViewClick = (id: string) => navigate(`/${routeName}/view/${id}`);

  const handleEditClick = (id: string) => navigate(`/${routeName}/edit/${id}`);

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

  // Effect to update state when searchParams change
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

  const columns = useMemo(() => {
    return [
      {
        header: <div className="flex text-start ml-2 font-sans">Crop Name</div>,
        accessorKey: 'image',
        cell: (info: any) => {
          const cropInfo = info?.row?.original;
          return (
            <div className="flex ml-2">
              <p
                className="text-center"
                onClick={() => handleViewClick(cropInfo.refFarmCropId)}
              >
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
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: 'SEASON',
        accessorKey: 'cropType',
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: 'START METHOD',
        accessorKey: 'startMethod',
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-center">{info.getValue()}</p>
          </div>
        ),
      },
      {
        header: <div className="flex text-start">Action</div>,
        accessorKey: 'userId',
        cell: (info: any) => {
          const id = info?.row?.original?.refFarmCropId;
          return (
            <TableMenu
              id={id}
              onDeleteClick={handleDeleteById}
              onViewClick={handleViewClick}
              onEditClick={handleEditClick}
              additionalMenuItems={[
                {
                  label: 'Crop Plan',
                  icon: <MdOutlineLineStyle />,
                  onClick: () => navigate(`/crops/${id}/planning`),
                },
              ]}
            />
          );
        },
      },
    ];
  }, [resetTable, tableData]);

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
        headerText={pageLabel}
        breadcrumbs={[{ title: `Manage ${pageLabel}`, href: '' }]}
        isAddOrUpdateButton
        buttonContent={`Add ${pageLabel}`}
        onButtonClick={() => navigate(`/${routeName}/add`)} // Call handleAddFarmAdmin function when button is clicked
      />

      <Paper
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
        mih={'70%'}
      >
        <div className="mt-4">
          <SearchComponent
            placeholder="Search by name..."
            searchValue={searchValues.searchValue}
            setValuesById={setValuesById}
            handleSearchButtonClick={() => {
              handlePagination('goto', 1);
            }}
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
                  <SearchButton
                    onSearchButtonClick={() => {
                      handlePagination('goto', 1);
                    }}
                  />
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
