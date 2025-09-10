import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
  // reload full dataset (no UI filters here)
  reload: () => Promise<void>
}

const DataCtx = createContext<DataState | null>(null)

// A mock fetcher simulating a DB call and converting into table rows
// Always returns a full dataset without applying presentation filters
export type DataSource = 'auto' | 'json' | 'generator'
async function mockFetchRows(source: DataSource): Promise<AssetRow[]> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 200))
  // Choose source: json/generator/auto
  let baseSets: Array<{ id: string; name: string; points: { date: string; value: number }[] }> | null = null
  if (source === 'json' || source === 'auto') {
    baseSets = (mockDB?.assets?.length ? mockDB.assets : null) as any
  }
  if (!baseSets && (source === 'generator' || source === 'auto')) {
    baseSets = generateMockAssets(10, 365) as any
  }
  if (!baseSets) baseSets = []
  // Flatten ALL data to table-like rows
  const rows: AssetRow[] = []
  for (const a of baseSets) {
    for (const p of a.points) {
      const id = (a as any).key ?? a.id
      rows.push({ id, asset: a.name, date: p.date, value: p.value })
    }
  }
  return rows
}

export function DataProvider({
  children,
  source = 'auto',
}: {
  children: React.ReactNode
  source?: DataSource
}) {
  const [rows, setRows] = useState<AssetRow[]>([])
  const [isLoading, setLoading] = useState(false)

  const reload: DataState['reload'] = useCallback(async () => {
    setLoading(true)
    try {
      const r = await mockFetchRows(source)
      setRows(r)
    } finally {
      setLoading(false)
    }
  }, [source])

  // Load once on mount; UI controls must not trigger reloads here
  useEffect(() => {
    void reload()
  }, [reload])

  const series: AssetSeries[] = useMemo(() => {
    const byAsset = new Map<string, AssetRow[]>()
    for (const r of rows) {
      const arr = byAsset.get(r.id) ?? []
      arr.push(r)
      byAsset.set(r.id, arr)
    }
    return [...byAsset.entries()].map(([id, arr]) => ({
      key: id,
      name: arr[0]?.asset ?? id,
      color: undefined,
      points: arr
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((r) => ({ date: r.date, value: r.value })),
    }))
  }, [rows])

  const value = useMemo<DataState>(
  () => ({ rows, series, isLoading, reload }),
  [rows, series, isLoading, reload],
  )

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useData() {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}
