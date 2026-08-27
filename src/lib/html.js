/**
 * Minimal HTML templating built on tagged template literals.
 *
 * Interpolated values are HTML-escaped by default; wrap a value in `raw()`
 * to opt out (only for markup you produced yourself).
 */

/** @type {Record<string, string>} */
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapes the characters that can break out of an HTML text or attribute context.
 *
 * @param {unknown} value
 * @returns {string}
 */
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);

/** Marker for markup that must not be escaped again. */
export class RawHtml {
  /** @param {string} value */
  constructor(value) {
    /** @type {string} */
    this.value = value;
  }

  /** @returns {string} */
  toString() {
    return this.value;
  }
}

/**
 * Marks a string as trusted markup so `html` interpolates it verbatim.
 *
 * @param {string} value
 * @returns {RawHtml}
 */
export const raw = (value) => new RawHtml(value);

/**
 * Renders one interpolated value: nullish and `false` disappear, arrays are
 * concatenated, `RawHtml` passes through, everything else is escaped.
 *
 * @param {unknown} value
 * @returns {string}
 */
const stringify = (value) => {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof RawHtml) return value.value;
  if (Array.isArray(value)) return value.map(stringify).join('');
  return escapeHtml(value);
};

/**
 * Tagged template that builds escaped markup.
 *
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {RawHtml}
 */
export const html = (strings, ...values) => {
  let output = strings[0];

  for (let index = 0; index < values.length; index += 1) {
    output += stringify(values[index]) + strings[index + 1];
  }

  return raw(output);
};
