import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Layout } from './components/Layout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { CoursesPage } from './pages/CoursesPage'
import { ExamsPage } from './pages/ExamsPage'
import { GradesPage } from './pages/GradesPage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { VenuesPage } from './pages/VenuesPage'
import { EventsPage } from './pages/EventsPage'
import { SchedulePage } from './pages/SchedulePage'
import { SettingsPage } from './pages/SettingsPage'
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
        <Route path="/dashboard" element={user ? <Layout user={user}><DashboardPage user={user}/></Layout> : <Navigate to="/login"/>} />
        <Route path="/courses" element={user ? <Layout user={user}><CoursesPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/exams" element={user ? <Layout user={user}><ExamsPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/grades" element={user ? <Layout user={user}><GradesPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/assignments" element={user ? <Layout user={user}><AssignmentsPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/notifications" element={user ? <Layout user={user}><NotificationsPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/venues" element={user ? <Layout user={user}><VenuesPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/events" element={user ? <Layout user={user}><EventsPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/schedule" element={user ? <Layout user={user}><SchedulePage/></Layout> : <Navigate to="/login"/>} />
        <Route path="/settings" element={user ? <Layout user={user}><SettingsPage/></Layout> : <Navigate to="/login"/>} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  )
}
