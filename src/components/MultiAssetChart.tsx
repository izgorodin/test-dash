import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { PALETTE_10 } from '../data/palette'
import { useData } from '../data/DataProvider'

type Combined = { date: string; [key: string]: number | string }

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)

export function MultiAssetChart() {
  const [days, setDays] = useState<30 | 90 | 180 | 365>(180)
  const [count, setCount] = useState(5)
  const { series, reload, isLoading } = useData()

  useEffect(() => {
    reload({ assets: count, days })
  }, [count, days, reload])

  const data: Combined[] = useMemo(() => {
    const assets = series.map((s, i) => ({
      ...s,
      color: s.color ?? PALETTE_10[i % PALETTE_10.length],
    }))
    if (!assets.length) return []
    // объединяем точки по дате
    const byDate = new Map<string, Combined>()
    for (const a of assets) {
      for (const p of a.points) {
        if (!byDate.has(p.date)) byDate.set(p.date, { date: p.date })
        byDate.get(p.date)![a.key] = p.value
      }
    }
    return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  }, [series])

  return (
    <div className="card">
      <div className="card-header">
        <h2>Assets Over Time</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="tabs" role="tablist" aria-label="Date range">
            {[30, 90, 180, 365].map((d) => (
              <button
                key={d}
                className={d === days ? 'tab active' : 'tab'}
                aria-pressed={d === days}
                onClick={() => setDays(d as any)}
              >
                {d}d
              </button>
            ))}
          </div>
          <select className="tab" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} assets
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart-wrap">
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted)',
            }}
          >
            Loading…
          </div>
        )}
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={{ left: 8, right: 12, top: 12, bottom: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), 'd MMM')}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => currency(v).replace('$', '$ ')}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
              labelFormatter={(d) => format(parseISO(String(d)), 'd MMM yyyy')}
              formatter={(v, name) => [
                currency(Number(v)),
                series.find((a) => a.key === name)?.name ?? String(name),
              ]}
            />
            <Legend
              formatter={(key) => (
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {series.find((a) => a.key === key)?.name ?? String(key)}
                </span>
              )}
              wrapperStyle={{ paddingTop: 8 }}
            />
            {series.map((a, i) => (
              <defs key={`defs_${a.key}`}>
                <linearGradient id={`g_${a.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PALETTE_10[i % PALETTE_10.length]}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={PALETTE_10[i % PALETTE_10.length]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
            ))}
            {series.map((a, i) => (
              <Area
                key={a.key}
                type="monotone"
                dataKey={a.key}
                stroke={PALETTE_10[i % PALETTE_10.length]}
                strokeWidth={2}
                fill={`url(#g_${a.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
