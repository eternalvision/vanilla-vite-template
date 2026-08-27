/**
 * "Multi-page" entry point. Registered in `vite.config.js` under
 * `build.rollupOptions.input`; everything else is shared with the home page.
 */

import { startApp } from '@/bootstrap.js';
import { about } from '@/templates';

startApp(about(), { titleKey: 'about.title' });
