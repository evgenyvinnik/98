export interface Stats {
  isDirectory(): boolean;
}

const fileExtensionIcons: { [key: string]: string } = {
  txt: 'notepad-file',
  md: 'notepad-file',
  json: 'notepad-file',
  js: 'notepad-file',
  css: 'notepad-file',
  html: 'html',
  gitattributes: 'notepad-file',
  gitignore: 'notepad-file',
  png: 'image-gif',
  jpg: 'image-jpeg',
  jpeg: 'image-jpeg',
  gif: 'image-gif',
  webp: 'image-other',
  bmp: 'paint-file',
  tif: 'kodak-imaging-file',
  tiff: 'kodak-imaging-file',
  wav: 'sound',
  mp3: 'sound',
  ogg: 'sound',
  wma: 'sound',
  exe: 'task',
  htm: 'html',
  url: 'html',
  theme: 'themes',
  themepack: 'themes',
};

function getIconId(fileName: string, stats: Stats): string {
  if (stats.isDirectory()) {
    return 'folder-closed';
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return fileExtensionIcons[extension] || 'file';
}

export function getIconUrl(fileName: string, stats: Stats, size: number): string {
  const iconId = getIconId(fileName, stats);
  // The original code had a dynamic root, but for simplicity, we'll hardcode it.
  const root = '/'; 
  return `${root}images/icons/${iconId}-${size}x${size}.png`;
}
