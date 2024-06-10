import { Grid, useMantineTheme } from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { useParams, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import { useNavigate } from 'react-router-dom';
import { Paper, Select, Table, Text } from '../../../concave.agri/components';
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
import { Notification } from '../../../concave.agri/components';
import { User } from '../../../types/view-farm-admin.type';
import {
  initialNotification,
  paginationInfoValue,
} from '../../../utils/common/constant.objects';
import {
  capitalizeFirstLetter,
  extractPageInfo,
  handleSetParams,
  organizeDropDownData,
  removeEmptyValueFilters,
} from '../../../utils/common/function';
import {
  getDistricts,
  getDivisions,
  getTehsils,
  handleDistrict,
  handleDivision,
  handleTehsil,
} from '../../../utils/common/location.Helper';
import { handlePaginationValue } from '../../../utils/common/pagination.Helper';
import { initialSearchValues } from './initial.values';

const ManageCropsPlanning = () => {
  const initializeStateFromQueryParams = () => {
    const searchValue =
      searchParams.get('searchValue') ?? initialSearchValues.searchValue;
    const landTypeId =
      searchParams.get('landTypeId') ?? initialSearchValues.landTypeId;
    const provinceId =
      searchParams.get('provinceId') ?? initialSearchValues.provinceId;
    const districtId =
      searchParams.get('districtId') ?? initialSearchValues.districtId;
    const divisionId =
      searchParams.get('divisionId') ?? initialSearchValues.divisionId;
    const tehsilId =
      searchParams.get('tehsilId') ?? initialSearchValues.tehsilId;

    return {
      searchValue,
      landTypeId,
      provinceId,
      districtId,
      divisionId,
      tehsilId,
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

  const { referenceData } = useSelector((state: any) => state?.referenceData);

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  // State for search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  const { locationData } = useSelector((state: any) => state?.referenceData);

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
  const [tableData, setTableData] = useState<User[]>([]);

  // State for reset button
  const [resetTable, setResetTable] = useState(false);

  /* /////////////////////////////////////////////////
                      functions
  /////////////////////////////////////////////////// */

  const navigate = useNavigate();
  const { cropId } = useParams(); // Getting the ID from URL params

  const setValuesById = (valuesById: any) =>
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById, // Merge the new values with the existing state
    }));

  const handleFetchDataByFilter = () => {
    setIsLoading(true);

    const filters = removeEmptyValueFilters([
      {
        field: 'refFarmCropId',
        operator: 'eq',
        value: cropId,
      },
      { field: 'landTypeId', operator: 'eq', value: searchValues.landTypeId },
      {
        field: 'provinceId',
        operator: 'eq',
        value: searchValues?.provinceId,
      },
      {
        field: 'divisionId',
        operator: 'eq',
        value: searchValues?.divisionId,
      },
      {
        field: 'districtId',
        operator: 'eq',
        value: searchValues?.districtId,
      },
      {
        field: 'tehsilId',
        operator: 'eq',
        value: searchValues?.tehsilId,
      },
    ]);

    const filterObject = JSON.stringify({ filter: filters });

    fetchData(
      `crop-plan?rpp=${paginationInfo.rowPerPage}&page=${paginationInfo.currentPage === 0 ? 1 : paginationInfo.currentPage}&filter=${filterObject}`
    )
      .then((response: any) => {
        setTableData(response.data);
        const getPages = extractPageInfo(response.pages);
        setPaginationInfo({
          ...paginationInfo,
          totalRecords: response.total,
          totalPages: getPages?.totalPages ?? 0,
        });
      })
      .catch(error => console.log(error))
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
    deleteData(`crop-plan/${id}`)
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
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleViewClick = (id: string) =>
    navigate(`/crops/${cropId}/planning/view/${id}`);

  const handleEditClick = (id: string) =>
    navigate(`/crops/${cropId}/planning/edit/${id}`);

  const handleAddClick = () => navigate(`/crops/${cropId}/planning/add`);
  const [cropData, setCropData] = useState<any>();

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  useEffect(() => {
    if (cropId)
      fetchData(`crop/${cropId}`)
        .then((data: any) => setCropData(data))
        .catch(err => console.error(err));
  }, [cropId]);

  // Effect for handling search button click
  useEffect(() => {
    handleSearchButtonClick();
  }, [resetTable, paginationInfo?.currentPage, paginationInfo?.rowPerPage]);

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
        header: 'Land Type',
        accessorKey: 'landType',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name}
            </p>
          </div>
        ),
      },
      {
        header: 'PROVINCE',
        accessorKey: 'province',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name}
            </p>
          </div>
        ),
      },

      {
        header: 'DIVISION',
        accessorKey: 'division',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name}
            </p>
          </div>
        ),
      },
      {
        header: 'DISTRICT',
        accessorKey: 'district',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name}
            </p>
          </div>
        ),
      },
      {
        header: 'TEHSIL',
        accessorKey: 'tehsil',
        size: 50,
        minSize: 50,
        maxSize: 500,
        cell: (info: { getValue: () => any }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm lg:text-base text-center">
              {info.getValue()?.name}
            </p>
          </div>
        ),
      },
      {
        header: 'TOTAL PROFIT',
        accessorKey: 'totalProfit',
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
        accessorKey: 'cropPlanId',
        size: 55,
        minSize: 55,
        maxSize: 55,
        cell: (info: any) => {
          const id = info?.row?.original?.cropPlanId;
          return (
            <TableMenu
              id={id}
              onDeleteClick={handleDeleteById}
              onViewClick={handleViewClick}
              onEditClick={handleEditClick}
            />
          );
        },
      },
    ];
  }, [resetTable, tableData]);

  const handleProvinceChange = (value: string) =>
    setSearchValues({
      ...searchValues,
      provinceId: value,
      divisionId: '',
      districtId: '',
      tehsilId: '',
    });

  const handleDivisionChange = (value: string) => {
    const data = handleDivision(locationData, value);
    if (data) setSearchValues({ ...searchValues, ...data });
  };

  const handleDistrictChange = (value: string) => {
    const data = handleDistrict(locationData, value);
    if (data) setSearchValues({ ...searchValues, ...data });
  };

  const handleTehsilChange = (value: string) => {
    const data = handleTehsil(locationData, value);
    if (data) setSearchValues({ ...searchValues, ...data });
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
        headerText={`${capitalizeFirstLetter(cropData?.name) ?? ''} Planning`}
        breadcrumbs={[
          {
            title: `${capitalizeFirstLetter(cropData?.name) ?? ''} Planning`,
            href: '',
          },
        ]}
        isAddOrUpdateButton
        buttonContent={`Add ${capitalizeFirstLetter(cropData?.name) ?? ''} Planning`}
        onButtonClick={handleAddClick} // Call handleAddClick function when button is clicked
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
            handleSearchButtonClick={() => handlePagination('goto', 1)}
            handleResetButtonClick={handleResetButtonClick}
          />

          <Grid className="mt-2">
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="Land Type"
                data={organizeDropDownData(referenceData?.landType)}
                value={searchValues.landTypeId ?? ''}
                onChange={value => setValuesById({ landTypeId: value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="Province"
                value={searchValues.provinceId ?? ''}
                data={[
                  { label: 'None', value: '' },
                  ...(locationData && locationData.provinces
                    ? locationData.provinces.map(
                        (e: { name: any; provinceId: any }) => ({
                          label: e.name || '',
                          value: e.provinceId || '',
                        })
                      )
                    : []),
                ]}
                onChange={(e: string | null) => handleProvinceChange(e ?? '')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="Division"
                value={searchValues.divisionId ?? ''}
                data={getDivisions(searchValues.provinceId, locationData)}
                onChange={e => handleDivisionChange(e ?? '')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="District"
                value={searchValues.districtId ?? ''}
                data={getDistricts(searchValues.divisionId, locationData)}
                onChange={e => handleDistrictChange(e ?? '')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
              <Select
                placeholder="Tehsil"
                value={searchValues.tehsilId ?? ''}
                data={getTehsils(searchValues.districtId, locationData)}
                onChange={e => handleTehsilChange(e ?? '')}
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
export default ManageCropsPlanning;
