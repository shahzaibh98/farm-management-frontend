export const paginationInfoValue = {
  rowPerPage: '5',
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
};

// Initial state for notification
export const initialNotification = {
  isSuccess: true, // Indicates whether the operation was successful
  isEnable: false, // Indicates whether the notification is active
  title: '', // Title of the notification
  message: '', // Message of the notification
};

export const initialModalInfo = {
  isOpen: false,
  type: 'Add',
  objectData: null,
  isReadOnly: false,
};

export const colorArray = [
  '#bdbdbd',
  '#ef5350',
  '#ec407a',
  '#7e57c2',
  '#5c6bc0',
  '#42a5f5',
  '#29b6f6',
  '#26c6da',
  '#26a69a',
  '#66bb6a',
  '#9ccc65',
  '#d4e157',
  '#ffee58',
  '#ffca28',
  '#ffa726',
  '#ff7043',
  '#8d6e63',
  '#78909c',
];

export const systemRoles = [
  { id: '0', name: 'Super Admin', abbreviation: 'SA' },
  { id: '1', name: 'Farm Admin', abbreviation: 'FA' },
  { id: '2', name: 'Farm Manager', abbreviation: 'FM' },
  { id: '3', name: 'Accountant', abbreviation: 'AC' },
  { id: '4', name: 'Service Manager', abbreviation: 'SM' },
  { id: '5', name: 'Warehouse Manager', abbreviation: 'WM' },
  { id: '6', name: 'Farm Worker', abbreviation: 'FW' },
  { id: '7', name: 'Auditor', abbreviation: 'AU' },
];
