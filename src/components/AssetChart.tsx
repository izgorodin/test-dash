import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { generateMockSeries } from '../data/mock'

type Point = { date: string; value: number }

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function AssetChart() {
  const [days, setDays] = useState<30 | 90 | 180 | 365>(180)
  const data: Point[] = useMemo(() => generateMockSeries(days), [days])

  return (
    <div className="card">
      <div className="card-header">
        <h2>Asset Value Over Time</h2>
        <div className="tabs">
          {[30, 90, 180, 365].map((d) => (
            <button
              key={d}
              className={d === days ? 'tab active' : 'tab'}
              onClick={() => setDays(d as typeof days)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={data} margin={{ left: 8, right: 12, top: 12, bottom: 8 }}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelFormatter={(d) => format(parseISO(String(d)), 'd MMM yyyy')}
              formatter={(v) => [currency(Number(v)), 'Value']}
            />
            <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
