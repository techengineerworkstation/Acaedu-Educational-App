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
    <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-[var(--color-primary)]"
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
        className="card p-5 flex flex-col gap-3 block"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[var(--color-navy-pale)]">
            <BookOpen size={15} className="text-[var(--color-primary)]" />
          </div>
          <span className="badge badge-navy">{course.credits as number || 3} cr</span>
        </div>
        <div>
          <div className="text-[13px] font-bold text-[var(--color-navy)] leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}>
            {course.title as string}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            {course.course_code as string}
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-[var(--color-text-muted)]">Progress</span>
            <span className="text-[10px] font-bold text-[var(--color-primary)]">{progress}%</span>
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
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--color-border-light)] last:border-0">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[var(--color-bg-tertiary)]">
        <Icon size={13} className="text-[var(--color-text-muted)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-[var(--color-text)] leading-snug font-medium truncate">{text}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{sub}</p>
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
    <div className="max-w-5xl mx-auto">

      {/* ── Page header ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <span className="section-label">Dashboard</span>
        <h1 className="text-display-sm mt-2 text-[var(--color-navy)]">{greeting()}, {user.full_name}</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1 capitalize">
          {user.role} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[100px] rounded-[var(--radius-lg)]" />)}
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
                className="card p-4 flex flex-col gap-2.5 block"
              >
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[var(--color-bg-tertiary)]">
                  <card.icon size={15} className="text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[var(--color-navy)] leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    <AnimatedCounter value={stats[card.key] || 0} suffix={card.suffix || ''} />
                  </div>
                  <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.07em] mt-1">
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

        {/* Course progress cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="section-label">In Progress</span>
              <h2 className="text-[15px] font-bold text-[var(--color-navy)] mt-0.5"
                style={{ fontFamily: 'var(--font-display)' }}>Your Subjects</h2>
            </div>
            <Link to="/courses" className="btn-ghost text-[12px] flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-36 rounded-[var(--radius-lg)]" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state card py-12">
              <div className="empty-state-icon"><BookOpen size={20} /></div>
              <p className="text-[13px] text-[var(--color-text-muted)] mb-3">No subjects yet</p>
              <Link to="/enrollments" className="btn-primary text-[12px] px-4 py-2">Browse Subjects</Link>
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
            <span className="section-label">Recent Activity</span>
            <h2 className="text-[15px] font-bold text-[var(--color-navy)] mt-0.5"
              style={{ fontFamily: 'var(--font-display)' }}>Announcements</h2>
          </div>
          <div className="card p-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-[var(--radius-md)]" />)}
              </div>
            ) : announcements.length === 0 ? (
              <div className="empty-state py-8">
                <div className="empty-state-icon"><Bell size={18} /></div>
                <p className="text-[12px] text-[var(--color-text-muted)]">No announcements yet</p>
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
                  className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)] mt-3 hover:underline">
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
              <span className="section-label">Performance</span>
              <h2 className="text-[15px] font-bold text-[var(--color-navy)] mt-0.5"
                style={{ fontFamily: 'var(--font-display)' }}>Recent Grades</h2>
            </div>
            <Link to="/grades" className="btn-ghost text-[12px] flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Student</th><th>Score</th><th>Grade</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="py-8 text-center">
                    <div className="skeleton h-4 w-28 mx-auto rounded" />
                  </td></tr>
                ) : recentGrades.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-[var(--color-text-muted)] py-8 text-[13px]">
                    No grades recorded yet
                  </td></tr>
                ) : recentGrades.map((g, i) => (
                  <tr key={i}>
                    <td className="text-[var(--color-text-secondary)] max-w-[100px] truncate">
                      {String(g.student_id || '—').slice(0, 8)}…
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[var(--color-navy)] w-8 text-right flex-shrink-0">
                          {String(g.score ?? '—')}
                        </span>
                        <ProgressBar value={Number(g.score) || 0} max={100} />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        g.grade_letter === 'A' ? 'badge-success'
                        : g.grade_letter === 'B' ? 'badge-navy'
                        : g.grade_letter === 'F' ? 'badge-danger'
                        : 'badge-neutral'
                      }`}>{String(g.grade_letter || '—')}</span>
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
            <span className="section-label">Quick Access</span>
            <h2 className="text-[15px] font-bold text-[var(--color-navy)] mt-0.5"
              style={{ fontFamily: 'var(--font-display)' }}>Academic Tools</h2>
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
                  className="card p-3.5 flex items-center gap-3 block"
                >
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[var(--color-bg-tertiary)]">
                    <item.icon size={15} className="text-[var(--color-text-muted)]" />
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--color-navy)]">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
