export const allowedImageTypes = [
  'gif',
  'png',
  'jpg',
  'jpeg',
  'bmp',
  'webp',
  'svg',
  'tiff',
];

export const allowedOfficeTypes = [
  'xls',
  'xlsx',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'pdf',
  'txt',
  'md',
  'csv',
];

export const allowedVideoTypes = ['mp4', 'avi', 'wmv'];

export const allowedAudioTypes = ['mp3', 'wav', 'ogg'];

export function getFileType(fileExtension: string): string {
  if (allowedImageTypes.includes(fileExtension)) {
    return 'image';
  } else if (allowedOfficeTypes.includes(fileExtension)) {
    return 'office';
  } else if (allowedVideoTypes.includes(fileExtension)) {
    return 'video';
  } else if (allowedAudioTypes.includes(fileExtension)) {
    return 'audio';
  }
  return 'other';
}
