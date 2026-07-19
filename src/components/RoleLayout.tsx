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
  ChevronRight, Sparkles,
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
  { to: '/ai-summaries',        icon: Brain,         label: 'AI Summaries',        group: 'ai' },
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
  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.04 } },
}
const itemVariants = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

function getBreadcrumb(pathname: string): string {
  const seg = pathname.replace('/', '')
  if (!seg) return 'Dashboard'
  return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  midnight: <Sparkles size={16} />,
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

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-[var(--color-secondary)]/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-[248px] z-50 flex flex-col
        bg-[var(--color-bg-card)] border-r border-[var(--color-border-light)]
        lg:shadow-none shadow-[var(--shadow-xl)]
        transition-transform duration-300 ease-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Brand */}
        <div className="h-[56px] flex items-center gap-2.5 px-4 border-b border-[var(--color-border-light)] flex-shrink-0">
          <motion.div
            whileHover={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 0.4 }}
            className="w-7 h-7 rounded-[9px] bg-[var(--color-primary)] flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-[11px]"
              style={{ fontFamily: 'var(--font-display)' }}>A</span>
          </motion.div>
          <span className="text-[14px] font-bold text-[var(--color-navy)] tracking-tight flex-1"
            style={{ fontFamily: 'var(--font-display)' }}>
            Acaedu
          </span>
          <span className="badge badge-navy capitalize">{user.role}</span>
          <button
            className="lg:hidden ml-1 p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <motion.nav
          className="flex-1 overflow-y-auto py-2 px-2"
          initial="hidden" animate="visible" variants={sidebarVariants}>
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group} className="mb-0.5">
              {groupLabels[group] && (
                <motion.div variants={itemVariants}
                  className="px-3 pt-3.5 pb-1 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.11em]">
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
                        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-[var(--color-primary)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Link
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)]
                        text-[13px] font-medium transition-all duration-150 mb-0.5 ml-1
                        ${active
                          ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-navy)] hover:bg-[var(--color-bg-hover)]'
                        }
                      `}>
                      <item.icon size={15}
                        className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {active && (
                        <ChevronRight size={12} className="text-[var(--color-primary)] opacity-50 flex-shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.nav>

        {/* User footer */}
        <div className="border-t border-[var(--color-border-light)] p-2.5 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors group cursor-default">
            <div className="avatar w-7 h-7 text-[10px] flex-shrink-0">{user.full_name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[var(--color-navy)] truncate">{user.full_name}</div>
              <div className="text-[10px] text-[var(--color-text-muted)] capitalize">{user.role}</div>
            </div>
            <button onClick={handleLogout}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              title="Sign out">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-[248px] min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-[56px] glass flex items-center justify-between px-5 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar">
              <Menu size={18} className="text-[var(--color-text-muted)]" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
              <span className="text-[var(--color-text-muted)] font-medium">Acaedu</span>
              <span className="text-[var(--color-border-strong)] mx-0.5">/</span>
              <motion.span
                key={breadcrumb}
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-[var(--color-navy)]">
                {breadcrumb}
              </motion.span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[var(--color-border)] text-[var(--color-text-muted)]"
              style={{ borderColor: availablePresets[academicPreset]?.color + '40', color: availablePresets[academicPreset]?.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: availablePresets[academicPreset]?.color }} />
              {availablePresets[academicPreset]?.label}
            </span>
            <button onClick={cycle}
              className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]"
              aria-label="Toggle theme"
              title={`Current: ${theme}`}>
              {themeIcons[theme]}
            </button>
            <button onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-[12px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-colors">
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
            <button onClick={handleLogout}
              className="sm:hidden p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-danger)]/8 transition-colors text-[var(--color-danger)]">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 p-5 max-w-7xl mx-auto w-full">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
