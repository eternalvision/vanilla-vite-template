/**
 * entry point for rendering Handlebars templates with internationalization.
 * - imports global styles (normalize, tailwind, icons, custom SCSS)
 * - registers common Handlebars helpers
 * - compiles and mounts each template into #app
 * - binds i18next to update `[data-lang]` elements on load and language change
 */

import Handlebars from 'handlebars';
import templates from './templates';
import i18next from './i18n';

import 'normalize.css';
import 'material-icons/iconfont/material-icons.css';
import 'flag-icons/css/flag-icons.min.css';
import '@/tailwind.css';
import '@/sass/styles.scss';

// register common helpers
Handlebars.registerHelper('eq', (a, b) => a === b);

// template props resolver
const getProps = (name) => {
  const shared = {
    lang: i18next.language,
    timestamp: Date.now(),
  };

  const perTemplate = {
    nav: {},
    header: {},
    main: {},
    footer: {},
  };

  return { ...shared, ...(perTemplate[name] || {}) };
};

// mount root
const mount = document.getElementById('app');

if (!mount) {
  console.error('Mount point "#app" not found');
} else {
  mount.innerHTML = ''; // cleaning previous content

  const combinedHTML = Object.entries(templates)
    .map(([name, source]) => {
      try {
        return Handlebars.compile(source)(getProps(name));
      } catch (err) {
        console.error(`Failed to render template "${name}"`, err);
        return '';
      }
    })
    .join('');

  mount.innerHTML = combinedHTML;
}

// bind i18next to update translatable elements
const updateTranslations = () => {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    const key = el.dataset.lang;
    if (key) el.textContent = i18next.t(key);
  });
};

i18next.on('initialized languageChanged', updateTranslations);
updateTranslations(); // initial trigger
