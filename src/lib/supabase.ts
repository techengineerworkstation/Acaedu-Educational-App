import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ─── Input Sanitization ─────────────────────────────────────
function sanitize(str: string): string {
  return str.replace(/[<>\"'&]/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }
    return map[char] || char
  })
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain a number'
  return null
}

// ─── Rate Limiting (client-side) ────────────────────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const limit = rateLimits.get(key)
  if (!limit || now > limit.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (limit.count >= maxRequests) return false
  limit.count++
  return true
}

// ─── Secure Auth Functions ──────────────────────────────────
export async function signUp(email: string, password: string, name: string, role: string) {
  const cleanEmail = sanitize(email.trim().toLowerCase())
  const cleanName = sanitize(name.trim())
  
  if (!validateEmail(cleanEmail)) throw new Error('Invalid email format')
  const passError = validatePassword(password)
  if (passError) throw new Error(passError)
  if (!cleanName || cleanName.length < 2) throw new Error('Name must be at least 2 characters')
  if (!checkRateLimit('signup', 3, 60000)) throw new Error('Too many signup attempts. Try again later.')

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: { data: { full_name: cleanName, role } },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const cleanEmail = sanitize(email.trim().toLowerCase())
  if (!validateEmail(cleanEmail)) throw new Error('Invalid email format')
  if (!checkRateLimit('signin', 5, 60000)) throw new Error('Too many login attempts. Try again later.')

  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function signInWithGoogle() {
  if (!checkRateLimit('oauth', 5, 60000)) throw new Error('Too many OAuth attempts.')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard' },
  })
  if (error) throw error
  return data
}

export async function signInWithApple() {
  if (!checkRateLimit('oauth', 5, 60000)) throw new Error('Too many OAuth attempts.')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: window.location.origin + '/dashboard' },
  })
  if (error) throw error
  return data
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

// ─── Secure CRUD Functions ──────────────────────────────────
const ALLOWED_TABLES = [
  'ai_scheduler_suggestions', 'ai_summaries', 'announcements', 'assignments',
  'attendance', 'billing_subscriptions', 'course_materials', 'courses',
  'departments', 'email_verifications', 'enrollments', 'events', 'exams',
  'faculties', 'feature_access', 'grades', 'holidays', 'institutions',
  'notifications', 'payments', 'profiles', 'schedule_instances', 'schedules',
  'search_queries', 'tests', 'users', 'venues', 'videos',
]

function validateTable(table: string): void {
  if (!ALLOWED_TABLES.includes(table)) throw new Error(`Invalid table: ${table}`)
}

function validateId(id: string): void {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('Invalid ID format')
}

export async function fetchTable(table: string, filters?: Record<string, any>) {
  validateTable(table)
  if (!checkRateLimit('read', 100, 60000)) throw new Error('Rate limit exceeded')

  let query = supabase.from(table).select('*')
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (typeof val === 'string') val = sanitize(val)
      query = query.eq(key, val)
    })
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function insertRow(table: string, row: Record<string, any>) {
  validateTable(table)
  if (!checkRateLimit('write', 30, 60000)) throw new Error('Rate limit exceeded')

  // Sanitize string values
  Object.keys(row).forEach(key => {
    if (typeof row[key] === 'string') row[key] = sanitize(row[key])
  })

  const { data, error } = await supabase.from(table).insert(row).select().single()
  if (error) throw error

  // Trigger email notifications for certain tables
  triggerEmailNotification(table, data).catch(console.error)

  return data
}

// ─── Email Notification Triggers ───────────────────────────
async function triggerEmailNotification(table: string, data: any) {
  try {
    const { sendEmail, announcementEmail, gradePublishedEmail } = await import('./email')

    if (table === 'announcements' && data) {
      // Get enrolled students for the course
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id, profiles!inner(email, full_name)')
        .eq('course_id', data.course_id)
        .eq('status', 'active')

      if (enrollments) {
        for (const enrollment of enrollments) {
          const profile = enrollment.profiles as any
          if (profile?.email) {
            const { subject, html } = announcementEmail(
              profile.full_name || 'Student',
              data.title,
              data.content?.substring(0, 200) + '...'
            )
            await sendEmail({ to: profile.email, subject, html })
          }
        }
      }
    }

    if (table === 'grades' && data) {
      // Get student info
      const { data: student } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', data.student_id)
        .single()

      if (student?.email) {
        const { subject, html } = gradePublishedEmail(
          student.full_name || 'Student',
          data.course_name || 'Course',
          data.score || 0,
          data.grade_letter || 'N/A'
        )
        await sendEmail({ to: student.email, subject, html })
      }
    }
  } catch (err) {
    console.error('Email notification error:', err)
  }
}

export async function updateRow(table: string, id: string, updates: Record<string, any>) {
  validateTable(table)
  validateId(id)
  if (!checkRateLimit('write', 30, 60000)) throw new Error('Rate limit exceeded')

  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'string') updates[key] = sanitize(updates[key])
  })

  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table: string, id: string) {
  validateTable(table)
  validateId(id)
  if (!checkRateLimit('write', 10, 60000)) throw new Error('Rate limit exceeded')

  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

// ─── Security Audit Log ─────────────────────────────────────
export function logSecurityEvent(event: string, details?: Record<string, any>) {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}`, details || '')
}

// ─── Session Timeout ────────────────────────────────────────
let sessionTimeout: number | null = null
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export function resetSessionTimer() {
  if (sessionTimeout) clearTimeout(sessionTimeout)
  sessionTimeout = window.setTimeout(() => {
    signOut()
    window.location.href = '/login'
  }, SESSION_TIMEOUT_MS)
}

// Reset timer on user activity
if (typeof window !== 'undefined') {
  ['click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    window.addEventListener(event, resetSessionTimer, { passive: true })
  })
}
