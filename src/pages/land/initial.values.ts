import { SearchValuesType } from '../../types/view-task.type';

export const initialSearchValues: SearchValuesType = {
  searchValue: '',
  assignedTo: 'All', // Default value: 'Me'
  associatedTo: '',
  progress: 'In Progress', // Default value: 'In Progress'
  upcomingTask: 'Today', // Default value: 'Today'
  dateRange: [null, null],
};
