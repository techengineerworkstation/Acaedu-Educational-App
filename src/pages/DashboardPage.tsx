import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '../types'
import {
  BookOpen, FileText, Calendar, Bell, ClipboardList, CheckCircle,
  BarChart3, Video, ArrowRight, TrendingUp, Users, Award, Clock,
} from 'lucide-react'

/* ─── Animated counter ───────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const ctrl = animate(0, value, {
      duration: 1.0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      onUpdate(v) { node.textContent = suffix === '%' ? `${v.toFixed(1)}%` : Math.round(v).toString() },
    })
    return () => ctrl.stop()
  }, [inView, value, suffix])
  return <span ref={ref}>0</span>
}

/* ─── Progress bar ───────────────────────────────────────────── */
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-tertiary)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ background: 'var(--color-primary)' }}
      />
    </div>
  )
}

/* ─── Stat card metadata ─────────────────────────────────────── */
const statCards = [
  { key: 'courses',       label: 'Enrolled Subjects',  icon: BookOpen,       link: '/courses' },
  { key: 'exams',         label: 'Upcoming Exams',     icon: FileText,       link: '/exams' },
  { key: 'assignments',   label: 'Pending Tasks',      icon: ClipboardList,  link: '/assignments' },
  { key: 'notifications', label: 'Notifications',      icon: Bell,           link: '/notifications' },
  { key: 'completed',     label: 'Completed',          icon: CheckCircle,    link: '/grades' },
  { key: 'grade',         label: 'Avg Grade',          icon: BarChart3,      link: '/grades',      suffix: '%' },
  { key: 'sessions',      label: 'Live Sessions',      icon: Video,          link: '/live-classes' },
  { key: 'enrollments',   label: 'Enrollments',        icon: Users,          link: '/enrollments' },
]

/* ─── Course card ──────────────────────────────────────────── */
function CourseCard({ course, index }: { course: Record<string, unknown>; index: number }) {
  const progress = course._progress as number ?? Math.floor(Math.random() * 75) + 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/courses"
        className="flex flex-col gap-3 p-5 block transition-colors"
        style={{
          border: '1px solid var(--color-border-light)',
          borderRadius: '12px',
          background: 'var(--color-bg-card)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-light)')}>
        <div className="flex items-start justify-between gap-2">
          <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-primary-muted)' }}>
            <BookOpen size={15} style={{ color: 'var(--color-primary)' }} />
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
            }}>
            {course.credits as number || 3} cr
          </span>
        </div>
        <div>
          <div className="text-[13px] font-bold leading-snug"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
            {course.title as string}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {course.course_code as string}
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Progress</span>
            <span className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>{progress}%</span>
          </div>
          <ProgressBar value={progress} max={100} />
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Activity feed item ──────────────────────────────────── */
function ActivityItem({ icon: Icon, text, sub }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  text: string; sub: string
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 last:border-0"
      style={{ borderBottom: '1px solid var(--color-border-light)' }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'var(--color-bg-tertiary)' }}>
        <span style={{ color: 'var(--color-text-muted)' }}><Icon size={13} /></span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-snug font-medium truncate" style={{ color: 'var(--color-text)' }}>{text}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>
      </div>
    </div>
  )
}

