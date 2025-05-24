import Handlebars from 'handlebars';
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

const mount = document.querySelector('#app');

mount.innerHTML = '';

mount.innerHTML = Object.entries(templates)
  .map(([name, source]) => Handlebars.compile(source)(props({ name })))
  .join('');

window.i18next = i18next.on('initialized languageChanged', () => {
  document
    .querySelectorAll('[data-lang]')
    .forEach((el) => (el.textContent = i18next.t(el.dataset.lang)));
});
