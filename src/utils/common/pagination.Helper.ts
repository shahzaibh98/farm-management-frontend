export const handlePaginationValue = (
  actionType: string,
  value: any,
  searchParams: URLSearchParams,
  paginationInfo: any,
  setPaginationInfo: any,
  setSearchParams: any
) => {
  console.log('Paginations clicked', paginationInfo);
  const newParams = new URLSearchParams(searchParams.toString());
  const { currentPage, rowPerPage } = paginationInfo;

  if (actionType === 'next') {
    const newPage = currentPage + 1;
    setPaginationInfo((prevState: any) => ({
      ...prevState,
      currentPage: newPage,
    }));
    if (newPage === 1) {
      newParams.delete('currentPage');
    } else {
      newParams.set('currentPage', newPage.toString());
    }
  } else if (actionType === 'previous') {
    const newPage = currentPage - 1;
    setPaginationInfo((prevState: any) => ({
      ...prevState,
      currentPage: newPage,
    }));
    if (newPage === 1) {
      newParams.delete('currentPage');
    } else {
      newParams.set('currentPage', newPage.toString());
    }
  } else if (actionType === 'goto') {
    setPaginationInfo((prevState: any) => ({
      ...prevState,
      currentPage: value,
    }));
    if (value === 1) {
      newParams.delete('currentPage');
    } else if (value !== currentPage) {
      newParams.set('currentPage', value.toString());
    }
  } else if (actionType === 'rowPerPage') {
    const newRowPerPage = value;
    setPaginationInfo((prevState: any) => ({
      ...prevState,
      rowPerPage: newRowPerPage,
      currentPage: 1, // Reset currentPage to 1
    }));
    newParams.delete('currentPage'); // Ensure currentPage is removed from URL
    if (newRowPerPage === '5') {
      newParams.delete('rowPerPage');
    } else if (
      newRowPerPage === '10' ||
      newRowPerPage === '50' ||
      newRowPerPage === '100'
    ) {
      newParams.set('rowPerPage', newRowPerPage);
    }
  }

  setSearchParams(newParams);
};
