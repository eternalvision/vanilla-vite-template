const pattern = '[name]/[hash][extname]';

const map = {
  def: `assets/${pattern}`,
  css: `styles/${pattern}`,
  svg: `icons/${pattern}`,
  image: `images/${pattern}`,
  font: `fonts/${pattern}`,
};

// this module exports a function that determines the file naming convention
export const assetFileNamer = ({ name }) => {
  const { def, css, svg, image, font } = map;

  if (!name) return def;
  if (name.endsWith('.css')) return css;
  if (/\.(svg)$/i.test(name)) return svg;
  if (/\.(png|jpe?g|gif|webp)$/i.test(name)) return image;
  if (/\.(ttf|woff|woff2)$/i.test(name)) return font;
  return def;
};
