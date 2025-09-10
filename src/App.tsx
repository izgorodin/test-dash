import { MultiAssetChart } from './components/MultiAssetChart'
import { DataProvider, type DataSource, type AssetRow } from './data/DataProvider'
import { AssetTable } from './components/AssetTable'
import { useState } from 'react'

export default function App() {
  const [source, setSource] = useState<DataSource>('auto')
  const [filteredData, setFilteredData] = useState<AssetRow[]>([])
  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Asset Dashboard</h1>
            <p className="muted">Multi-asset time series chart with editable mock DB</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label htmlFor="data-source" className="muted">Data source:</label>
            <select
              id="data-source"
              className="tab"
              value={source}
              onChange={(e) => setSource(e.target.value as DataSource)}
              aria-label="Data source"
            >
              <option value="auto">Auto</option>
              <option value="json">JSON only</option>
              <option value="generator">Generator only</option>
            </select>
          </div>
        </div>
      </header>
      <main className="content">
        <DataProvider source={source}>
          <MultiAssetChart onFilteredDataChange={setFilteredData} />
          <AssetTable filteredRows={filteredData} />
        </DataProvider>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Asset Lab</footer>
    </div>
  )
}
