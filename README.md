# Asset Dashboard (React + Vite)

Student-quality example of a modern dashboard: dark theme, multi-asset time series chart, and an editable mock database. Built with React, TypeScript, Vite, and Recharts.

## Features

- Multi-asset area chart (up to 10 series) with a clean dark UI
- Date range switcher (30/90/180/365 days)
- Data provider abstraction to swap mock DB for a real backend
- Editable mock data file: `src/data/mock-db.json`
- Simple data table to inspect raw rows
 - Clean separation of concerns: provider loads full data, UI applies filters
 - Mock generators cap history to max 2 years (730 days)

## Quick start

1. Install dependencies
2. Start the dev server

```bash
npm i
npm run dev
```

Open http://localhost:5173

## Edit sample data

Update `src/data/mock-db.json`. The app hot-reloads your changes instantly.

Schema:


### Choose data source

Use the “Data source” selector in the header:
- Auto — prefer JSON if present, otherwise fall back to generator
- JSON — use only `mock-db.json`
- Generator — ignore JSON and synthesize data

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

## Deployment

The project automatically deploys to GitHub Pages when code is pushed to the `rc` branch. The deployment workflow:

1. Builds the project using `npm run build`
2. Uploads the `dist` folder to GitHub Pages
3. Makes the site available at your GitHub Pages URL

The deployment is configured in `.github/workflows/deploy.yml` and requires GitHub Pages to be enabled in your repository settings.

## Code quality

ESLint + Prettier are configured. Recommended VS Code extensions are included in `.vscode/extensions.json`.

## Architecture in brief

- DataProvider (data layer): loads the full dataset (from `mock-db.json` or generator), exposes raw `rows` and grouped `series`. No UI filters here. `reload()` fetches all data.
- MultiAssetChart (presentation): holds UI state (asset count, date range) and applies filtering locally; also handles colors, legend, and layout.
- AssetTable: renders `rows` for inspection/debugging.

## License

MIT — see `LICENSE`.
