export function extractFirstWord(url: string) {
  const parts = url.split('/');
  return parts.length > 1 ? parts[3] : null;
}
