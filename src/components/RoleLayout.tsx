import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import type { User } from '../types'
import {
  Home, BookOpen, Calendar, Video, CheckSquare, Megaphone, FileText,
  ClipboardList, GraduationCap, Upload, MapPin, Bell, User as UserIcon,
  Settings, LogOut, Menu, Moon, Sun, Users, CreditCard,
  Brain, Search, Building2, GitBranch, Shield, Mail, Clock, CalendarOff, X,
  ChevronRight, Palette, Sparkles,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  group: string
}

const allNav: NavItem[] = [
  { to: '/dashboard',           icon: Home,          label: 'Dashboard',           group: 'main' },
  { to: '/courses',             icon: BookOpen,      label: 'Subjects',             group: 'academics' },
  { to: '/enrollments',         icon: GraduationCap, label: 'Enrollments',         group: 'academics' },
  { to: '/schedule',            icon: Calendar,      label: 'Schedules',           group: 'academics' },
  { to: '/schedule-instances',  icon: Clock,         label: 'Schedule Instances',  group: 'academics' },
  { to: '/attendance',          icon: CheckSquare,   label: 'Attendance',          group: 'academics' },
  { to: '/holidays',            icon: CalendarOff,   label: 'Holidays',            group: 'academics' },
  { to: '/exams',               icon: FileText,      label: 'Exams',               group: 'assessments' },
  { to: '/tests',               icon: ClipboardList, label: 'Tests',               group: 'assessments' },
  { to: '/assignments',         icon: ClipboardList, label: 'Assignments',         group: 'assessments' },
  { to: '/grades',              icon: GraduationCap, label: 'Grades',              group: 'assessments' },
  { to: '/announcements',       icon: Megaphone,     label: 'Announcements',       group: 'communication' },
  { to: '/notifications',       icon: Bell,          label: 'Notifications',       group: 'communication' },
  { to: '/videos',              icon: Video,         label: 'Videos',              group: 'communication' },
  { to: '/course-materials',    icon: Upload,        label: 'Materials',           group: 'communication' },
  { to: '/events',              icon: Calendar,      label: 'Events',              group: 'communication' },
  { to: '/venues',              icon: MapPin,        label: 'Venues',              group: 'communication' },
  { to: '/live-classes',        icon: Video,         label: 'Live Classes',        group: 'communication' },
  { to: '/class-records',       icon: Video,         label: 'Class Records',       group: 'communication' },
  { to: '/ai-scheduler',        icon: Brain,         label: 'AI Scheduler',        group: 'ai' },
  { to: '/ai-summaries',        icon: Sparkles,      label: 'AI Summaries',        group: 'ai' },
  { to: '/ai-advisor',          icon: Brain,         label: 'AI Advisor',          group: 'ai' },
  { to: '/users',               icon: Users,         label: 'Users',               group: 'admin' },
  { to: '/departments',         icon: Building2,     label: 'Departments',         group: 'admin' },
  { to: '/faculties',           icon: GitBranch,     label: 'Faculties',           group: 'admin' },
  { to: '/institutions',        icon: Building2,     label: 'Institutions',        group: 'admin' },
  { to: '/billing',             icon: CreditCard,    label: 'Billing',             group: 'finance' },
  { to: '/payments',            icon: CreditCard,    label: 'Payments',            group: 'finance' },
  { to: '/feature-access',      icon: Shield,        label: 'Feature Access',      group: 'system' },
  { to: '/email-verifications', icon: Mail,          label: 'Email Verifications', group: 'system' },
  { to: '/search-queries',      icon: Search,        label: 'Search Queries',      group: 'system' },
  { to: '/profile',             icon: UserIcon,      label: 'Profile',             group: 'account' },
  { to: '/settings',            icon: Settings,      label: 'Settings',            group: 'account' },
]

const groupLabels: Record<string, string> = {
  main: '', academics: 'Academics', assessments: 'Assessments',
  communication: 'Communication', ai: 'AI Tools', admin: 'Administration',
  finance: 'Finance', system: 'System', account: 'Account',
}

const adminOnlyGroups = ['admin', 'finance', 'system']

const sidebarVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.025, delayChildren: 0.03 } },
}
const itemVariants = {
  hidden:  { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

function getBreadcrumb(pathname: string): string {
  const seg = pathname.replace('/', '')
  if (!seg) return 'Dashboard'
  return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  midnight: <Palette size={16} />,
}

export function RoleLayout({ user, children }: { user: User; children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, cycle, academicPreset, availablePresets } = useTheme()

  const visibleNav = user.role === 'admin'
    ? allNav
    : allNav.filter(i => !adminOnlyGroups.includes(i.group))

  const groupedNav = visibleNav.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  const handleLogout = async () => { await signOut(); navigate('/login') }
  const breadcrumb = getBreadcrumb(location.pathname)

  const groupOrder = ['main', 'academics', 'assessments', 'communication', 'ai', 'admin', 'finance', 'system', 'account']
  const orderedGroups = groupOrder.filter(g => groupedNav[g])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col
        transition-transform duration-300 ease-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{
          background: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border-light)',
        }}
      >

        {/* Brand */}
        <div className="h-[56px] flex items-center gap-2.5 px-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <img src="/favicon.svg" alt="Acaedu" className="w-7 h-7" />
          <span className="text-[15px] font-bold tracking-tight flex-1"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
            Acaedu
          </span>
          <button
            className="lg:hidden p-1 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}
            onClick={() => setSidebarOpen(false)}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            aria-label="Close sidebar">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <motion.nav
          className="flex-1 overflow-y-auto py-2 px-2"
          initial="hidden" animate="visible" variants={sidebarVariants}>
          {orderedGroups.map((group, gi) => {
            const items = groupedNav[group]
            return (
              <div key={group}>
                {gi > 0 && (
                  <div className="mx-3 my-2" style={{ borderTop: '1px solid var(--color-border-light)' }} />
                )}
                {groupLabels[group] && (
                  <motion.div variants={itemVariants}
                    className="px-3 pt-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
                    {groupLabels[group]}
                  </motion.div>
                )}
                {items.map(item => {
                  const active = location.pathname === item.to
                  return (
                    <motion.div key={item.to} variants={itemVariants} className="relative">
                      {active && (
                        <motion.div
                          layoutId="nav-active-bar"
                          className="absolute left-0 top-[5px] bottom-[5px] w-[3px] rounded-r-full"
                          style={{ background: 'var(--color-primary)' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-[7px] text-[13px] font-medium transition-colors duration-150"
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          background: active ? 'var(--color-primary-muted)' : 'transparent',
                          fontWeight: active ? 600 : 500,
                          paddingLeft: active ? '14px' : '12px',
                        }}
                        onMouseEnter={e => {
                          if (!active) {
                            e.currentTarget.style.color = 'var(--color-text)'
                            e.currentTarget.style.background = 'var(--color-bg-hover)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        <span style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                          <item.icon size={17} className="flex-shrink-0" />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {active && (
                          <ChevronRight size={13} className="flex-shrink-0 opacity-40"
                            style={{ color: 'var(--color-primary)' }} />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </motion.nav>

        {/* User footer */}
        <div className="flex-shrink-0" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <div className="p-3">
            <div className="flex items-center gap-2.5 px-2 py-2 transition-colors group cursor-default"
              style={{ borderRadius: 'var(--radius-sm)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
                {user.full_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                  {user.full_name}
                </div>
                <div className="text-[11px] capitalize" style={{ color: 'var(--color-text-muted)' }}>
                  {user.role}
                </div>
              </div>
              <button onClick={handleLogout}
                className="p-1.5 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                style={{ borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--color-danger) 10%, transparent)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                title="Sign out">
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-[56px] relative px-5"
          style={{
            background: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border-light)',
          }}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-1.5 transition-colors"
                style={{ borderRadius: 'var(--radius-sm)' }}
                onClick={() => setSidebarOpen(true)}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                aria-label="Open sidebar">
                <Menu size={20} style={{ color: 'var(--color-text)' }} />
              </button>
            </div>

            {/* Center breadcrumb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="hidden sm:flex items-center gap-1.5 text-[13px]" style={{ textAlign: 'center' }}>
                <span className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Acaedu</span>
                <span className="mx-0.5" style={{ color: 'var(--color-border-strong)' }}>/</span>
                <motion.span
                  key={breadcrumb}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-semibold"
                  style={{ color: 'var(--color-text)' }}>
                  {breadcrumb}
                </motion.span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: availablePresets[academicPreset]?.color,
                  border: `1px solid ${availablePresets[academicPreset]?.color}40`,
                }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: availablePresets[academicPreset]?.color }} />
                {availablePresets[academicPreset]?.label}
              </span>
              <button onClick={cycle}
                className="p-2 transition-colors"
                style={{ borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                aria-label="Toggle theme"
                title={`Current: ${theme}`}>
                {themeIcons[theme]}
              </button>
              <button onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors"
                style={{ borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--color-danger) 10%, transparent)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
              <button onClick={handleLogout}
                className="sm:hidden p-2 transition-colors"
                style={{ borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--color-danger) 10%, transparent)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 p-5 max-w-7xl mx-auto w-full">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
