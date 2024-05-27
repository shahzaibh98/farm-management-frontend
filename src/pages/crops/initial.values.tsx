export interface SearchFilter {
  searchValue: string;
  type: string;
  status: string;
}

export const initialSearchValues = {
  searchValue: '',
  category: 'All',
};
