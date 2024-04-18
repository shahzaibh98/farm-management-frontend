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
