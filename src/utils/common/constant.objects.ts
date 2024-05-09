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

export const getLandColors = (value: string) => {
  const color = landColors.find(color => color.value === value);
  return color?.color;
};
export function darkenColors(
  color: string | null | undefined,
  percentage: number
) {
  if (color) {
    // Parse the color string to get the RGB components
    const [r, g, b] = color.match(/\w\w/g)!.map(x => parseInt(x, 16)); // Use the non-null assertion operator !

    // Calculate the new RGB components by reducing the brightness
    const newR = Math.round(r * (1 - percentage));
    const newG = Math.round(g * (1 - percentage));
    const newB = Math.round(b * (1 - percentage));

    // Convert the new RGB components back to hexadecimal format
    const newColor = `#${(newR * 0x10000 + newG * 0x100 + newB).toString(16).padStart(6, '0')}`;

    return newColor;
  } else {
    // Handle the case when color is null or undefined
    // For example, you might return a default color or throw an error
    return '#000000'; // Default black color
  }
}

export const landColors = [
  { color: '#A67D5F', value: 'Animal Enclosures' }, // Dark Color
  { color: '#B2B200', value: 'Buffer Zones' },
  { color: '#CC6600', value: 'Buildings' },
  { color: '#4B0082', value: 'Farm Boundaries' },
  { color: '#004717', value: 'Fields' },
  { color: '#7C9A74', value: 'Green House' }, // Dark Color
  { color: '#00004B', value: 'Grow Room' },
  { color: '#4C8099', value: 'Irrigation Zones' }, // Dark Color
  { color: '#7F5217', value: 'Landscaping' },
  { color: '#003300', value: 'Pasture' },
  { color: '#A67D5F', value: 'Paddock' }, // Dark Color
  { color: '#404040', value: 'Other' }, // Dark Color
];
