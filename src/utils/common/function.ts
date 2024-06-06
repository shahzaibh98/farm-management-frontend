import moment from 'moment';
import store from '../../redux';

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
      filter.value !== null &&
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
  const match = pageInfo?.match(/Page (\d+) of (\d+)/);
  if (match) {
    const currentPage = parseInt(match[1]);
    const totalPages = parseInt(match[2]);
    return { currentPage, totalPages };
  }
  return null;
}

export function formatTimestamp(timestamp: string | number | Date) {
  if (!timestamp) {
    return '';
  }
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

export function getCenterPoint(polygon: any) {
  let totalLat = 0;
  let totalLng = 0;

  // Iterate through each vertex of the polygon
  for (let i = 0; i < polygon?.length; i++) {
    totalLat += polygon[i].lat; // Summing up latitude values
    totalLng += polygon[i].lng; // Summing up longitude values
  }

  // Divide the total sums by the number of vertices to get the average
  const centerLat = totalLat / polygon?.length;
  const centerLng = totalLng / polygon?.length;
  return { lat: centerLat, lng: centerLng };
}

export function calculateCenterPointAndZoom(
  allPolygons: any[],
  mapWidth: number,
  mapHeight: number
) {
  if (!allPolygons || allPolygons.length === 0)
    return { lat: 0, lng: 0, zoom: 0 };
  // Initialize variables for the bounding box coordinates
  else {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    // Iterate through all polygons to find the bounding box
    allPolygons?.forEach((polygon: any) => {
      polygon?.coordinates?.forEach((point: { lat: number; lng: number }) => {
        minX = Math.min(minX, point.lat);
        minY = Math.min(minY, point.lng);
        maxX = Math.max(maxX, point.lat);
        maxY = Math.max(maxY, point.lng);
      });
    });

    // Calculate the center of the bounding box
    const centerLat = (minX + maxX) / 2;
    const centerLng = (minY + maxY) / 2;

    // Calculate distance between center and farthest point
    const distanceLat = Math.abs(maxX - minX);
    const distanceLng = Math.abs(maxY - minY);
    const distanceHorizontal = Math.max(distanceLat, distanceLng);

    // Calculate zoom level based on the distance and map dimensions
    const zoomX = Math.log2((360 * (mapWidth / 256)) / distanceHorizontal);
    const zoomY = Math.log2((180 * (mapHeight / 256)) / distanceLat);
    const zoom = Math.floor(Math.min(zoomX, zoomY));

    // Return the center point and zoom level
    return { center: { lat: centerLat, lng: centerLng }, zoom };
  }
}

export const calculateOverlayBounds = (polygonCoords: any[]) => {
  let minLat = Number.MAX_VALUE;
  let maxLat = Number.MIN_VALUE;
  let minLng = Number.MAX_VALUE;
  let maxLng = Number.MIN_VALUE;

  polygonCoords.forEach((coord: { lat: number; lng: number }) => {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });

  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
  };
};

export const organizeDropDownData = (data: { name: string; id: string }[]) =>
  data?.map(item => ({ label: item.name, value: item?.id?.toString() }));

export const numberInputValue = (value: number | null | undefined) => {
  if (value === null || value === undefined) return undefined;
  if (value === 0) return undefined;
  return value;
};

export const getReferenceName = (objectKey: string, findingValue: string) => {
  const state = store.getState();
  const { referenceData } = state.referenceData;

  return (
    referenceData[objectKey]?.find(
      (object: { id: string }) => object?.id === findingValue
    )?.name ?? ''
  );
};

export function capitalizeFirstLetter(inputString: string) {
  if (!inputString) return inputString; // Handle empty string or null input
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export function capitalizeEveryWord(
  sentence: string | undefined | null
): string {
  if (!sentence) return '';

  return sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const handleSetParams = (
  searchParams: URLSearchParams,
  searchValues: { [key: string]: any },
  initialSearchValues: { [key: string]: any },
  setSearchParams: (params: URLSearchParams) => void
) => {
  // Check if searchParams is defined and is an instance of URLSearchParams
  if (!(searchParams instanceof URLSearchParams)) {
    console.error(
      'searchParams is not defined or not a URLSearchParams instance'
    );
    return;
  }

  // Check if searchValues is defined and is an object
  if (typeof searchValues !== 'object' || searchValues === null) {
    console.error('searchValues is not defined or not an object');
    return;
  }

  // Clone the current searchParams
  const newParams = new URLSearchParams(searchParams.toString());

  Object.entries(searchValues).forEach(([key, value]) => {
    if (key === 'dateRange' && Array.isArray(value)) {
      const [start, end] = value;
      if (start) {
        newParams.set('dateRangeStart', start.toISOString());
      } else {
        newParams.delete('dateRangeStart');
      }
      if (end) {
        newParams.set('dateRangeEnd', end.toISOString());
      } else {
        newParams.delete('dateRangeEnd');
      }
    } else if (value !== null && value !== undefined && value !== '') {
      // Check if the value differs from the initial value in searchParams
      if (value !== initialSearchValues[key]) {
        newParams.set(key, value);
      } else {
        newParams.delete(key); // Remove the parameter if it matches the initial value
      }
    }
  });

  // Ensure newParams has any valid changes before setting
  if (newParams.toString() !== searchParams.toString()) {
    setSearchParams(newParams);
  }
};

function getSafeValue(value: number | null | undefined) {
  return value !== null && value !== undefined && !isNaN(value) ? value : 0;
}

export function calculateTotalCost(avgUnit: any, avgCost: any) {
  const unit = getSafeValue(avgUnit);
  const cost = getSafeValue(avgCost);

  return unit * cost === 0 ? undefined : unit * cost;
}

export function cleanObject(obj: any) {
  // Iterate over the properties of the object
  for (const key in obj) {
    // Check if the property value is null, undefined, or an empty string
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      // If true, delete the property from the object
      delete obj[key];
    }
  }
  return obj;
}
