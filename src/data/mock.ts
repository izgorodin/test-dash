/**
 * Mock data generators for asset time series.
 * 
 * Provides realistic financial data simulation with:
 * - Random walk price movements
 * - Seasonal drift patterns
 * - Multiple asset types
 * - Configurable time ranges (max 2 years)
 */
import { addDays, eachDayOfInterval, subDays } from 'date-fns'
import { PALETTE_10 } from './palette'

export function generateMockSeries(days: number) {
  // Hard cap: do not generate more than 2 years of data
  const MAX_DAYS = 730
  const span = Math.min(Math.max(1, days), MAX_DAYS)
  const end = new Date()
  const start = subDays(end, span - 1)
  const dates = eachDayOfInterval({ start, end })

  let value = 10_000_000 // start value
  const series = dates.map((d, i) => {
    // random walk within ±1.5%
    const drift = Math.sin(i / 14) * 0.002
    const change = (Math.random() - 0.5) * 0.015 + drift
    value = Math.max(2_000_000, value * (1 + change))
    return { date: d.toISOString().slice(0, 10), value: Math.round(value) }
  })

  return series
}

// small helper to project N future days (not used yet, but handy)
export function extendSeries(series: { date: string; value: number }[], extraDays: number) {
  let last = series[series.length - 1]
  const out = [...series]
  for (let i = 1; i <= extraDays; i++) {
    const nextDate = addDays(new Date(last.date), 1)
    const value = Math.round(last.value * (1 + (Math.random() - 0.45) * 0.01))
    last = { date: nextDate.toISOString().slice(0, 10), value }
    out.push(last)
  }
  return out
}

export type AssetSeries = {
  key: string
  name: string
  color?: string
  points: { date: string; value: number }[]
}

export function generateMockAssets(count: number, days: number): AssetSeries[] {
  const names = [
    'Crypto',
    'Hedge Funds',
    'Treasury Bills',
    'Art & Collectibles',
    'Precious Metals',
    'Real Estate',
    'Bonds',
    'Private Equity',
    'Venture',
    'Cash',
  ]
  const num = Math.min(10, Math.max(1, count))
  return new Array(num).fill(0).map((_, i) => {
    const base = 2_000_000 + i * 500_000
      // offset seed for variation
    let value = base + Math.random() * 1_000_000
  // Hard cap: do not generate more than 2 years of data
  const MAX_DAYS = 730
  const span = Math.min(Math.max(1, days), MAX_DAYS)
  const end = new Date()
  const start = subDays(end, span - 1)
    const dates = eachDayOfInterval({ start, end })
    const points = dates.map((d, idx) => {
      const drift = Math.sin((idx + i * 3) / 14) * 0.003
      const change = (Math.random() - 0.5) * 0.02 + drift
      value = Math.max(200_000, value * (1 + change))
      return { date: d.toISOString().slice(0, 10), value: Math.round(value) }
    })
    return {
      key: `asset_${i}`,
      name: names[i] ?? `Asset ${i + 1}`,
      color: PALETTE_10[i % PALETTE_10.length],
      points,
    }
  })
}
