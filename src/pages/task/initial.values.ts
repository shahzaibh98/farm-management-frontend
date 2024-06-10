import { SearchValuesType } from '../../types/view-task.type';

export const initialSearchValues: SearchValuesType = {
  searchValue: '',
  assignedTo: 'All', // Default value: 'Me'
  associatedTo: '',
  progress: 'All', // Default value: 'In Progress'
  upcomingTask: 'All', // Default value: 'Today'
  dateRange: [null, null],
};
