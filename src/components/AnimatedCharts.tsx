'use client'
import { motion } from 'framer-motion'

interface BarData {
  label: string
  value: number
  color?: string
}

export function AnimatedBarChart({ data, maxValue }: { data: BarData[]; maxValue?: number }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)
  const defaultColors = ['var(--color-primary)', 'var(--color-secondary)', '#6B5CE7', 'var(--color-success)', 'var(--color-warning)', 'var(--color-accent)']

  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="text-[10px] font-bold text-[var(--color-text-muted)]"
          >
            {d.value}
          </motion.span>
          <motion.div
            className="w-full rounded-t-lg min-h-[4px]"
            style={{ background: d.color || defaultColors[i % defaultColors.length] }}
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-[9px] text-[var(--color-text-muted)] font-medium text-center leading-tight truncate w-full">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

interface PieSlice {
  label: string
  value: number
  color: string
}

export function AnimatedPieChart({ data, size = 120 }: { data: PieSlice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = size / 2 - 8
  const cx = size / 2
  const cy = size / 2

  let cumulative = 0
  const slices = data.map(d => {
    const pct = d.value / total
    const start = cumulative
    cumulative += pct
    return { ...d, start, pct }
  })

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((s, i) => {
            const startAngle = s.start * 2 * Math.PI - Math.PI / 2
            const endAngle = (s.start + s.pct) * 2 * Math.PI - Math.PI / 2
            const largeArc = s.pct > 0.5 ? 1 : 0
            const x1 = cx + r * Math.cos(startAngle)
            const y1 = cy + r * Math.sin(startAngle)
            const x2 = cx + r * Math.cos(endAngle)
            const y2 = cy + r * Math.sin(endAngle)
            const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
            return (
              <motion.path
                key={i}
                d={path}
                fill={s.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            )
          })}
          <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--color-bg-card)" />
        </svg>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-[var(--color-text-muted)]">{d.label}</span>
            <span className="text-[11px] font-bold text-[var(--color-text)] ml-auto">{d.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface StatRow {
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
}

export function AnimatedStatTable({ rows }: { rows: StatRow[] }) {
  return (
    <div className="w-full">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-light)] last:border-0"
        >
          <span className="text-[12px] text-[var(--color-text-secondary)]">{r.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-[var(--color-navy)]">{r.value}</span>
            {r.change && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                r.changeType === 'up' ? 'bg-green-500/10 text-green-600' :
                r.changeType === 'down' ? 'bg-red-500/10 text-red-500' :
                'bg-gray-500/10 text-gray-500'
              }`}>
                {r.changeType === 'up' ? '↑' : r.changeType === 'down' ? '↓' : '—'} {r.change}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
