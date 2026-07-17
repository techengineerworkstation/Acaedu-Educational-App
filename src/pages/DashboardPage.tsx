import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { fetchTable } from '../lib/supabase'
import type { User } from '../types'
import { BookOpen, FileText, Calendar, Bell, ClipboardList, CheckCircle, BarChart3, Video } from 'lucide-react'

/* ─── Animated counter ───────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current
      const ctrl = animate(0, value, {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        onUpdate(v) {
          node.textContent = suffix === '%' ? `${v.toFixed(1)}%` : Math.round(v).toString()
        },
      })
      return () => ctrl.stop()
    }
  }, [inView, value, suffix])
  return <span ref={ref}>0</span>
}

/* ─── Donut ring ─────────────────────────────────────────────── */
function DonutRing({ value, max, color, size = 110, label }: {
  value: number; max: number; color: string; size?: number; label: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  const radius = (size - 14) / 2
  const circ = 2 * Math.PI * radius
  const pct = max > 0 ? value / max : 0

  useEffect(() => {
    if (inView && ref.current) {
      const circle = ref.current.querySelector('circle:last-child') as SVGCircleElement
      if (circle) {
        circle.style.strokeDasharray = `${circ}`
        circle.style.strokeDashoffset = `${circ}`
        const ctrl = animate(0, pct * circ, {
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          onUpdate(v) { circle.style.strokeDashoffset = `${circ - v}` },
        })
        return () => ctrl.stop()
      }
    }
  }, [inView, pct, circ])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={ref} width={size} height={size} className="-rotate-90 absolute inset-0">
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke="var(--color-bg-secondary)" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            style={{ strokeDasharray: circ, strokeDashoffset: circ }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-[var(--color-navy)]"
            style={{ fontFamily: 'var(--font-display)' }}>{value}</span>
        </div>
      </div>
      <span className="text-[11px] text-[var(--color-text-muted)] font-medium">{label}</span>
    </div>
  )
}

/* ─── Bar chart ──────────────────────────────────────────────── */
function BarChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div ref={ref} className="flex items-end gap-3 h-36 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-[var(--color-navy)]">{d.value}</span>
          <div className="w-full rounded-t-[5px] overflow-hidden min-h-[4px]"
            style={{
              height: inView ? `${(d.value / max) * 100}%` : '0%',
              background: colors[i % colors.length],
              transition: `height 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
            }} />
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Pie chart ──────────────────────────────────────────────── */
function PieChart({ segments, size = 130 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  let cumulative = 0
  const gradients = segments.map(seg => {
    const start = (cumulative / total) * 360
    cumulative += seg.value
    const end = (cumulative / total) * 360
    return `${seg.color} ${start}deg ${end}deg`
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full" style={{ width: size, height: size, background: `conic-gradient(${gradients.join(', ')})` }}>
        <div className="rounded-full flex items-center justify-center bg-[var(--color-bg-card)]"
          style={{ width: size * 0.54, height: size * 0.54, margin: `${size * 0.23}px auto` }}>
          <span className="text-[13px] font-extrabold text-[var(--color-navy)]"
            style={{ fontFamily: 'var(--font-display)' }}>{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-[11px] text-[var(--color-text-muted)]">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Stats table ────────────────────────────────────────────── */
function StatsTable({ title, headers, rows }: {
  title: string; headers: string[]; rows: (string | number)[][]
}) {
  return (
    <div className="table-container">
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <span className="text-[12px] font-bold text-[var(--color-navy)]"
          style={{ fontFamily: 'var(--font-display)' }}>{title}</span>
      </div>
      <table className="table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length}
                className="text-center text-[var(--color-text-muted)] py-8 text-[13px]">
                No data available
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Stat card data ─────────────────────────────────────────── */
const statCards = [
  { key: 'subjects',      label: 'Active Subjects',    icon: BookOpen,     accent: 'var(--color-primary)' },
  { key: 'exams',         label: 'Upcoming Exams',     icon: FileText,     accent: 'var(--color-secondary)' },
  { key: 'lectures',      label: 'Lectures This Week', icon: Calendar,     accent: 'var(--color-accent)' },
  { key: 'notifications', label: 'Notifications',      icon: Bell,         accent: 'var(--color-success)' },
  { key: 'assignments',   label: 'Pending Work',       icon: ClipboardList,accent: 'var(--color-warning)' },
  { key: 'completed',     label: 'Completed',          icon: CheckCircle,  accent: '#6B5CE7' },
  { key: 'grade',         label: 'Grade Average',      icon: BarChart3,    accent: 'var(--color-primary-light)' },
  { key: 'sessions',      label: 'Live Sessions',      icon: Video,        accent: 'var(--color-danger)' },
]

/* ─── Main dashboard ─────────────────────────────────────────── */
export function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [recentCourses, setRecentCourses] = useState<Record<string, unknown>[]>([])
  const [recentGrades, setRecentGrades] = useState<Record<string, unknown>[]>([])
  const [recentAnnouncements, setRecentAnnouncements] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [courses, exams, assignments, notifications, grades, schedules, announcements] =
          await Promise.all([
            fetchTable('courses'), fetchTable('exams'), fetchTable('assignments'),
            fetchTable('notifications'), fetchTable('grades'), fetchTable('schedules'),
            fetchTable('announcements'),
          ])
        const gradeAvg = grades.length > 0
          ? grades.reduce((s: number, g: Record<string, unknown>) => s + ((g.score as number) || 0), 0) / grades.length
          : 0
        const completed = grades.filter((g: Record<string, unknown>) => (g.score as number) >= 50).length
        setStats({
          subjects: courses.length, exams: exams.length, lectures: schedules.length,
          notifications: notifications.length, assignments: assignments.length,
          completed, grade: gradeAvg, sessions: schedules.length,
        })
        setRecentCourses(courses.slice(0, 5))
        setRecentGrades(grades.slice(0, 5))
        setRecentAnnouncements(announcements.slice(0, 5))
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Page header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <span className="section-label">Dashboard</span>
        <h1 className="section-title mt-1.5 text-2xl">
          {greeting()}, {user.full_name}
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1 capitalize">
          {user.role} Overview
        </p>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-[110px] rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={card.key}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.055, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="card p-4 flex flex-col gap-3 cursor-default group hover:-translate-y-1 transition-transform duration-200"
              style={{ borderTop: `3px solid ${card.accent}` }}>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ background: `${card.accent}18` }}>
                  <card.icon size={16} style={{ color: card.accent }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[var(--color-navy)] leading-none mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  <AnimatedCounter value={stats[card.key] || 0} suffix={card.key === 'grade' ? '%' : ''} />
                </div>
                <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.08em]">
                  {card.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Charts row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          transition={{ delay: 0.4 }} className="card p-5">
          <span className="section-label block mb-4">Completion</span>
          <div className="flex items-center justify-center gap-6">
            <DonutRing value={stats.completed || 0}
              max={Math.max((stats.completed || 0) + (stats.assignments || 0), 1)}
              color="var(--color-success)" label="Done" />
            <DonutRing value={stats.assignments || 0}
              max={Math.max((stats.completed || 0) + (stats.assignments || 0), 1)}
              color="var(--color-secondary)" label="Pending" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          transition={{ delay: 0.45 }} className="card p-5">
          <span className="section-label block mb-4">Activity</span>
          <BarChart
            data={[
              { label: 'Courses',  value: stats.subjects      || 0 },
              { label: 'Exams',    value: stats.exams         || 0 },
              { label: 'Grades',   value: stats.completed     || 0 },
              { label: 'Notif.',   value: Math.min(stats.notifications || 0, 20) },
              { label: 'Sessions', value: stats.lectures      || 0 },
            ]}
            colors={[
              'var(--color-primary)',
              'var(--color-secondary)',
              'var(--color-success)',
              'var(--color-accent)',
              'var(--color-primary-light)',
            ]}
          />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          transition={{ delay: 0.5 }} className="card p-5">
          <span className="section-label block mb-4">Distribution</span>
          <PieChart segments={[
            { value: stats.subjects    || 0, color: 'var(--color-primary)',   label: 'Subjects' },
            { value: stats.exams       || 0, color: 'var(--color-secondary)', label: 'Exams' },
            { value: stats.assignments || 0, color: 'var(--color-success)',   label: 'Assignments' },
            { value: stats.completed   || 0, color: '#6B5CE7',                label: 'Completed' },
          ]} />
        </motion.div>
      </div>

      {/* ── Tables ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <StatsTable
            title="Recent Courses"
            headers={['Course', 'Code', 'Credits']}
            rows={recentCourses.map(c => [
              String(c.title || '-'),
              String(c.course_code || '-'),
              String(c.credits || '-'),
            ])}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <StatsTable
            title="Latest Grades"
            headers={['Student', 'Score', 'Grade']}
            rows={recentGrades.map(g => [
              String(g.student_id || '-'),
              String(g.score ?? '-'),
              String(g.grade_letter || '-'),
            ])}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <StatsTable
            title="Announcements"
            headers={['Title', 'Priority', 'Date']}
            rows={recentAnnouncements.map(a => [
              String(a.title || '-'),
              String(a.priority || '-'),
              a.created_at ? new Date(a.created_at as string).toLocaleDateString() : '-',
            ])}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }} className="card p-5">
          <span className="section-label block mb-4">Quick Stats</span>
          <div className="space-y-2.5">
            {[
              { label: 'Total Courses',  value: stats.subjects || 0,                 accent: 'var(--color-primary)' },
              { label: 'Total Exams',    value: stats.exams    || 0,                 accent: 'var(--color-secondary)' },
              { label: 'Avg Grade',      value: `${(stats.grade || 0).toFixed(1)}%`, accent: 'var(--color-success)' },
              { label: 'Live Sessions',  value: stats.sessions || 0,                 accent: 'var(--color-danger)' },
            ].map((item, i) => (
              <div key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-bg)]">
                <span className="text-[12px] text-[var(--color-text-muted)] font-medium">{item.label}</span>
                <span className="text-[13px] font-bold" style={{ color: item.accent, fontFamily: 'var(--font-display)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  )
}
