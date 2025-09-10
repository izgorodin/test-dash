/**
 * Hook for processing chart data with filtering and aggregation.
 * Handles date range filtering, asset selection, and data transformation
 * for both chart visualization and table display.
 */
import { useMemo } from 'react'
import { PALETTE_10 } from '../data/palette'
import type { AssetSeries } from '../data/mock'
import type { AssetRow } from '../data/DataProvider'

export type Combined = {
  date: string
  [assetKey: string]: number | string
}

export type ChartFilters = {
  days: 30 | 90 | 180 | 365 | 'custom'
  customStartDate: string
  customEndDate: string
  selectedAssets: Set<string>
}

/**
 * Processes asset series data with applied filters for chart and table display.
 * 
 * @param series - Array of asset series data
 * @param filters - Chart filtering parameters
 * @returns Processed data for chart visualization and table display
 */
export function useChartData(series: AssetSeries[], filters: ChartFilters) {
  const { days, customStartDate, customEndDate, selectedAssets } = filters
  
  const visibleSeries = useMemo(() => 
    series.filter(s => selectedAssets.has(s.key)), 
    [series, selectedAssets]
  )

  const { data, filteredRows } = useMemo(() => {
    if (!visibleSeries.length) return { data: [], filteredRows: [] }
    
    let startDate: string
    let endDate: string
    
    if (days === 'custom') {
      if (!customStartDate || !customEndDate) return { data: [], filteredRows: [] }
      startDate = customStartDate
      endDate = customEndDate
    } else {
      const maxDate = visibleSeries
        .flatMap((s) => s.points.map((p) => p.date))
        .reduce((m, d) => (d > m ? d : m), visibleSeries[0].points[0]?.date ?? new Date().toISOString().slice(0, 10))
      
      endDate = maxDate
      const end = new Date(maxDate)
      const ms = end.getTime() - (days - 1) * 24 * 60 * 60 * 1000
      startDate = new Date(ms).toISOString().slice(0, 10)
    }

    const assets = visibleSeries.map((s, i) => ({
      ...s,
      color: s.color ?? PALETTE_10[i % PALETTE_10.length],
      points: s.points.filter((p) => p.date >= startDate && p.date <= endDate),
    }))

    // Combine points by date for chart
    const byDate = new Map<string, Combined>()
    for (const a of assets) {
      for (const p of a.points) {
        if (!byDate.has(p.date)) byDate.set(p.date, { date: p.date })
        byDate.get(p.date)![a.key] = p.value
      }
    }
    const chartData = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))

    // Create filtered rows for table
    const filteredRows: AssetRow[] = []
    for (const asset of assets) {
      for (const point of asset.points) {
        filteredRows.push({
          id: asset.key,
          asset: asset.name,
          date: point.date,
          value: point.value
        })
      }
    }
    // Sort by date descending, then by asset name
    filteredRows.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date)
      if (dateCompare !== 0) return dateCompare
      return a.asset.localeCompare(b.asset)
    })

    return { data: chartData, filteredRows }
  }, [visibleSeries, days, customStartDate, customEndDate])

  return {
    visibleSeries,
    data,
    filteredRows
  }
}