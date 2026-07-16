import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy, Component } from 'react'
import type { ReactNode } from 'react'
import { supabase } from './lib/supabase'
import { RoleLayout } from './components/RoleLayout'
import type { User } from './types'

// Lazy-load the heavy Three.js background independently
const FractalBackground = lazy(() =>
  import('./components/FractalBackground').then(m => ({ default: m.FractalBackground }))
)

import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import {
  CoursesPage, EnrollmentsPage, SchedulesPage, ScheduleInstancesPage,
  AttendanceCrudPage, HolidaysPage, ExamsPage, TestsPage, AssignmentsPage,
  GradesPage, AnnouncementsCrudPage, NotificationsPage, VideosPage,
  MaterialsPage, EventsPage, VenuesPage, AiSchedulerPage, AiSummariesPage,
  DepartmentsPage, FacultiesPage, InstitutionsPage,
  BillingPage, PaymentsPage, FeatureAccessPage, EmailVerificationsPage,
  SearchQueriesPage, SettingsPage
} from './pages/CrudPages'
import { AdminDashboard, UserManagementPage, PopulationCensusPage } from './pages/AdminPages'
import { TermsPage, PrivacyPage, ContactPage } from './pages/StaticPages'
import { LiveClassesPage, ClassRecordsPage, ProfilePage } from './pages/AdditionalPages'

// ── Silently swallow any Three.js / WebGL crash so routes still show ──────────
class ThreeErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-[var(--color-navy)] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id:         session.user.id,
          email:      session.user.email || '',
          full_name:  session.user.user_metadata?.full_name || 'User',
          role:       session.user.user_metadata?.role || 'student',
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id:         session.user.id,
          email:      session.user.email || '',
          full_name:  session.user.user_metadata?.full_name || 'User',
          role:       session.user.user_metadata?.role || 'student',
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <Loader />

  const auth  = (el: ReactNode) =>
    user ? <RoleLayout user={user}>{el}</RoleLayout> : <Navigate to="/login" />
  const admin = (el: ReactNode) =>
    user?.role === 'admin'
      ? <RoleLayout user={user}>{el}</RoleLayout>
      : <Navigate to="/dashboard" />

  return (
    <BrowserRouter>
      {/* Three.js background: isolated Suspense+ErrorBoundary so any crash never blocks the UI */}
      <ThreeErrorBoundary>
        <Suspense fallback={null}>
          <FractalBackground />
        </Suspense>
      </ThreeErrorBoundary>

      {/* App routes: always render regardless of Three.js state */}
      <Routes>
        <Route path="/"        element={user ? <Navigate to="/dashboard"/> : <LandingPage/>} />
        <Route path="/login"   element={user ? <Navigate to="/dashboard"/> : <LoginPage/>} />
        <Route path="/register"element={user ? <Navigate to="/dashboard"/> : <RegisterPage/>} />
        <Route path="/terms"   element={<TermsPage/>} />
        <Route path="/privacy" element={<PrivacyPage/>} />
        <Route path="/contact" element={<ContactPage/>} />

        <Route path="/dashboard"          element={auth(<DashboardPage user={user!}/>)} />
        <Route path="/courses"            element={auth(<CoursesPage/>)} />
        <Route path="/enrollments"        element={auth(<EnrollmentsPage/>)} />
        <Route path="/schedule"           element={auth(<SchedulesPage/>)} />
        <Route path="/schedule-instances" element={auth(<ScheduleInstancesPage/>)} />
        <Route path="/attendance"         element={auth(<AttendanceCrudPage/>)} />
        <Route path="/holidays"           element={auth(<HolidaysPage/>)} />

        <Route path="/exams"       element={auth(<ExamsPage/>)} />
        <Route path="/tests"       element={auth(<TestsPage/>)} />
        <Route path="/assignments" element={auth(<AssignmentsPage/>)} />
        <Route path="/grades"      element={auth(<GradesPage/>)} />

        <Route path="/announcements"   element={auth(<AnnouncementsCrudPage/>)} />
        <Route path="/notifications"   element={auth(<NotificationsPage/>)} />
        <Route path="/videos"          element={auth(<VideosPage/>)} />
        <Route path="/course-materials"element={auth(<MaterialsPage/>)} />
        <Route path="/events"          element={auth(<EventsPage/>)} />
        <Route path="/venues"          element={auth(<VenuesPage/>)} />
        <Route path="/live-classes"    element={auth(<LiveClassesPage/>)} />
        <Route path="/class-records"   element={auth(<ClassRecordsPage/>)} />

        <Route path="/ai-scheduler" element={auth(<AiSchedulerPage/>)} />
        <Route path="/ai-summaries" element={auth(<AiSummariesPage/>)} />

        <Route path="/admin"       element={admin(<AdminDashboard/>)} />
        <Route path="/users"       element={admin(<UserManagementPage/>)} />
        <Route path="/departments" element={admin(<DepartmentsPage/>)} />
        <Route path="/faculties"   element={admin(<FacultiesPage/>)} />
        <Route path="/institutions"element={admin(<InstitutionsPage/>)} />
        <Route path="/census"      element={admin(<PopulationCensusPage/>)} />

        <Route path="/billing"  element={admin(<BillingPage/>)} />
        <Route path="/payments" element={admin(<PaymentsPage/>)} />

        <Route path="/feature-access"      element={admin(<FeatureAccessPage/>)} />
        <Route path="/email-verifications" element={admin(<EmailVerificationsPage/>)} />
        <Route path="/search-queries"      element={admin(<SearchQueriesPage/>)} />

        <Route path="/profile"  element={auth(<ProfilePage user={user!}/>)} />
        <Route path="/settings" element={auth(<SettingsPage/>)} />

        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  )
}
