export interface TableProps {
  data: any[]; // Assuming data is an array of any type
  columns: any[]; // Assuming columns is an array of any type
  isLoading: boolean;
  paginationInfo: {
    rowPerPage: string;
    totalRecords: number;
    totalPages: number;
    currentPage: number;
  };
  handlePagination: (actionType: string, value?: any) => void;
}
