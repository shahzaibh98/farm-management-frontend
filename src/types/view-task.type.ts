export interface SearchValuesType {
  searchValue: string;
  assignedTo: string;
  associatedTo: string | null;
  progress: string | null;
  upcomingTask: string | null;
  dateRange: [Date | null, Date | null];
}
