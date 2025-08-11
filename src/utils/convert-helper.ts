export const checkNumberHelper = (
  value: number,
  defaultValue: number,
): number => {
  if (!value || isNaN(value)) return defaultValue;
  if (typeof value === 'string') return Number(value);
  return value;
};

export const getImageType = (ext: string): string => {
  let contentType = 'image/jpeg';
  if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.gif') {
    contentType = 'image/gif';
  } else if (ext === '.bmp') {
    contentType = 'image/bmp';
  }
  return contentType;
};
