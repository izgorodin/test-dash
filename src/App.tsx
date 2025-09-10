import { MultiAssetChart } from './components/MultiAssetChart'
import { DataProvider, type DataSource } from './data/DataProvider'
import { AssetTable } from './components/AssetTable'
import { useState } from 'react'

export default function App() {
  const [source, setSource] = useState<DataSource>('auto')
  return (
    <div className="app">
      <header className="header">
        <h1>Asset Dashboard</h1>
        <p className="muted">Multi-asset time series chart with an editable mock DB</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <label htmlFor="data-source" className="muted">Data source:</label>
          <select
            id="data-source"
            className="tab"
            value={source}
            onChange={(e) => setSource(e.target.value as DataSource)}
            aria-label="Data source"
          >
            <option value="auto">Auto (JSON if present, else generator)</option>
            <option value="json">JSON only</option>
            <option value="generator">Generator only</option>
          </select>
        </div>
      </header>
      <main className="content">
        <DataProvider source={source}>
          <MultiAssetChart />
          <AssetTable />
        </DataProvider>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Asset Lab</footer>
    </div>
  )
}
