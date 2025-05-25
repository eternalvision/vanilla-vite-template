# vanilla-vite-template

## Features

- **Vite** for fast development server and optimized build.
- **Handlebars** for simple, declarative templating without heavy frameworks.
- **i18next** with HTTP backend and automatic language detection.
- **Tailwind CSS** with custom configuration and Sass integration.
- **Sass** for structured, reusable styles and variables.
- **Normalize.css** , **Material Icons** , **Flag Icons** for ready-to-use global styles and icons.
- **ESLint** with recommended rules and browser globals support.

## Project Structure

```
├── index.html                # Main HTML entry point
├── public                    # Static assets (images, locales)
├── src                       # Source code
│   ├── templates             # Handlebars templates (.hbs, .handlebars)
│   ├── sass                  # Sass files
│   ├── tailwind.css          # Tailwind CSS entry
│   ├── i18n.js               # i18next configuration
│   ├── main.js               # Handlebars init and rendering
│   └── ...                   # Other JS modules
├── .env                      # Environment variables (optional)
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
├── .eslintrc.js              # ESLint configuration
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation (this file)
```

## Getting Started

```bash
# Clone the repository
git clone <REPO_URL> my-project
cd my-project

# Install dependencies
npm install
# or
yarn install
```

## Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start development server on port 9999 |
| `npm run build`   | Build for production into `dist/`     |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint to check code quality      |

## Configuration

### Environment Variables

- **envDir** : Directory to load `.env` files (defaults to project root).
- **envPrefix** : Prefix for exposed environment variables (default: `VITE_`).

Create a `.env` file in the project root:

```ini
VITE_API_URL=https://api.example.com
```

### i18next

Translations are stored in `public/locales/{lng}/{ns}.json`. The default namespace is `common`. Adjust `src/i18n.js` to add more namespaces or detection options.

### Tailwind CSS

- Entry point: `src/tailwind.css`
- Configuration: `tailwind.config.js`
- Add safelist classes or plugins in the Tailwind config.

### Handlebars

Templates in `src/templates` are compiled and rendered into the `<div id="app">` element. Extend the `props` function in `src/main.js` to pass data.

## Extending the Template

- **Styles** : Add or modify Sass modules in `src/sass` and import them.
- **Templates** : Create partials and layouts under `src/templates`.
- **Localization** : Expand namespaces or custom detectors in `src/i18n.js`.
- **Vite Plugins** : Install and configure additional plugins in `vite.config.js`.

## License

MIT © Sasha
