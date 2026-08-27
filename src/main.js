/**
 * Home page entry point.
 *
 * State is a plain object. After changing it, call `update()` — the page is
 * re-rendered with focus, caret and scroll position preserved.
 */

import { startApp } from '@/bootstrap.js';
import { home } from '@/templates';

/** @type {import('@/templates/home.js').HomeState} */
const state = { name: '', count: 0 };

const app = startApp(({ t }) => home({ t, state }));

app.root.addEventListener('input', (event) => {
  const field = event.target;

  if (!(field instanceof HTMLInputElement) || field.dataset.field !== 'name') return;

  state.name = field.value;
  app.update();
});

app.root.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest('[data-action="increment"]')) return;

  state.count += 1;
  app.update();
});
