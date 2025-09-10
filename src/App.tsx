import { MultiAssetChart } from './components/MultiAssetChart'
import { DataProvider } from './data/DataProvider'
import { AssetTable } from './components/AssetTable'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Asset Dashboard</h1>
        <p className="muted">Multi-asset time series chart with an editable mock DB</p>
      </header>
      <main className="content">
        <DataProvider>
          <MultiAssetChart />
          <AssetTable />
        </DataProvider>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Asset Lab</footer>
    </div>
  )
}
