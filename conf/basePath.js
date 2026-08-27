/**
 * Normalizes a public base path into the form Vite expects: a leading and a
 * trailing slash, so `import.meta.env.BASE_URL` can always be concatenated with
 * a relative asset path.
 *
 * GitHub project pages are served from `/<repo>/`, which is why this is
 * configurable at build time rather than hard-coded.
 *
 * @param {string | undefined} value raw value, e.g. `my-repo`, `/my-repo`, `/my-repo/`
 * @returns {string} normalized base, defaulting to `/`
 */
export const normalizeBasePath = (value) => {
  const trimmed = (value ?? '').trim();

  if (!trimmed || trimmed === '/') return '/';

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
};
