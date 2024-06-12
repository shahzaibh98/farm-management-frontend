// React imports
import { useState } from 'react';

// React icon imports
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RiArrowDropDownLine } from 'react-icons/ri';

// Mantine core theme hook
import { Grid, useMantineTheme } from '@mantine/core';

// Table-related imports
import { TableProps } from '../../../types/table.type';

// Component imports
import {
  capitalizeFirstLetter,
  formatDate,
} from '../../../utils/common/function';
import { Select } from '../dropdown';
import { TextInput } from '../inputField';
import { Text } from '../text';
import CropCalenderCard from './crop-plan.card';

const CardTable = ({
  data,
  columns,
  isLoading,
  paginationInfo,
  handlePagination,
}: TableProps) => {
  const { rowPerPage, totalRecords, totalPages, currentPage } = paginationInfo;
  const [goToPage, setGoToPage] = useState('');
  const theme = useMantineTheme();

  return (
    <section className="min-h-[370px] flex justify-between flex-col mt-5 relative max-w-full overflow-x-auto md:overflow-x-visible sm:overflow-x-visible">
      <Grid>
        {!isLoading &&
          data?.map((item: any, index) => (
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }} key={index}>
              <CropCalenderCard
                key={index}
                link={item?.refFarmCropId}
                cropImage={item?.image}
                title={capitalizeFirstLetter(item?.name)}
                calenders={2}
                date={formatDate(item?.updatedAt)}
                uses={item?.cropPlanCount}
              />
            </Grid.Col>
          ))}
      </Grid>

      <div className="h-4" />
      {data?.length !== 0 && (
        <div className="w-full flex justify-between ml-5 py-2 pb-2">
          <div className="flex items-center gap-1">
            <Text size="lg" c={theme.colors.darkColors[0]}>
              Total Records:{' '}
            </Text>
            <Text
              size="lg"
              c={theme.colors.darkColors[0]}
              className="mr-2 font-bold"
              fw={700}
            >
              {totalRecords}
            </Text>
          </div>
          <div className="h-4" />
          <div className="w-1/2 flex justify-around font-normal">
            {/* Pages per page select */}
            <div className="flex items-center">
              <Text
                size="lg"
                className="mr-2 font-normal"
                c={theme.colors.darkColors[0]}
              >
                Rows per page:{' '}
              </Text>

              <Select
                size="md"
                rightSection={
                  <RiArrowDropDownLine
                    size={36}
                    color={theme.colors.darkColors[0]}
                  />
                }
                data={['12', '24']}
                value={rowPerPage}
                onChange={(value: string | null) => {
                  handlePagination('rowPerPage', value ?? '5');
                }}
                styles={{
                  wrapper: {
                    width: '75px',
                  },
                  rightSection: {
                    width: '10px',
                    marginRight: '10px !important',
                    pointerEvents: 'none',
                  },
                  input: {
                    paddingRight: '0',
                    '&:focus-within': {
                      borderColor: theme.colors.primaryColors[0],
                    },
                  },
                  selected: {
                    backgroundColor: theme.colors.secondaryColors[2],
                    color: theme.colors.darkColors[0],
                  },
                  hovered: {
                    backgroundColor: theme.colors.secondaryColors[2],
                    color: theme.colors.darkColors[0],
                  },
                }}
              />
            </div>
            <div className="flex items-center">
              <Text
                size="lg"
                className="mr-2 font-normal"
                c={theme.colors.darkColors[0]}
              >
                Go to Page:{' '}
              </Text>
              <TextInput
                autoComplete="off"
                size="md"
                maxLength={100}
                readOnly={totalRecords <= 0}
                value={goToPage}
                onKeyDown={(e: { key: string }) => {
                  if (e.key === 'Enter')
                    handlePagination('goto', Number(goToPage));
                }}
                onChange={(e: string) => {
                  const numbers = /^[-+]?[0-9]+$/;
                  if (e === '') {
                    setGoToPage('');
                  } else if (e.match(numbers)) {
                    if (Number(e) > 0 && Number(e) <= totalPages) {
                      if (totalRecords >= 1 && Number(e) >= 1) {
                        setGoToPage(e);
                      }
                    }
                  }
                }}
                styles={{
                  wrapper: {
                    width: '75px',
                  },
                  rightSection: {
                    width: '10px',
                    marginRight: '10px !important',
                    pointerEvents: 'none',
                  },
                  input: {
                    paddingRight: '0',
                    '&:focus-within': {
                      borderColor: theme.colors.primaryColors[0],
                    },
                  },
                }}
              />
            </div>
            {/* Current page */}
            <div className="flex items-center font-normal gap-1 text-body2">
              <Text size="lg" c={theme.colors.darkColors[0]}>
                Pages{' '}
              </Text>
              <Text size="lg" c={theme.colors.darkColors[0]} weight={600}>
                <strong>{currentPage}</strong>
              </Text>
              <Text size="lg" c={theme.colors.darkColors[0]}>
                {' '}
                of{' '}
              </Text>
              <Text size="lg" c={theme.colors.darkColors[0]} weight={600}>
                {totalPages}
              </Text>
            </div>
            {/*Prevoius and next button icon  */}
            <div className="flex items-center gap-3 mr-5">
              <IoIosArrowBack
                className={'cursor-pointer'}
                color={currentPage > 1 ? '#000000' : '#808080'}
                size={24}
                onClick={() => {
                  if (currentPage > 1) handlePagination('previous');
                }}
              />
              <IoIosArrowForward
                className={'cursor-pointer'}
                color={currentPage < totalPages ? '#000000' : '#808080'}
                size={24}
                onClick={() => {
                  if (currentPage < totalPages) handlePagination('next');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CardTable;
