import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { RoleLayout } from './components/RoleLayout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { CoursesPage } from './pages/CoursesPage'
import { ExamsPage, GradesPage, AssignmentsPage, NotificationsPage, VenuesPage, EventsPage, SchedulePage, SettingsPage } from './pages/CrudPages'
import { AttendancePage } from './pages/AttendancePage'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
import { LectureVideosPage, MaterialsPage } from './pages/ContentPages'
import { AdminDashboard, UserManagementPage, PopulationCensusPage } from './pages/AdminPages'
import { TermsPage, PrivacyPage, ContactPage } from './pages/StaticPages'
import { FractalBackground } from './components/FractalBackground'
import type { User } from './types'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role: session.user.user_metadata?.role || 'student',
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        })
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role: session.user.user_metadata?.role || 'student',
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/></div>

  return (
    <BrowserRouter>
      <FractalBackground />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard"/> : <LandingPage/>} />
        <Route path="/login" element={user ? <Navigate to="/dashboard"/> : <LoginPage/>} />
        <Route path="/register" element={user ? <Navigate to="/dashboard"/> : <RegisterPage/>} />
        <Route path="/terms" element={<TermsPage/>} />
        <Route path="/privacy" element={<PrivacyPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/dashboard" element={user ? <RoleLayout user={user}><DashboardPage user={user}/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/admin" element={user?.role === 'admin' ? <RoleLayout user={user}><AdminDashboard/></RoleLayout> : <Navigate to="/dashboard"/>} />
        <Route path="/users" element={user?.role === 'admin' ? <RoleLayout user={user}><UserManagementPage/></RoleLayout> : <Navigate to="/dashboard"/>} />
        <Route path="/census" element={user?.role === 'admin' ? <RoleLayout user={user}><PopulationCensusPage/></RoleLayout> : <Navigate to="/dashboard"/>} />
        <Route path="/courses" element={user ? <RoleLayout user={user}><CoursesPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/exams" element={user ? <RoleLayout user={user}><ExamsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/grades" element={user ? <RoleLayout user={user}><GradesPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/assignments" element={user ? <RoleLayout user={user}><AssignmentsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/notifications" element={user ? <RoleLayout user={user}><NotificationsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/venues" element={user ? <RoleLayout user={user}><VenuesPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/events" element={user ? <RoleLayout user={user}><EventsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/schedule" element={user ? <RoleLayout user={user}><SchedulePage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/attendance" element={user ? <RoleLayout user={user}><AttendancePage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/announcements" element={user ? <RoleLayout user={user}><AnnouncementsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/videos" element={user ? <RoleLayout user={user}><LectureVideosPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/materials" element={user ? <RoleLayout user={user}><MaterialsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="/settings" element={user ? <RoleLayout user={user}><SettingsPage/></RoleLayout> : <Navigate to="/login"/>} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  )
}
