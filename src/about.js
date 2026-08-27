/**
 * "About" page entry point. Every `*.html` in the project root becomes a page;
 * this module is what its script tag points at.
 */

import { startApp } from '@/bootstrap.js';
import { about } from '@/templates';

startApp(({ t }) => about({ t }), { titleKey: 'about.title' });
