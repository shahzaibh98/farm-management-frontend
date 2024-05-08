import moment from 'moment';

export function extractFirstWord(url: string): string | null {
  // Split the URL at the '?' character to separate the base URL and query parameters
  const [baseUrl] = url.split('?');

  // Split the base URL into parts by '/'
  const parts = baseUrl.split('/');

  // Return the first word from the URL if it exists, otherwise return null
  return parts?.length > 1 ? parts[3] : null;
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

export const isEmpty = <T>(item: Array<T> | string) => item?.length === 0;

export function removeEmptyValueFilters(filters: any[]) {
  return filters.filter(
    filter =>
      filter.value !== undefined &&
      filter.value !== '' &&
      filter.value !== 'All'
  );
}

export function getDateRange(option: string): [string, string] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  };

  switch (option) {
    case 'Today': {
      const startDate = formatDate(today);
      const endDate = formatDate(
        new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
      return [startDate, endDate];
    }
    case 'Tomorrow': {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startDate = formatDate(tomorrow);
      const endDate = formatDate(
        new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      );
      return [startDate, endDate];
    }
    case 'This Week': {
      const startDate = formatDate(startOfWeek);
      const endDate = formatDate(
        new Date(endOfWeek.getTime() + 24 * 60 * 60 * 1000)
      );
      return [startDate, endDate];
    }
    case 'Next Week': {
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
      const nextWeekEnd = new Date(endOfWeek);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
      const startDate = formatDate(nextWeekStart);
      const endDate = formatDate(
        new Date(nextWeekEnd.getTime() + 24 * 60 * 60 * 1000)
      );
      return [startDate, endDate];
    }
    case 'Next Month': {
      const nextMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
      const nextMonthEnd = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        0
      );
      const startDate = formatDate(nextMonthStart);
      const endDate = formatDate(
        new Date(nextMonthEnd.getTime() + 24 * 60 * 60 * 1000)
      );
      return [startDate, endDate];
    }
    default:
      // For 'All' and 'Custom Range', return an empty range
      return ['', ''];
  }
}

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

export function formatTasks(tasks: any[]) {
  return tasks.map(
    (task: { startDateTime: any; endDateTime: any; taskTitle: any }) => {
      const { startDateTime, endDateTime, taskTitle } = task;
      return {
        start: moment(startDateTime).toDate(),
        end: moment(endDateTime).toDate(),
        title: taskTitle,
        ...task,
      };
    }
  );
}

// Custom validation function
export const isPkTelePhoneNumber = (phoneNumber: string) => {
  // Define the regular expressions
  const regex03 = /^03\d{9}$/;
  const regexPlus923 = /^\+923\d{9}$/;
  return regex03.test(phoneNumber) || regexPlus923.test(phoneNumber);
};
