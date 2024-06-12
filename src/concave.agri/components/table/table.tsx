// React imports
import { useState } from 'react';

// React icon imports
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RiArrowDropDownLine } from 'react-icons/ri';

// Mantine core theme hook
import { Pagination, Skeleton, useMantineTheme } from '@mantine/core';

// Table-related imports
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableProps } from '../../../types/table.type';

// Component imports
import { Select } from '../dropdown';
import { TextInput } from '../inputField';
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
    <section className="min-h-[370px] flex justify-between flex-col mt-4 relative max-w-full overflow-x-auto md:overflow-x-visible sm:overflow-x-visible">
      <table
        className="w-full"
        style={{
          fontFamily: 'Ubuntu',
        }}
      >
        <thead
          className="bg-[#0F783B] h-8 lg:h-12 "
          style={{
            color: theme.colors.darkColors[2],
            // borderRadius: '24px',
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
                    className={`text-[#ffffff] font-montserrat font-semibold text-[12px] capitalize ${
                      header.index === 0
                        ? 'rounded-tl-lg p-4'
                        : header.headerGroup.headers?.length - 1 ===
                            header.index
                          ? 'rounded-tr-lg p-4'
                          : 'p-4'
                    }`}
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
        <tbody
          style={{
            color: theme.colors.darkColors[0],
            fontSize: theme.fontSizes.md,
          }}
          // className="mt-4"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className=" border-b border-b-lightColors-lightestGrey1  cursor-default text-body2 lg:h-10 hover:cursor-pointer hover:rounded-3xl"
              >
                {/* Render skeleton cells */}
                {table?.getAllColumns().map(column => (
                  <td key={column.id}>
                    <div className="flex items-center justify-center">
                      <Skeleton height={14} mt={6} width="70%" radius="xl">
                        Data Table
                      </Skeleton>
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : table?.getRowModel()?.rows?.length === 0 ? (
            <div className="flex  min-h-[80%] bold mt-2 ml-2">
              No data to display...
            </div>
          ) : (
            table?.getRowModel()?.rows?.map(row => {
              return (
                <tr
                  key={row.id}
                  className="py-2 font-montserrat bg-[#F3FBF2] border-b border-b-lightColors-lightestGrey1 px-8 hover:bg-lightColors-lightestGrey3 cursor-default h-6 lg:h-10 hover:cursor-pointer hover:rounded-3xl"
                >
                  {row.getVisibleCells()?.map(cell => {
                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={'p-2 text-[12px]'}
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

      {data?.length !== 0 && (
        <>
          <div className="w-full flex flex-col">
            <div className="w-full h-9 border border-solid border-[rgba(15, 120, 59, 0.1)] justify-center rounded-3xl bottom-0">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row m-1.5">
                  <div className="ml-4 font-montserrat text-[#BE8B45]">
                    Total Records : {''}
                  </div>
                  <div className="ml-2 font-montserrat font-bold text-[#0F783B]">
                    {totalRecords}
                  </div>
                </div>
                <div className="flex flex-row ">
                  <div className="font-montserrat text-[#BE8B45] m-1.5 mr-2 text-[12px] font-medium">
                    Records Per Page
                  </div>
                  <div className="font-montserrat text-[#414141] m-1.5 mr-2 text-[12px] font-bold">
                    {rowPerPage}
                  </div>
                  <Select
                    className="mr-4"
                    size="xs"
                    leftSection={
                      <RiArrowDropDownLine
                        size={36}
                        color={'#0F783B'}
                        className="mt-0.5"
                      />
                    }
                    value={''}
                    data={['5', '10', '50', '100']}
                    onChange={(value: string | null) => {
                      handlePagination('rowPerPage', value ?? '5');
                    }}
                    rightSection={<></>}
                    styles={{
                      wrapper: {
                        width: '50px',
                        border: 'none',
                      },
                      section: {
                        pointerEvents: 'none',
                        color: '#414141',
                        font: '24px',
                      },
                      input: {
                        border: 'none',
                        paddingRight: '0',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row justify-center mt-6">
              <div className="flex text-[#0F783B] font-montserrat font-semibold text-[12px] mt-2 mr-[30px]">{`Pages ${currentPage} of ${totalPages}`}</div>
              <Pagination
                total={totalPages}
                siblings={1}
                value={currentPage}
                onChange={(e: number) => handlePagination('goto', e)}
              />
              <div className="flex items-center ml-[30px]">
                <div className="flex text-[#0F783B] font-montserrat font-semibold text-[12px] mr-[10px]">
                  Go to Page
                </div>
                <TextInput
                  autoComplete="off"
                  size="xs"
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
                      width: '50px',
                    },
                    rightSection: {
                      width: '10px',
                      marginRight: '10px !important',
                      pointerEvents: 'none',
                    },
                    input: {
                      paddingRight: '0',
                      color: ' #BE8B45',
                      '&:focus-within': {
                        borderColor: 'rgb(157, 153, 153, 0.53)',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Table;