/* ─── Main dashboard ─────────────────────────────────────────── */
export function DashboardPage({ user }: { user: User }) {
  const [stats, setStats]               = useState<Record<string, number>>({})
  const [courses, setCourses]           = useState<Record<string, unknown>[]>([])
  const [announcements, setAnnouncements] = useState<Record<string, unknown>[]>([])
  const [recentGrades, setRecentGrades] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [
          { data: coursesData },
          { data: examsData },
          { data: assignData },
          { data: notifData },
          { data: gradesData },
          { data: schedData },
          { data: announcData },
          { data: enrollData },
        ] = await Promise.all([
          supabase.from('courses').select('*').limit(6),
          supabase.from('exams').select('id').limit(100),
          supabase.from('assignments').select('id').limit(100),
          supabase.from('notifications').select('id').eq('read', false).limit(100),
          supabase.from('grades').select('*').limit(100),
          supabase.from('schedules').select('id').limit(100),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('enrollments').select('id').limit(100),
        ])

        const gradeAvg = gradesData && gradesData.length > 0
          ? gradesData.reduce((s: number, g: Record<string, unknown>) => s + ((g.score as number) || 0), 0) / gradesData.length
          : 0
        const completed = gradesData?.filter((g: Record<string, unknown>) => (g.score as number) >= 50).length || 0

        setStats({
          courses:       coursesData?.length  || 0,
          exams:         examsData?.length    || 0,
          assignments:   assignData?.length   || 0,
          notifications: notifData?.length    || 0,
          completed,
          grade:         gradeAvg,
          sessions:      schedData?.length    || 0,
          enrollments:   enrollData?.length   || 0,
        })
        setCourses(coursesData || [])
        setAnnouncements(announcData || [])
        setRecentGrades((gradesData || []).slice(0, 4))
      } catch (e) {
        console.warn('Dashboard load error:', e)
      }
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

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const hr = Math.floor(m / 60)
    if (hr < 24) return `${hr}h ago`
    return `${Math.floor(hr / 24)}d ago`
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Page header ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: 'var(--color-text-muted)' }}>
          Dashboard
        </span>
        <h1 className="text-[22px] font-bold"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
          {greeting()}, {user.full_name}
        </h1>
        <p className="text-[13px] mt-1 capitalize" style={{ color: 'var(--color-text-muted)' }}>
          {user.role} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[100px] rounded-[12px]"
              style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-light)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={card.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={card.link}
                className="flex flex-col gap-2.5 p-4 block transition-colors"
                style={{
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '12px',
                  background: 'var(--color-bg-card)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-light)')}>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ background: 'var(--color-bg-tertiary)' }}>
                  <card.icon size={15} style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold leading-none"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                    <AnimatedCounter value={stats[card.key] || 0} suffix={card.suffix || ''} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.07em] mt-1"
                    style={{ color: 'var(--color-text-muted)' }}>
                    {card.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Courses + Activity feed ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Course progress cards — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: 'var(--color-text-muted)' }}>
                In Progress
              </span>
              <h2 className="text-[15px] font-bold mt-0.5"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                Your Subjects
              </h2>
            </div>
            <Link to="/courses"
              className="flex items-center gap-1 text-[12px] font-medium transition-colors"
              style={{ color: 'var(--color-primary)' }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 rounded-[12px]"
                  style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-light)' }} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center"
              style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', background: 'var(--color-bg-card)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'var(--color-bg-tertiary)' }}>
                <BookOpen size={20} style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <p className="text-[13px] mb-3" style={{ color: 'var(--color-text-muted)' }}>No subjects yet</p>
              <Link to="/enrollments"
                className="px-4 py-2 text-[12px] font-medium rounded-lg transition-colors"
                style={{ background: 'var(--color-primary)', color: 'var(--color-bg-card)' }}>
                Browse Subjects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.slice(0, 4).map((c, i) => <CourseCard key={c.id as string} course={c} index={i} />)}
            </div>
          )}
        </div>

        {/* Activity / Announcements feed */}
        <div>
          <div className="mb-4">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--color-text-muted)' }}>
              Recent Activity
            </span>
            <h2 className="text-[15px] font-bold mt-0.5"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
              Announcements
            </h2>
          </div>
          <div className="p-4" style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', background: 'var(--color-bg-card)' }}>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg" style={{ background: 'var(--color-bg-tertiary)' }} />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2"
                  style={{ background: 'var(--color-bg-tertiary)' }}>
                  <Bell size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>No announcements yet</p>
              </div>
            ) : (
              <>
                {announcements.map(a => (
                  <ActivityItem key={a.id as string}
                    icon={Bell}
                    text={a.title as string}
                    sub={a.created_at ? timeAgo(a.created_at as string) : ''}
                  />
                ))}
                <Link to="/announcements"
                  className="flex items-center gap-1 text-[11px] font-semibold mt-3 hover:underline"
                  style={{ color: 'var(--color-primary)' }}>
                  View all <ArrowRight size={11} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Grades table + Quick links ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Grades */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: 'var(--color-text-muted)' }}>
                Performance
              </span>
              <h2 className="text-[15px] font-bold mt-0.5"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                Recent Grades
              </h2>
            </div>
            <Link to="/grades"
              className="flex items-center gap-1 text-[12px] font-medium transition-colors"
              style={{ color: 'var(--color-primary)' }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', background: 'var(--color-bg-card)', overflow: 'hidden' }}>
            <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-[0.06em]"
                    style={{ color: 'var(--color-text-muted)' }}>Student</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-[0.06em]"
                    style={{ color: 'var(--color-text-muted)' }}>Score</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-[0.06em]"
                    style={{ color: 'var(--color-text-muted)' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="py-8 text-center">
                    <div className="h-4 w-28 mx-auto rounded" style={{ background: 'var(--color-bg-tertiary)' }} />
                  </td></tr>
                ) : recentGrades.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-[13px]"
                    style={{ color: 'var(--color-text-muted)' }}>
                    No grades recorded yet
                  </td></tr>
                ) : recentGrades.map((g, i) => (
                  <tr key={i}
                    style={{
                      borderBottom: i < recentGrades.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                      background: i % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)',
                    }}>
                    <td className="px-4 py-2.5 max-w-[100px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(g.student_id || '—').slice(0, 8)}…
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold w-8 text-right flex-shrink-0"
                          style={{ color: 'var(--color-text)' }}>
                          {String(g.score ?? '—')}
                        </span>
                        <ProgressBar value={Number(g.score) || 0} max={100} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{
                          background: g.grade_letter === 'A' ? 'color-mix(in srgb, #16a34a 12%, transparent)'
                            : g.grade_letter === 'B' ? 'var(--color-primary-muted)'
                            : g.grade_letter === 'F' ? 'color-mix(in srgb, var(--color-danger) 12%, transparent)'
                            : 'var(--color-bg-tertiary)',
                          color: g.grade_letter === 'A' ? '#16a34a'
                            : g.grade_letter === 'B' ? 'var(--color-primary)'
                            : g.grade_letter === 'F' ? 'var(--color-danger)'
                            : 'var(--color-text-muted)',
                        }}>
                        {String(g.grade_letter || '—')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="mb-4">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--color-text-muted)' }}>
              Quick Access
            </span>
            <h2 className="text-[15px] font-bold mt-0.5"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
              Academic Tools
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Schedule',      icon: Calendar,      to: '/schedule' },
              { label: 'Assignments',   icon: ClipboardList, to: '/assignments' },
              { label: 'Attendance',    icon: CheckCircle,   to: '/attendance' },
              { label: 'AI Scheduler',  icon: TrendingUp,    to: '/ai-scheduler' },
              { label: 'Events',        icon: Award,         to: '/events' },
              { label: 'Materials',     icon: Clock,         to: '/course-materials' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.25 }}
              >
                <Link to={item.to}
                  className="flex items-center gap-3 p-3.5 block transition-colors"
                  style={{
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '12px',
                    background: 'var(--color-bg-card)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-light)')}>
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-bg-tertiary)' }}>
                    <item.icon size={15} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
