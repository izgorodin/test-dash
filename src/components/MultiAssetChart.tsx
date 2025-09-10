import { useEffect, useState } from 'react'
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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { PALETTE_10 } from '../data/palette'
import { useData } from '../data/DataProvider'
import { useChartData } from '../hooks/useChartData'
import type { AssetSeries } from '../data/mock'
import type { AssetRow } from '../data/DataProvider'

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)

type MultiAssetChartProps = {
  /** Callback fired when filtered data changes for external components */
  onFilteredDataChange?: (filteredRows: AssetRow[]) => void
}

/**
 * Interactive multi-asset chart component with filtering capabilities.
 * Features:
 * - Time range selection (30d/90d/180d/365d/custom)
 * - Asset selection with checkboxes
 * - Custom date range picker
 * - Real-time chart updates
 */
export function MultiAssetChart({ onFilteredDataChange }: MultiAssetChartProps) {
  const [days, setDays] = useState<30 | 90 | 180 | 365 | 'custom'>(180)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const { series, reload, isLoading } = useData()

  // Load full dataset once; presentation filters are applied below
  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize all assets as selected when series data loads
  useEffect(() => {
    if (series.length > 0) {
      setSelectedAssets(new Set(series.map(s => s.key)))
    }
  }, [series])

  const { visibleSeries, data, filteredRows } = useChartData(series, {
    days,
    customStartDate,
    customEndDate,
    selectedAssets
  })

  // Notify parent about filtered data changes
  useEffect(() => {
    onFilteredDataChange?.(filteredRows)
  }, [filteredRows, onFilteredDataChange])

  return (
    <div className="card">
      <div className="card-header">
        <h2>Assets Over Time</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="tabs" role="tablist" aria-label="Date range">
            {[30, 90, 180, 365].map((d) => (
              <button
                key={d}
                className={d === days ? 'tab active' : 'tab'}
                aria-pressed={d === days}
                onClick={() => {
                  setDays(d as 30 | 90 | 180 | 365)
                }}
              >
                {d}d
              </button>
            ))}
            <button
              className={days === 'custom' ? 'tab active' : 'tab'}
              aria-pressed={days === 'custom'}
              onClick={() => setDays('custom')}
            >
              Custom
            </button>
          </div>
          {days === 'custom' && (
            <CustomDateRangePicker 
              startDate={customStartDate}
              endDate={customEndDate}
              onStartDateChange={setCustomStartDate}
              onEndDateChange={setCustomEndDate}
              minDate={series.flatMap(s => s.points.map(p => p.date)).sort()[0]}
              maxDate={series.flatMap(s => s.points.map(p => p.date)).sort().reverse()[0]}
            />
          )}
          <span className="muted">{visibleSeries.length}/{series.length} assets</span>
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
          <AreaChart 
            key={`${days}-${[...selectedAssets].sort().join(',')}-${data.length}`}
            data={data} 
            margin={{ left: 8, right: 12, top: 12, bottom: 8 }}
          >
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
            <defs>
              {visibleSeries.map((a, i) => (
                <linearGradient key={`g_${a.key}`} id={`g_${a.key}`} x1="0" y1="0" x2="0" y2="1">
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
              ))}
            </defs>
            {visibleSeries.map((a, i) => (
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
      <AssetSelector 
        series={series}
        selectedAssets={selectedAssets}
        onSelectionChange={setSelectedAssets}
      />
    </div>
  )
}

type AssetSelectorProps = {
  series: AssetSeries[]
  selectedAssets: Set<string>
  onSelectionChange: (selected: Set<string>) => void
}

function AssetSelector({ series, selectedAssets, onSelectionChange }: AssetSelectorProps) {
  const toggleAsset = (assetKey: string) => {
    const newSelected = new Set(selectedAssets)
    if (newSelected.has(assetKey)) {
      newSelected.delete(assetKey)
    } else {
      newSelected.add(assetKey)
    }
    onSelectionChange(newSelected)
  }

  const toggleAll = () => {
    if (selectedAssets.size === series.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(series.map(s => s.key)))
    }
  }

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-header">
        <h3>Asset Selection</h3>
        <button 
          className="tab" 
          onClick={toggleAll}
          title={selectedAssets.size === series.length ? 'Deselect All' : 'Select All'}
        >
          {selectedAssets.size === series.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {series.map((asset, index) => {
          const isSelected = selectedAssets.has(asset.key)
          const color = PALETTE_10[index % PALETTE_10.length]
          return (
            <label 
              key={asset.key} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                border: `1px solid ${isSelected ? color : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: isSelected ? `${color}10` : 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleAsset(asset.key)}
                style={{ accentColor: color }}
              />
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: color,
                  borderRadius: '2px'
                }} 
              />
              <span style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
                {asset.name}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

type CustomDateRangePickerProps = {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  minDate: string
  maxDate: string
}

function CustomDateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  minDate,
  maxDate
}: CustomDateRangePickerProps) {
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      onStartDateChange(date.toISOString().slice(0, 10))
    } else {
      onStartDateChange('')
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      onEndDateChange(date.toISOString().slice(0, 10))
    } else {
      onEndDateChange('')
    }
  }

  const minDateObj = minDate ? parseISO(minDate) : undefined
  const maxDateObj = maxDate ? parseISO(maxDate) : undefined
  const startDateObj = startDate ? parseISO(startDate) : null
  const endDateObj = endDate ? parseISO(endDate) : null

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <DatePicker
        selected={startDateObj}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDateObj}
        endDate={endDateObj}
        minDate={minDateObj}
        maxDate={maxDateObj}
        dateFormat="d MMM yyyy"
        placeholderText="Start date"
        className="date-picker"
      />
      <span style={{ color: 'rgba(255,255,255,0.6)' }}>to</span>
      <DatePicker
        selected={endDateObj}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDateObj}
        endDate={endDateObj}
        minDate={startDateObj || minDateObj}
        maxDate={maxDateObj}
        dateFormat="d MMM yyyy"
        placeholderText="End date"
        className="date-picker"
      />
    </div>
  )
}
