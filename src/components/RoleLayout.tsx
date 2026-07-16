import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from '../lib/supabase'
import type { User } from '../types'
import {
  Home, BookOpen, Calendar, Video, CheckSquare, Megaphone, FileText,
  ClipboardList, GraduationCap, Upload, MapPin, Bell, User as UserIcon,
  Settings, LogOut, Menu, Moon, Sun, Users, CreditCard,
  Brain, Search, Building2, GitBranch, Shield, Mail, Clock, CalendarOff, X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem { to: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string; group: string }

const allNav: NavItem[] = [
  { to: '/dashboard',          icon: Home,         label: 'Dashboard',          group: 'main' },
  { to: '/courses',            icon: BookOpen,     label: 'Courses',            group: 'academics' },
  { to: '/enrollments',        icon: GraduationCap,label: 'Enrollments',        group: 'academics' },
  { to: '/schedule',           icon: Calendar,     label: 'Schedules',          group: 'academics' },
  { to: '/schedule-instances', icon: Clock,        label: 'Schedule Instances', group: 'academics' },
  { to: '/attendance',         icon: CheckSquare,  label: 'Attendance',         group: 'academics' },
  { to: '/holidays',           icon: CalendarOff,  label: 'Holidays',           group: 'academics' },
  { to: '/exams',              icon: FileText,     label: 'Exams',              group: 'assessments' },
  { to: '/tests',              icon: ClipboardList,label: 'Tests',              group: 'assessments' },
  { to: '/assignments',        icon: ClipboardList,label: 'Assignments',        group: 'assessments' },
  { to: '/grades',             icon: GraduationCap,label: 'Grades',             group: 'assessments' },
  { to: '/announcements',      icon: Megaphone,    label: 'Announcements',      group: 'communication' },
  { to: '/notifications',      icon: Bell,         label: 'Notifications',      group: 'communication' },
  { to: '/videos',             icon: Video,        label: 'Videos',             group: 'communication' },
  { to: '/course-materials',   icon: Upload,       label: 'Materials',          group: 'communication' },
  { to: '/events',             icon: Calendar,     label: 'Events',             group: 'communication' },
  { to: '/venues',             icon: MapPin,       label: 'Venues',             group: 'communication' },
  { to: '/live-classes',       icon: Video,        label: 'Live Classes',       group: 'communication' },
  { to: '/class-records',      icon: Video,        label: 'Class Records',      group: 'communication' },
  { to: '/ai-scheduler',       icon: Brain,        label: 'AI Scheduler',       group: 'ai' },
  { to: '/ai-summaries',       icon: Brain,        label: 'AI Summaries',       group: 'ai' },
  { to: '/users',              icon: Users,        label: 'Users',              group: 'admin' },
  { to: '/departments',        icon: Building2,    label: 'Departments',        group: 'admin' },
  { to: '/faculties',          icon: GitBranch,    label: 'Faculties',          group: 'admin' },
  { to: '/institutions',       icon: Building2,    label: 'Institutions',       group: 'admin' },
  { to: '/billing',            icon: CreditCard,   label: 'Billing',            group: 'finance' },
  { to: '/payments',           icon: CreditCard,   label: 'Payments',           group: 'finance' },
  { to: '/feature-access',     icon: Shield,       label: 'Feature Access',     group: 'system' },
  { to: '/email-verifications',icon: Mail,         label: 'Email Verifications',group: 'system' },
  { to: '/search-queries',     icon: Search,       label: 'Search Queries',     group: 'system' },
  { to: '/profile',            icon: UserIcon,     label: 'Profile',            group: 'account' },
  { to: '/settings',           icon: Settings,     label: 'Settings',           group: 'account' },
]

const groupLabels: Record<string, string> = {
  main: '', academics: 'Academics', assessments: 'Assessments',
  communication: 'Communication', ai: 'AI Tools', admin: 'Administration',
  finance: 'Finance', system: 'System', account: 'Account',
}

const adminOnlyGroups = ['admin', 'finance', 'system']

const sidebarVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}
const navItemVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

function getBreadcrumb(pathname: string): string {
  const seg = pathname.replace('/', '')
  if (!seg) return 'Dashboard'
  return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function RoleLayout({ user, children }: { user: User; children: React.ReactNode }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') { document.documentElement.classList.add('dark'); return true }
    }
    return false
  })

  const visibleNav = user.role === 'admin' ? allNav : allNav.filter(i => !adminOnlyGroups.includes(i.group))
  const groupedNav = visibleNav.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(d => { localStorage.setItem('theme', !d ? 'dark' : 'light'); return !d })
  }

  const handleLogout = async () => { await signOut(); navigate('/login') }

  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[var(--color-navy-dark)]/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col
        bg-[var(--color-bg-card)] border-r border-[var(--color-border)]
        shadow-[var(--shadow-xl)] lg:shadow-none
        transition-transform duration-300 ease-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Brand header */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--color-border)] flex-shrink-0 relative">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'var(--font-display)' }}>A</span>
          </div>
          <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight flex-1"
            style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          <span className="badge badge-navy text-[9px] uppercase">{user.role}</span>
          <button className="lg:hidden ml-1 p-1 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
            onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <motion.nav
          className="flex-1 overflow-y-auto py-3 px-3"
          initial="hidden" animate="visible" variants={sidebarVariants}
        >
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group} className="mb-1">
              {groupLabels[group] && (
                <motion.div variants={navItemVariants}
                  className="px-3 pt-4 pb-1.5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.12em]">
                  {groupLabels[group]}
                </motion.div>
              )}
              {items.map(item => {
                const active = location.pathname === item.to
                return (
                  <motion.div key={item.to} variants={navItemVariants} className="relative">
                    {/* Animated active indicator bar */}
                    {active && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-0.5 bottom-0.5 w-[3px] rounded-full bg-[var(--color-primary)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Link
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-all duration-150 mb-0.5 ml-0.5 ${
                        active
                          ? 'bg-[var(--color-primary)]/8 text-[var(--color-primary)] font-semibold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-navy)] hover:bg-[var(--color-navy)]/5'
                      }`}
                    >
                      <item.icon size={16} className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.nav>

        {/* User footer */}
        <div className="border-t border-[var(--color-border)] p-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-[10px] hover:bg-[var(--color-bg-secondary)] transition-colors group">
            <div className="avatar w-8 h-8 text-[11px] flex-shrink-0">{user.full_name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[var(--color-navy)] truncate">{user.full_name}</div>
              <div className="text-[10px] text-[var(--color-text-muted)] capitalize">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              title="Logout">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 glass flex items-center justify-between px-5 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-navy)]/5 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-[var(--color-text-muted)]"/>
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <span className="text-[var(--color-text-muted)] font-medium">Acaedu</span>
              <span className="text-[var(--color-border)]">/</span>
              <motion.span
                key={breadcrumb}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-semibold text-[var(--color-navy)]">
                {breadcrumb}
              </motion.span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-[var(--color-navy)]/5 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]"
              title="Toggle theme">
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-colors"
              title="Logout">
              <LogOut size={14}/>
              <span>Logout</span>
            </button>
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 rounded-lg hover:bg-[var(--color-danger)]/8 transition-colors text-[var(--color-danger)]"
              title="Logout">
              <LogOut size={17}/>
            </button>
          </div>
        </header>

        {/* Page content with entry animation */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
