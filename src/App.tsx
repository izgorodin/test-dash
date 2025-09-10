/**
 * Main application component.
 * 
 * Manages data source selection and coordinates data flow between
 * the chart component and data table.
 */
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>Asset Dashboard</h1>
            <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>Multi-asset time series chart with editable mock DB</p>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            minWidth: '200px'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: source === 'json' ? '#22c55e' : source === 'generator' ? '#f59e0b' : '#60a5fa'
            }} />
            <label htmlFor="data-source" className="muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Source:</label>
            <select
              id="data-source"
              className="tab"
              value={source}
              onChange={(e) => setSource(e.target.value as DataSource)}
              aria-label="Data source"
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="auto">Auto</option>
              <option value="json">JSON</option>
              <option value="generator">Generator</option>
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
      <footer className="footer">
        <span>© 2025 izgorodin</span>
        <span style={{ margin: '0 8px' }}>•</span>
        <a
          href="https://github.com/izgorodin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="footer-link"
          title="GitHub"
        >
          <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.84 1.31 3.53 1 .11-.79.42-1.31.77-1.61-2.66-.3-5.47-1.33-5.47-5.9 0-1.3.47-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.22a11.5 11.5 0 0 1 6.01 0c2.29-1.54 3.3-1.22 3.3-1.22.66 1.65.24 2.87.12 3.17.77.83 1.24 1.89 1.24 3.19 0 4.58-2.81 5.6-5.49 5.9.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z"/>
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/izgorodin/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="footer-link"
          title="LinkedIn"
          style={{ marginLeft: 8 }}
        >
          <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.41-1.85 3.65 0 4.33 2.4 4.33 5.52v6.22zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/>
          </svg>
        </a>
      </footer>
    </div>
  )
}
