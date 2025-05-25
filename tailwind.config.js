/*
 * tailwind CSS configuration file:
 * 1. specifies which files Tailwind should scan for class names
 * 2. defines a safelist of classes to always include (currently empty)
 * 3. customizes the design system under 'theme' (currently using default settings)
 * 4. registers any Tailwind plugins to extend functionality (none specified)
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './src/templates/**/*.{hbs,handlebars}',
  ],
  safelist: [],
  theme: {},
  plugins: [],
};
