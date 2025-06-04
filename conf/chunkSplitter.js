// this module exports a function that splits vendor modules into separate chunks for caching
export const chunkSplitter = (id) => {
  if (!id.includes('node_modules')) return;

  const parts = id.split('node_modules/')[1].split('/');
  const isScoped = parts[0].startsWith('@');
  const pkgName = isScoped ? `${parts[0]}_${parts[1]}` : parts[0];

  return `vendor/${pkgName}`;
};
