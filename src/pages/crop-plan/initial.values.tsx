export interface SearchFilter {
  searchValue: string;
  category: string;
}

export const initialSearchValues: any = {
  searchValue: '',
  category: 'All',
};

export const paginationInfoValue = {
  rowPerPage: '12',
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
};
