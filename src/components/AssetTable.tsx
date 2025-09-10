import { useMemo } from 'react'
import type { AssetRow } from '../data/DataProvider'

type AssetTableProps = {
  /** Filtered asset data rows to display */
  filteredRows?: AssetRow[]
  /** Loading state indicator */
  isLoading?: boolean
}

/**
 * Data table displaying filtered asset information.
 * Shows only the data that matches current chart filters.
 */
export function AssetTable({ filteredRows = [], isLoading = false }: AssetTableProps) {

  const head = useMemo(() => ['Asset', 'Date', 'Value'], [])

  return (
    <div className="card">
      <div className="card-header">
        <h2>Filtered Data ({filteredRows.length} records)</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {head.map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--muted)',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={head.length} style={{ padding: 16, color: 'var(--muted)' }}>
                  Loading…
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={head.length} style={{ padding: 16, color: 'var(--muted)' }}>
                  No data matches current filters
                </td>
              </tr>
            ) : (
              filteredRows
                .slice(0, 200)
                .map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                      {r.asset}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--muted)',
                      }}
                    >
                      {r.date}
                    </td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                      $
                      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(r.value)}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
