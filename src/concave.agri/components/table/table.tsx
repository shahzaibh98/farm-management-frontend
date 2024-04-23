// React imports
import { useState } from 'react';

// React icon imports
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RiArrowDropDownLine } from 'react-icons/ri';

// Mantine core theme hook
import { useMantineTheme } from '@mantine/core';

// Table-related imports
import { TableProps } from '../../../types/table.type';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Component imports
import { Select } from '../dropdown';
import { TextInput } from '../inputField';
import { Loader } from '../loader';
import { Text } from '../text';

const Table = ({
  data,
  columns,
  isLoading,
  paginationInfo,
  handlePagination,
}: TableProps) => {
  const { rowPerPage, totalRecords, totalPages, currentPage } = paginationInfo;
  const [goToPage, setGoToPage] = useState('');
  const theme = useMantineTheme();
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <section className="min-h-[370px] flex justify-between flex-col mt-4 relative max-w-full overflow-x-scroll overflow-y-hidden">
      <table
        className="w-full"
        style={{
          fontFamily: 'Ubuntu',
        }}
      >
        <thead
          className="bg-secondaryColors-100 text-sm lg:text-base h-8 lg:h-14 rounded-lg"
          style={{
            color: theme.colors.darkColors[2],
            borderRadius: '24px',
          }}
        >
          {table?.getHeaderGroups()?.map(headerGroup => (
            <tr
              key={headerGroup.id}
              style={{
                borderColor: theme.colors.darkColors[3],
              }}
              className="tracking-widest text-skin-caption rounded-lg"
            >
              {headerGroup?.headers?.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      position: 'relative',
                      width: header.getSize(),
                    }}
                    className={
                      header.index === 0
                        ? 'rounded-l-md p-4'
                        : header.headerGroup.headers?.length - 1 ===
                            header.index
                          ? 'rounded-r-md p-4'
                          : 'p-4'
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header?.column?.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                      ></div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <br />
        <tbody
          style={{
            color: theme.colors.darkColors[0],
            fontSize: theme.fontSizes.md,
          }}
          // className="mt-4"
        >
          {table?.getRowModel()?.rows?.length === 0 ? (
            <div className="flex items-center justify-center min-h-[80%] bold">
              No data to display...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center">
              <Loader isLoading={isLoading} />
            </div>
          ) : (
            table?.getRowModel()?.rows?.map(row => {
              return (
                <tr
                  key={row.id}
                  className="py-3 border-b border-b-lightColors-lightestGrey1 px-8 hover:bg-lightColors-lightestGrey3 cursor-default text-body2 h-6 lg:h-10 hover:cursor-pointer hover:rounded-3xl"
                >
                  {row.getVisibleCells()?.map(cell => {
                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`p-2`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
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
                data={['5', '10', '50', '100']}
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

export default Table;
