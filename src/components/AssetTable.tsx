import { useMemo } from 'react'
import { useData } from '../data/DataProvider'

export function AssetTable() {
  const { rows, isLoading } = useData()

  const head = useMemo(() => ['Asset', 'Date', 'Value'], [])

  return (
    <div className="card">
      <div className="card-header"><h2>Таблица данных (mock DB)</h2></div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={head.length} style={{ padding: 16, color: 'var(--muted)' }}>Загрузка…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={head.length} style={{ padding: 16, color: 'var(--muted)' }}>Нет данных</td></tr>
            ) : (
              rows.slice(-200).reverse().map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>{r.asset}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>{r.date}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(r.value)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
