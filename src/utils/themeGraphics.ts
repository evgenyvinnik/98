export function renderThemeGraphics(cssProperties: Record<string, string>): Record<string, string> {
  const getProp = (propName: string) => cssProperties[propName] || '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2d context for canvas to render theme graphics');
    return {};
  }

  // --checker
  canvas.width = canvas.height = 2;
  ctx.fillStyle = getProp('--ButtonFace');
  ctx.fillRect(0, 1, 1, 1);
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = getProp('--ButtonHilight');
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillRect(1, 1, 1, 1);
  const checker = `url(${canvas.toDataURL()})`;

  // border-images
  const border_image = (border_size: number, svg_contents: string) => {
    const scale = 32;
    const slice_size = border_size * scale;
    const view_size = 8 * scale;
    const svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${view_size}px" height="${view_size}px" viewBox="0 0 ${view_size} ${view_size}">
      ${svg_contents.replace(/(d|x|y|width|height|stroke-width)="[^ "]*"/g, (attr) =>
        attr.replace(/\d+/g, (n) => `${Number(n) * scale}`)
      )}
    </svg>`;
    const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    return `url("${url}") ${slice_size} / ${border_size}px`;
  };

  const button_normal_border_image = border_image(2, `
    <path d="M0 0h7v1h-6v6h-1v-7z" fill="${getProp('--ButtonHilight')}"/>
    <path d="M7 0h1v8h-8v-1h7v-7z" fill="${getProp('--ButtonDkShadow')}"/>
    <path d="M1 1h5v1h-4v4h-1v-5z" fill="${getProp('--ButtonLight')}"/>
    <path d="M6 1h1v6h-6v-1h5v-5z" fill="${getProp('--ButtonShadow')}"/>
    <path d="M2 2h4v4h-4v-4z" fill="${getProp('--ButtonFace')}"/>
  `);

  const inset_deep_border_image = border_image(2, `
    <path d="M0 0h7v1h-6v6h-1v-7z" fill="${getProp('--ButtonDkShadow')}"/>
    <path d="M7 0h1v8h-8v-1h7v-7z" fill="${getProp('--ButtonHilight')}"/>
    <path d="M1 1h5v1h-4v4h-1v-5z" fill="${getProp('--ButtonShadow')}"/>
    <path d="M6 1h1v6h-6v-1h5v-5z" fill="${getProp('--ButtonLight')}"/>
    <path d="M2 2h4v4h-4v-4z" fill="${getProp('--ButtonFace')}"/>
  `);

  return {
    '--checker': checker,
    '--button-normal-border-image': button_normal_border_image,
    '--inset-deep-border-image': inset_deep_border_image,
    // Other generated properties would go here
  };
}
