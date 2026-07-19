import { useState, Suspense, lazy, Component, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signUp, signInWithGoogle, signInWithApple } from '../lib/supabase'
import { GraduationCap, BookOpen, Shield } from 'lucide-react'

const SparklesComponent = lazy(() => import('@/components/aceternity/sparkles').then(m => ({ default: m.Sparkles })))

class SilentErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Access subjects, grades, schedule' },
  { value: 'lecturer', label: 'Lecturer', icon: BookOpen, desc: 'Manage classes, attendance, grades' },
  { value: 'admin', label: 'Administrator', icon: Shield, desc: 'Full system management' },
]

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState('student')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signUp(email, password, name, role)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    try { await signInWithGoogle() } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Google sign-in failed') }
  }

  const handleApple = async () => {
    try { await signInWithApple() } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Apple sign-in failed') }
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* ── Left panel — edX dark teal editorial ──────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <img src="/images/students-group.jpg" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(0,10,12,0.96) 0%, rgba(0,38,43,0.92) 45%, rgba(193,39,45,0.25) 75%, rgba(0,38,43,0.95) 100%)' }} />

        {/* Sparkles overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-35">
          <SilentErrorBoundary>
            <Suspense fallback={null}>
              <SparklesComponent count={35} speed={0.25} colors={['#c1272d', '#e8535a', '#025e6b', '#4dd0d8', '#ffffff']} />
            </Suspense>
          </SilentErrorBoundary>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
          className="relative z-10 px-14 max-w-md text-center">

          <div className="flex items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-[12px] bg-white/8 flex items-center justify-center border border-white/10">
              <span className="text-white font-extrabold text-lg" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}
            className="text-3xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
            Start your academic journey today
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45, ease }}
            className="text-[14px] text-white/35 leading-relaxed">
            Join a growing community of students, educators, and institutions leveraging smart technology for better learning outcomes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7, ease }}
            className="mt-14 grid grid-cols-3 gap-6">
            {[
              { label: 'Students', value: '10K+' },
              { label: 'Courses', value: '500+' },
              { label: 'Institutions', value: '50+' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-[11px] text-white/25 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="w-full max-w-[420px]">

          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-[11px] bg-[var(--color-primary)] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[24px] font-extrabold text-[var(--color-navy)] tracking-tight mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
              {step === 1 ? 'Create your account' : 'Complete your profile'}
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              {step === 1 ? 'Select your role to get started' : `Registering as ${role}`}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/15 text-[var(--color-danger)] text-[13px] font-medium text-center">{error}</motion.div>
          )}

          {step === 1 ? (
            <div className="space-y-3">
              {roles.map((r, i) => (
                <motion.button key={r.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, ease }}
                  whileHover={{ scale: 1.01, x: 3 }} whileTap={{ scale: 0.99 }}
                  onClick={() => { setRole(r.value); setStep(2) }}
                  className={`w-full p-4 rounded-[var(--radius-lg)] border-2 text-left flex items-center gap-4 transition-all duration-200 ${role === r.value ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)] shadow-[var(--shadow-glow-navy)]' : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/30 shadow-[var(--shadow-xs)]'}`}>
                  <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-colors ${role === r.value ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-bg-secondary)]'}`}>
                    <r.icon size={20} className={role === r.value ? 'text-white' : 'text-[var(--color-text-muted)]'}/>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[var(--color-navy)]">{r.label}</div>
                    <div className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{r.desc}</div>
                  </div>
                </motion.button>
              ))}

              <div className="divider-label my-6">
                <span>or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleGoogle} className="btn-secondary py-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v3.775c1.175.45 2.525.7 4.05 0 .6-.225 1.175-.525 1.65-1.025 2.5-1.875 3.2-2.975-1.025-1.425-2.1-3.375-2.1-5.375v-4.65c0-.2.025-.4.025-.6z"/><path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-2.5-1.95c-.7.475-1.575.75-2.65.75-1.95 0-3.6-1.275-4.2-3.05H3.45v1.65C5.15 20.125 8.3 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.25c-.225-.6-.35-1.225-.35-1.875 0-.65.125-1.275.35-1.875v-1.65H3.45v1.65C3.45 12.7 3.6 13.35 3.9 13.9z"/><path fill="#EA4335" d="M12 5.25c1.55 0 2.975.525 4.05 1.4l2.975-2.975C17.2 2.1 14.7 1.25 12 1.25 8.3 1.25 5.15 4.125 3.45 8.1l1.65 1.25C5.4 9.525 5.8 8.4 5.8 7.2c0-1.3.525-2.475 1.4-3.325L5.8 5.25z"/></svg>
                  Google
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleApple} className="btn-secondary py-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Apple
                </motion.button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="label">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" required />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input pr-10" placeholder="Min 8 chars, upper+lower+number" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors">
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    )}
                  </button>
                </div>
              </motion.div>

              <div className="flex gap-3 pt-2">
                <motion.button type="button" onClick={() => setStep(1)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="btn-secondary flex-1 py-2.5">Back</motion.button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary flex-1 py-2.5">
                  {loading ? 'Creating...' : 'Create Account'}
                </motion.button>
              </div>
            </form>
          )}

          <p className="text-center text-[13px] text-[var(--color-text-muted)] mt-8">
            Already have an account? <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
