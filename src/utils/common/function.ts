export function extractFirstWord(url: string): string | null {
  // Split the URL at the '?' character to separate the base URL and query parameters
  const [baseUrl] = url.split('?');

  // Split the base URL into parts by '/'
  const parts = baseUrl.split('/');

  // Return the first word from the URL if it exists, otherwise return null
  return parts.length > 1 ? parts[3] : null;
}

export function formatTime(timeText: string) {
  // Split the timeText into hours, minutes, and am/pm indicator
  const [time, indicator] = timeText.split(/(?=[ap])/i);

  // Convert hours and minutes to numbers
  const [hours, minutes] = time.split(':').map(Number);

  if (!indicator) {
    return timeText;
  }

  // Determine AM/PM indicator
  const ampm = indicator?.toUpperCase() === 'A' ? 'AM' : 'PM';

  // Construct the formatted time string
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes ?? '00'} ${ampm}`;

  return formattedTime;
}

export const isEmpty = <T>(item: Array<T> | string) => item.length === 0;

export const removeEmptyValues = (obj: { [key: string]: any }) => {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) && // Using Object.prototype.hasOwnProperty indirectly
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== ''
    ) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export function extractPageInfo(
  pageInfo: string
): { currentPage: number; totalPages: number } | null {
  const match = pageInfo.match(/Page (\d+) of (\d+)/);
  if (match) {
    const currentPage = parseInt(match[1]);
    const totalPages = parseInt(match[2]);
    return { currentPage, totalPages };
  }
  return null;
}

export function formatTimestamp(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = days[date.getDay()];
  const dateOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day} ${dateOfMonth} ${month} ${year} ${hours}:${minutes} ${period}`;
}
