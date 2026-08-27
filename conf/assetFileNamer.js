const pattern = '[name]-[hash][extname]';

/** Output folder per asset family. Keeps `dist/` browsable instead of one flat pile. */
const map = {
  default: `assets/${pattern}`,
  css: `styles/${pattern}`,
  svg: `icons/${pattern}`,
  image: `images/${pattern}`,
  font: `fonts/${pattern}`,
};

/**
 * Picks the output path for an emitted asset based on its extension.
 *
 * @param {{ names?: readonly string[], name?: string }} asset
 * @returns {string}
 */
export const assetFileNamer = ({ names, name }) => {
  const fileName = names?.[0] ?? name;

  if (!fileName) return map.default;
  if (/\.css$/i.test(fileName)) return map.css;
  if (/\.svg$/i.test(fileName)) return map.svg;
  if (/\.(png|jpe?g|gif|webp|avif)$/i.test(fileName)) return map.image;
  if (/\.(ttf|otf|woff2?)$/i.test(fileName)) return map.font;

  return map.default;
};
