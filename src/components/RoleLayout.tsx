import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signOut } from '../lib/supabase'
import type { User } from '../types'
import {
  Home, BookOpen, Calendar, Video, CheckSquare, Megaphone, FileText,
  ClipboardList, GraduationCap, Upload, MapPin, Bell, User as UserIcon,
  Settings, LogOut, Menu, Moon, Sun, Users, CreditCard,
  Brain, Search, Building2, GitBranch, Shield, Mail, Clock, CalendarOff
} from 'lucide-react'
import { useState } from 'react'

interface NavItem { to: string; icon: React.ComponentType<{ size?: number }>; label: string; group: string }

const allNav: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard', group: 'main' },

  { to: '/courses', icon: BookOpen, label: 'Courses', group: 'academics' },
  { to: '/enrollments', icon: GraduationCap, label: 'Enrollments', group: 'academics' },
  { to: '/schedule', icon: Calendar, label: 'Schedules', group: 'academics' },
  { to: '/schedule-instances', icon: Clock, label: 'Schedule Instances', group: 'academics' },
  { to: '/attendance', icon: CheckSquare, label: 'Attendance', group: 'academics' },
  { to: '/holidays', icon: CalendarOff, label: 'Holidays', group: 'academics' },

  { to: '/exams', icon: FileText, label: 'Exams', group: 'assessments' },
  { to: '/tests', icon: ClipboardList, label: 'Tests', group: 'assessments' },
  { to: '/assignments', icon: ClipboardList, label: 'Assignments', group: 'assessments' },
  { to: '/grades', icon: GraduationCap, label: 'Grades', group: 'assessments' },

  { to: '/announcements', icon: Megaphone, label: 'Announcements', group: 'communication' },
  { to: '/notifications', icon: Bell, label: 'Notifications', group: 'communication' },
  { to: '/videos', icon: Video, label: 'Videos', group: 'communication' },
  { to: '/course-materials', icon: Upload, label: 'Materials', group: 'communication' },
  { to: '/events', icon: Calendar, label: 'Events', group: 'communication' },
  { to: '/venues', icon: MapPin, label: 'Venues', group: 'communication' },
  { to: '/live-classes', icon: Video, label: 'Live Classes', group: 'communication' },
  { to: '/class-records', icon: Video, label: 'Class Records', group: 'communication' },

  { to: '/ai-scheduler', icon: Brain, label: 'AI Scheduler', group: 'ai' },
  { to: '/ai-summaries', icon: Brain, label: 'AI Summaries', group: 'ai' },

  { to: '/users', icon: Users, label: 'Users', group: 'admin' },
  { to: '/departments', icon: Building2, label: 'Departments', group: 'admin' },
  { to: '/faculties', icon: GitBranch, label: 'Faculties', group: 'admin' },
  { to: '/institutions', icon: Building2, label: 'Institutions', group: 'admin' },

  { to: '/billing', icon: CreditCard, label: 'Billing', group: 'finance' },
  { to: '/payments', icon: CreditCard, label: 'Payments', group: 'finance' },

  { to: '/feature-access', icon: Shield, label: 'Feature Access', group: 'system' },
  { to: '/email-verifications', icon: Mail, label: 'Email Verifications', group: 'system' },
  { to: '/search-queries', icon: Search, label: 'Search Queries', group: 'system' },

  { to: '/profile', icon: UserIcon, label: 'Profile', group: 'account' },
  { to: '/settings', icon: Settings, label: 'Settings', group: 'account' },
]

const groupLabels: Record<string, string> = {
  main: '',
  academics: 'Academics',
  assessments: 'Assessments',
  communication: 'Communication',
  ai: 'AI Tools',
  admin: 'Administration',
  finance: 'Finance',
  system: 'System',
  account: 'Account',
}

const adminOnlyGroups = ['admin', 'finance', 'system']

export function RoleLayout({ user, children }: { user: User; children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
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
    setDark(!dark)
    localStorage.setItem('theme', dark ? 'light' : 'dark')
  }

  const handleLogout = async () => { await signOut(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-[var(--color-navy-dark)]/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col bg-white border-r border-[var(--color-beige)] transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        initial={false}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-center gap-2.5 px-5 border-b border-[var(--color-beige)]/60 flex-shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A</span>
          </div>
          <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Acaedu</span>
          <span className="ml-auto badge badge-navy text-[9px] uppercase">{user.role}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group} className="mb-1">
              {groupLabels[group] && (
                <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">{groupLabels[group]}</div>
              )}
              {items.map(item => {
                const active = location.pathname === item.to
                return (
                  <Link key={item.to} to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-150 mb-0.5 ${
                      active
                        ? 'bg-[var(--color-navy)]/10 text-[var(--color-navy)] font-bold shadow-sm border border-[var(--color-navy)]/8'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-navy)] hover:bg-[var(--color-navy)]/5 border border-transparent'
                    }`}
                    onClick={() => setSidebarOpen(false)}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--color-beige)] p-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="avatar w-8 h-8 text-[11px] flex-shrink-0">{user.full_name[0]}</div>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-[12px] font-semibold text-[var(--color-navy)] truncate">{user.full_name}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{user.role}</div>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-colors flex-shrink-0" title="Logout">
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 glass border-b border-[var(--color-beige)]/60 flex items-center justify-between px-5">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-navy)]/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-[var(--color-text-muted)]"/>
          </button>
          <div />
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-[var(--color-navy)]/5 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]" title="Toggle theme">
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <button onClick={handleLogout} className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-danger)]/8 transition-colors text-[var(--color-danger)]" title="Logout">
              <LogOut size={17}/>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
