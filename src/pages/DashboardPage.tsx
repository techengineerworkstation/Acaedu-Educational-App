import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { fetchTable } from '../lib/supabase'
import type { User } from '../types'
import { BookOpen, FileText, Calendar, Bell, ClipboardList, CheckCircle, BarChart3, Video } from 'lucide-react'

const statCards = [
  { key: 'subjects', label: 'Active Subjects', icon: BookOpen, gradient: 'linear-gradient(135deg, #1B3A5C, #2A5580)' },
  { key: 'exams', label: 'Upcoming Exams', icon: FileText, gradient: 'linear-gradient(135deg, #B8976A, #D4BA8A)' },
  { key: 'lectures', label: 'Lectures This Week', icon: Calendar, gradient: 'linear-gradient(135deg, #2A5580, #3A6B9F)' },
  { key: 'notifications', label: 'Notifications', icon: Bell, gradient: 'linear-gradient(135deg, #3D8B60, #5AAF7E)' },
  { key: 'assignments', label: 'Pending Work', icon: ClipboardList, gradient: 'linear-gradient(135deg, #C49840, #D4B060)' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, gradient: 'linear-gradient(135deg, #6B5CE7, #8B7BF7)' },
  { key: 'grade', label: 'Grade Average', icon: BarChart3, gradient: 'linear-gradient(135deg, #3A6B9F, #5A9BCF)' },
  { key: 'sessions', label: 'Live Sessions', icon: Video, gradient: 'linear-gradient(135deg, #C44040, #E06060)' },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        onUpdate(v) { node.textContent = suffix === '%' ? `${v.toFixed(1)}%` : Math.round(v).toString() },
      })
      return () => controls.stop()
    }
  }, [isInView, value, suffix])
  return <span ref={ref}>0</span>
}

/* ─── Animated Donut Ring ──────────────────────────────────── */
function DonutRing({ value, max, color, size = 120, label }: { value: number; max: number; color: string; size?: number; label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true })
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const pct = max > 0 ? value / max : 0

  useEffect(() => {
    if (isInView && ref.current) {
      const circle = ref.current.querySelector('circle:last-child') as SVGCircleElement
      if (circle) {
        circle.style.strokeDasharray = `${circumference}`
        circle.style.strokeDashoffset = `${circumference}`
        const controls = animate(0, pct * circumference, {
          duration: 1.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          onUpdate(v) { circle.style.strokeDashoffset = `${circumference - v}` },
        })
        return () => controls.stop()
      }
    }
  }, [isInView, pct, circumference])

  return (
    <div className="flex flex-col items-center gap-2">
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-beige)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset: circumference }} />
      </svg>
      <div className="text-center -mt-[70px] mb-6">
        <div className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-medium">{label}</div>
      </div>
    </div>
  )
}

/* ─── Animated Bar Chart ────────────────────────────────────── */
function BarChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div ref={ref} className="flex items-end gap-3 h-40 px-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-bold text-[var(--color-navy)]">{d.value}</span>
          <div className="w-full rounded-t-[6px] overflow-hidden" style={{ height: isInView ? `${(d.value / max) * 100}%` : '0%', background: colors[i % colors.length], transition: `height 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s` }} />
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Animated Pie Chart (CSS) ──────────────────────────────── */
function PieChart({ segments, size = 140 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
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
        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'white', width: size * 0.55, height: size * 0.55, margin: `${size * 0.225}px auto` }}>
          <span className="text-sm font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{total}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
            <span className="text-[11px] text-[var(--color-text-muted)]">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Stats Table ──────────────────────────────────────────── */
function StatsTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="table-container">
      <div className="px-4 py-3 border-b border-[var(--color-beige)]">
        <span className="text-[12px] font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</span>
      </div>
      <table className="table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="text-center text-[var(--color-text-muted)] py-6">No data available</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [recentCourses, setRecentCourses] = useState<Record<string, unknown>[]>([])
  const [recentGrades, setRecentGrades] = useState<Record<string, unknown>[]>([])
  const [recentAnnouncements, setRecentAnnouncements] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [courses, exams, assignments, notifications, grades, schedules, announcements] = await Promise.all([
          fetchTable('courses'), fetchTable('exams'), fetchTable('assignments'),
          fetchTable('notifications'), fetchTable('grades'), fetchTable('schedules'),
          fetchTable('announcements'),
        ])
        const gradeAvg = grades.length > 0
          ? grades.reduce((s: number, g: Record<string, unknown>) => s + ((g.score as number) || 0), 0) / grades.length : 0
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <span className="section-label">Dashboard</span>
        <h1 className="section-title mt-2 text-3xl">{greeting()}, {user.full_name}</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 capitalize">{user.role} Overview</p>
      </motion.div>

      {/* Stat Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-square rounded-[16px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <motion.div key={card.key} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="aspect-square rounded-[16px] p-5 flex flex-col items-center justify-center text-center text-white relative overflow-hidden cursor-default group hover:scale-[1.03] transition-transform duration-300 shadow-lg hover:shadow-xl"
              style={{ background: card.gradient }}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center mb-3 backdrop-blur-sm">
                <card.icon size={20} className="text-white" />
              </div>
              <div className="text-2xl font-extrabold mb-0.5 relative z-10" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <AnimatedCounter value={stats[card.key] || 0} suffix={card.key === 'grade' ? '%' : ''} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70 relative z-10">{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Donut Rings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 text-center">
          <span className="section-label">Completion</span>
          <div className="mt-4 flex items-center justify-center gap-4">
            <DonutRing value={stats.completed || 0} max={Math.max(stats.completed || 0, stats.assignments || 0, 1)} color="#3D8B60" size={100} label="Done" />
            <DonutRing value={stats.assignments || 0} max={Math.max(stats.completed || 0, stats.assignments || 0, 1)} color="#C49840" size={100} label="Pending" />
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-6">
          <span className="section-label text-center block">Activity</span>
          <div className="mt-4">
            <BarChart
              data={[
                { label: 'Courses', value: stats.subjects || 0 },
                { label: 'Exams', value: stats.exams || 0 },
                { label: 'Grades', value: stats.completed || 0 },
                { label: 'Notif.', value: Math.min(stats.notifications || 0, 20) },
                { label: 'Lectures', value: stats.lectures || 0 },
              ]}
              colors={['#1B3A5C', '#B8976A', '#3D8B60', '#C49840', '#2A5580']}
            />
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
          <span className="section-label text-center block">Distribution</span>
          <div className="mt-4">
            <PieChart segments={[
              { value: stats.subjects || 0, color: '#1B3A5C', label: 'Subjects' },
              { value: stats.exams || 0, color: '#B8976A', label: 'Exams' },
              { value: stats.assignments || 0, color: '#3D8B60', label: 'Assignments' },
              { value: stats.completed || 0, color: '#6B5CE7', label: 'Completed' },
            ]} />
          </div>
        </motion.div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <StatsTable
            title="Recent Courses"
            headers={['Course', 'Code', 'Credits']}
            rows={recentCourses.map(c => [String(c.title || '-'), String(c.course_code || '-'), String(c.credits || '-')])}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <StatsTable
            title="Latest Grades"
            headers={['Student', 'Score', 'Grade']}
            rows={recentGrades.map(g => [String(g.student_id || '-'), String(g.score ?? '-'), String(g.grade_letter || '-')])}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <StatsTable
            title="Announcements"
            headers={['Title', 'Priority', 'Date']}
            rows={recentAnnouncements.map(a => [String(a.title || '-'), String(a.priority || '-'), a.created_at ? new Date(a.created_at as string).toLocaleDateString() : '-'])}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card p-6 text-center flex flex-col items-center justify-center">
          <span className="section-label">Quick Stats</span>
          <div className="mt-4 space-y-3 w-full">
            {[
              { label: 'Total Courses', value: stats.subjects || 0, color: '#1B3A5C' },
              { label: 'Total Exams', value: stats.exams || 0, color: '#B8976A' },
              { label: 'Avg Grade', value: `${(stats.grade || 0).toFixed(1)}%`, color: '#3D8B60' },
              { label: 'Live Sessions', value: stats.sessions || 0, color: '#C44040' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-[var(--color-bg)]">
                <span className="text-[12px] text-[var(--color-text-muted)] font-medium">{item.label}</span>
                <span className="text-[13px] font-bold" style={{ color: item.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
