import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signOut } from '../lib/supabase'
import type { User } from '../types'
import { Home, BookOpen, FileText, GraduationCap, ClipboardList, Bell, MapPin, Calendar, Settings, LogOut, Menu, Moon, Sun, Users, BarChart3, Megaphone, CheckSquare } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavItem { to: string; icon: any; label: string }

const studentNav: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/courses', icon: BookOpen, label: 'Subjects' },
  { to: '/exams', icon: FileText, label: 'Exams' },
  { to: '/grades', icon: GraduationCap, label: 'Grades' },
  { to: '/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/venues', icon: MapPin, label: 'Venues' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const lecturerNav: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/courses', icon: BookOpen, label: 'My Subjects' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/exams', icon: FileText, label: 'Exams' },
  { to: '/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/attendance', icon: CheckSquare, label: 'Attendance' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/venues', icon: MapPin, label: 'Venues' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const adminNav: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/courses', icon: BookOpen, label: 'Subjects' },
  { to: '/departments', icon: BarChart3, label: 'Departments' },
  { to: '/exams', icon: FileText, label: 'Exams' },
  { to: '/billing', icon: BarChart3, label: 'Billing' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function RoleLayout({ user, children }: { user: User; children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const navItems = user.role === 'admin' ? adminNav : user.role === 'lecturer' ? lecturerNav : studentNav

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(!dark)
    localStorage.setItem('theme', dark ? 'light' : 'dark')
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') document.documentElement.classList.add('dark')
    setDark(saved === 'dark')
  }, [])

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-[250px] z-50 flex flex-col py-6 px-3 border-r border-border bg-bg-card/90 backdrop-blur-md transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: -250 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3 mb-8 px-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background:'var(--gradient-primary)'}}>A</div>
          <span className="text-lg font-bold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Acaedu</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono uppercase">{user.role}</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all glow-hover ${active ? 'bg-primary/10 text-primary font-semibold border-l-3 border-primary' : 'text-text-muted hover:text-text hover:bg-primary/5'}`}
                onClick={() => setSidebarOpen(false)}>
                <item.icon size={18}/><span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border pt-4 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{user.full_name[0]}</div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{user.full_name}</div>
              <div className="text-[10px] text-text-muted">{user.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition" title="Logout"><LogOut size={16}/></button>
        </div>
      </motion.aside>

      <main className="flex-1 lg:ml-[250px] min-h-screen">
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-bg-card/80 backdrop-blur-md border-b border-border">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22}/></button>
          <div/>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-primary/10 transition" title="Toggle theme">
              {dark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={handleLogout} className="lg:hidden p-2 rounded-lg hover:bg-danger/10 transition text-danger" title="Logout">
              <LogOut size={18}/>
            </button>
          </div>
        </div>
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
