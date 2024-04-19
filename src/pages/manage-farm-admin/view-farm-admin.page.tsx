import {
  Button,
  Center,
  Flex,
  Grid,
  Modal,
  TextInput,
  useMantineTheme,
} from '@mantine/core'; // Importing Mantine UI components
import { useEffect, useMemo, useState } from 'react'; // Importing React hooks
import { CiCalendarDate, CiViewTable } from 'react-icons/ci'; // Importing icons from 'react-icons/ci'
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importing routing-related hooks

// Importing custom components from the 'concave.agri' project
import {
  DatePicker,
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
import { SearchValuesType } from '../../types/view-task.type';
import { paginationInfoValue } from '../../utils/common/constant.objects';
import MyCalendar from '../calendar/calendar';
import { initialSearchValues } from './initial.values';
import { MdDisabledVisible } from 'react-icons/md';
import { MdOutlineBlock } from 'react-icons/md';
import { useFormik } from 'formik';

const ManageFarmAdmin = () => {
  /* /////////////////////////////////////////////////
                       Variable
  /////////////////////////////////////////////////// */
  // Initialize the useMantineTheme hook for accessing theme variables
  const theme = useMantineTheme();
  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      name: '',
      email: '',
      role: 'Farmer',
    },
    onSubmit: values => {
      // Handle form submission logic here
      console.log('Form submitted with values:', values);
    },
  });

  const navigate = useNavigate();
  const { isSmallScreen } = useScreenSize();

  /* /////////////////////////////////////////////////
                      State
  /////////////////////////////////////////////////// */

  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddFarmAdmin = () => {
    toggleModal(); // Open the modal when "Add Task" button is clicked
  };
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState(paginationInfoValue);
  const [searchValues, setSearchValues] = useState(initialSearchValues);

  /* /////////////////////////////////////////////////
                      useEffect
  /////////////////////////////////////////////////// */

  const initializeStateFromQueryParams = () => {
    // Extract values from searchParams
    const searchValue =
      searchParams.get('searchValue') || searchValues.searchValue;
    const status = searchParams.get('status') || searchValues.status;

    // Update state with extracted values
    setSearchValues({
      searchValue,
      status,
    });
  };

  const initialPaginationFromQueryParams = () => {
    const rowPerPage =
      searchParams.get('rowPerPage') || paginationInfoValue.rowPerPage;

    const currentPage = Number(
      searchParams.get('currentPage') ||
        paginationInfoValue.currentPage?.toString()
    );
    setPaginationInfo({ ...paginationInfoValue, rowPerPage, currentPage });
  };

  useEffect(() => {
    initializeStateFromQueryParams();
    initialPaginationFromQueryParams();
  }, [searchParams]);

  // Function to set values based on identifiers
  const setValuesById = (valuesById: any) => {
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
          newParams.set('dateRangeStart', value[0]?.toString());
        }
        if (value[1]) {
          newParams.set('dateRangeEnd', value[1]?.toString());
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

  const handlePagination = (actionType: string, value?: any) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentPage = paginationInfo.currentPage;

    if (actionType === 'next') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage + 1,
      }));
      currentPage > 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage + 1).toString());
    } else if (actionType === 'previous') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
      currentPage > 2
        ? newParams.delete('currentPage')
        : newParams.set('currentPage', (currentPage - 1).toString());
    } else if (actionType === 'goto') {
      setPaginationInfo(prevState => ({
        ...prevState,
        currentPage: value,
      }));
      value > 2
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
  };

  const columns = useMemo(
    () => [
      {
        header: 'FARM TITLE',
        accessorKey: 'farmTitle',
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
        header: 'NAME',
        accessorKey: 'name',
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
        header: 'EMAIL ADDRESS',
        accessorKey: 'email',
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
        header: 'PHONE NUMBER',
        accessorKey: 'phoneNo',
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
        header: 'STATUS',
        accessorKey: 'isActive',
        cell: (info: { getValue: () => any }) => {
          const priority = info.getValue();
          return (
            <Center>
              <div className="flex flex-wrap">
                <div
                  className={`w-3 h-3 rounded-full m-1 mr-2 ${priority ? 'bg-green-light' : 'bg-red-light'}`}
                />
                <Text>{priority ? 'Active' : 'Blocked'}</Text>
              </div>
            </Center>
          );
        },
      },
      {
        header: '',
        accessorKey: 'id',
        size: 55, //starting column size
        minSize: 55, //enforced during column resizing
        maxSize: 55, //enforced during column resizing
        cell: (info: any) => {
          const isActive = info?.row?.original?.isActive;

          return (
            <TableMenu
              additionalMenuItems={[
                {
                  label: isActive ? 'Block' : 'Active',
                  icon: isActive ? <MdDisabledVisible /> : <MdOutlineBlock />,
                  onClick: () => {
                    console.log('blocked');
                  },
                },
              ]}
            />
          );
        },
      },
    ],
    []
  );

  const defaultData = [
    {
      id: 1,
      name: 'Shahzaib',
      farmTitle: 'Multan Farm',
      email: 'hassanshahzaib81@gmail.com',
      profilePic:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      phoneNo: '0300-1234567',
      isActive: true,
    },
    {
      id: 2,
      name: 'Hassan',
      farmTitle: 'Lahore Farm',
      email: 'lahorefarm@gmail.com',
      profilePic:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      phoneNo: '0300-7654321',
      isActive: false,
    },
    {
      id: 3,
      name: 'Hammad Khan',
      farmTitle: 'Karachi Farm',
      email: 'karachifarm@gmail.com',
      profilePic:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      phoneNo: '0300-9876543',
      isActive: true,
    },
    {
      id: 4,
      name: 'Basit Ali',
      farmTitle: 'Islamabad Farm',
      email: 'islamabadfarm@gmail.com',
      profilePic:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      phoneNo: '0300-5678912',
      isActive: false,
    },
    {
      id: 5,
      name: 'Hammad Ali',
      farmTitle: 'Peshawar Farm',
      email: 'peshawarfarm@gmail.com',
      profilePic:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      phoneNo: '0300-2468101',
      isActive: true,
    },
  ];

  return (
    <main className={`w-full h-screen relative bg-darkColors-700`}>
      <GenericHeader
        headerText="Farm Admin"
        breadcrumbsText="Manage Farm Admin"
        isAddOrUpdateButton
        buttonContent="Add Farm Admin"
        onButtonClick={handleAddFarmAdmin} // Call handleAddFarmAdmin function when button is clicked
      />

      <Paper
        shadow="xs"
        className="flex justify-between items-center m-2 md:m-4 lg:m-8 radius-2xl min-h-[60%] p-4"
        radius={12}
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
            <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
              <Select
                placeholder="Status"
                data={['Active', 'Blocked']}
                value={searchValues.status ?? ''}
                onChange={value => setValuesById({ status: value })}
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
            data={defaultData}
            columns={columns}
            paginationInfo={paginationInfo}
            handlePagination={handlePagination}
          />
        </div>
      </Paper>
      <Modal
        opened={isModalOpen}
        onClose={toggleModal}
        title="Add User"
        size="xs"
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.colors.primaryColors[0],
          },
        }}
        className="addtaskModalforUser"
        transitionProps={{ transition: 'fade-up', duration: 300 }}
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <label>Farm Title *</label>
            <TextInput
              placeholder="Enter title"
              withAsterisk
              {...form.getFieldProps('title')}
              onChange={() => {}}
              value={''}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <label>Name *</label>
            <TextInput
              placeholder="Enter name"
              withAsterisk
              {...form.getFieldProps('name')}
              onChange={() => {}}
              value={''}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <label>Email *</label>
            <TextInput
              placeholder="Enter email"
              withAsterisk
              {...form.getFieldProps('email')}
              onChange={() => {}}
              value={''}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <label>Role *</label>
            <Select
              placeholder="Select role"
              {...form.getFieldProps('role')}
              onChange={value => form.setFieldValue('role', value)} // Ensure correct state update
              data={['Farmer', 'Kissan', 'Employee'].map(role => ({
                value: role,
                label: role,
              }))}
            />
          </Grid.Col>
        </Grid>
        <Flex
          mih={50}
          gap="xs"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
          className="mb-5"
        >
          <Button
            variant="outline"
            autoContrast
            color={theme.colors.primaryColors[0]}
            mt={8}
            size="md"
            type="submit"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic">
              {'Add User'}
            </Text>
          </Button>
        </Flex>
      </Modal>

      <div className="h-4" />
    </main>
  );
};
export default ManageFarmAdmin;
