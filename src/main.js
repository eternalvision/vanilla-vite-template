/*
 * entry point for rendering Handlebars templates with internationalization:
 * 1. imports global styles, normalize.css, icon fonts, tailwind and custom sass
 * 2. registers a Handlebars helper 'eq' for equality checks in templates
 * 3. defines a 'props' function to provide data to each template by name
 * 4. selects the '#app' root element, clears existing content, and mounts compiled templates
 * 5. initializes i18next to update elements with 'data-lang' attributes on load and language change
 */

import Handlebars, { compile } from 'handlebars';
import templates from './templates';
import i18next from './i18n';

import 'normalize.css';
import 'material-icons/iconfont/material-icons.css';
import 'flag-icons/css/flag-icons.min.css';
import '@/tailwind.css';
import '@/sass/styles.scss';

Handlebars.registerHelper('eq', (a, b) => a === b);

const props = ({ name }) => {
  switch (name) {
    case 'nav':
      return {};
    case 'header':
      return {};
    case 'main':
      return {};
    case 'footer':
      return {};
    default:
      return {};
  }
};

const entryPoint = 'app';

const mount = document.getElementById(entryPoint);

mount.innerHTML = '';

mount.innerHTML = Object.entries(templates)
  .map(([name, source]) => compile(source)(props({ name })))
  .join('');

window.i18next = i18next.on('initialized languageChanged', () => {
  document
    .querySelectorAll('[data-lang]')
    .forEach((el) => (el.textContent = i18next.t(el.dataset.lang)));
});
