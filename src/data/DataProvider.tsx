import { createContext, useContext, useMemo, useState } from 'react'
import type { AssetSeries } from './mock'
import { generateMockAssets } from './mock'
import mockDB from './mock-db.json'

// Types representing a row in a DB-like table
export type AssetRow = {
  id: string
  asset: string
  date: string // YYYY-MM-DD
  value: number
}

type DataState = {
  // raw rows as if they came from DB
  rows: AssetRow[]
  // derived series grouped by asset id
  series: AssetSeries[]
  isLoading: boolean
  reload: (opts?: { assets?: number; days?: number }) => Promise<void>
}

const DataCtx = createContext<DataState | null>(null)

// A mock fetcher simulating a DB call and converting into table rows
async function mockFetchRows(assets: number, days: number): Promise<AssetRow[]> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 200))
  // If user edited mock-db.json, prefer it; otherwise fallback to generator
  const sets = (mockDB?.assets?.length ? mockDB.assets : generateMockAssets(assets, days)) as Array<{
    id: string
    name: string
    points: { date: string; value: number }[]
  }>
  const rows: AssetRow[] = []
  for (const a of sets) {
    for (const p of a.points) {
      // a.id for JSON, a.key for generator
      rows.push({ id: (a as any).key ?? a.id, asset: a.name, date: p.date, value: p.value })
    }
  }
  return rows
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRows] = useState<AssetRow[]>([])
  const [isLoading, setLoading] = useState(false)

  const reload: DataState['reload'] = async (opts) => {
    setLoading(true)
    try {
      const assets = opts?.assets ?? 5
      const days = opts?.days ?? 180
      const r = await mockFetchRows(assets, days)
      setRows(r)
    } finally {
      setLoading(false)
    }
  }

  const series: AssetSeries[] = useMemo(() => {
    const byAsset = new Map<string, AssetRow[]>()
    for (const r of rows) {
      const arr = byAsset.get(r.id) ?? []
      arr.push(r)
      byAsset.set(r.id, arr)
    }
    return [...byAsset.entries()].map(([id, arr], idx) => ({
      key: id,
      name: arr[0]?.asset ?? id,
      color: undefined as any, // цвет предоставит визуальный слой
      points: arr
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((r) => ({ date: r.date, value: r.value })),
    }))
  }, [rows])

  const value = useMemo<DataState>(() => ({ rows, series, isLoading, reload }), [rows, series, isLoading])

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useData() {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}
