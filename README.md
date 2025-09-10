# Asset Dashboard (React + Vite)

Student-quality example of a modern dashboard: dark theme, multi-asset time series chart, and an editable mock database. Built with React, TypeScript, Vite, and Recharts.

## Features

- Multi-asset area chart (up to 10 series) with a clean dark UI
- Date range switcher (30/90/180/365 days)
- Data provider abstraction to swap mock DB for a real backend
- Editable mock data file: `src/data/mock-db.json`
- Simple data table to inspect raw rows

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

- `assets[]` — list of assets
- Each asset: `{ id: string, name: string, points: { date: 'YYYY-MM-DD', value: number }[] }`

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

## Code quality

ESLint + Prettier are configured. Recommended VS Code extensions are included in `.vscode/extensions.json`.

## License

MIT — see `LICENSE`.
