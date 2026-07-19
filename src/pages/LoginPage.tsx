import { useState, Suspense, lazy, Component, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { signIn, signInWithGoogle, signInWithApple } from '../lib/supabase'

const SparklesComponent = lazy(() => import('@/components/aceternity/sparkles').then(m => ({ default: m.Sparkles })))

class SilentErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    try { await signInWithGoogle() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Google sign-in failed') }
  }

  const handleApple = async () => {
    try { await signInWithApple() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Apple sign-in failed') }
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">

      {/* ── Left panel — edX dark teal editorial ──────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col">
        <div className="absolute inset-0">
          <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(0,10,12,0.96) 0%, rgba(0,38,43,0.92) 45%, rgba(0,56,63,0.88) 75%, rgba(0,38,43,0.95) 100%)' }} />

        {/* Sparkles overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
          <SilentErrorBoundary>
            <Suspense fallback={null}>
              <SparklesComponent count={40} speed={0.3} colors={['#c1272d', '#e8535a', '#025e6b', '#4dd0d8', '#ffffff']} />
            </Suspense>
          </SilentErrorBoundary>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="relative z-10 flex flex-col h-full px-12 py-10">

          <div className="flex items-center gap-2.5 mb-auto">
            <div className="w-9 h-9 rounded-[11px] bg-white/8 flex items-center justify-center border border-white/10">
              <span className="text-white font-extrabold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-lg font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          <div className="py-16">
            <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-[11px] font-bold tracking-[0.16em] uppercase text-[var(--color-primary-light)] mb-5">
              Professional Academic Platform
            </motion.p>
            <motion.h2 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.45, ease }}
              className="text-3xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
              Welcome back to your academic workspace
            </motion.h2>
            <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6, ease }}
              className="text-[14px] text-white/35 leading-relaxed max-w-sm">
              Access your courses, grades, schedule, and institution tools, all in one place.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease }}
            className="flex items-center gap-8 border-t border-white/8 pt-8">
            {[
              { value: '10K+', label: 'Active Students' },
              { value: '500+', label: 'Courses' },
              { value: '50+',  label: 'Institutions' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-extrabold text-white mb-0.5"
                  style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-[10px] text-white/25 font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-bg)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-[380px]">

          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-[11px] bg-[var(--color-primary)] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-navy)]"
              style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[24px] font-extrabold text-[var(--color-navy)] tracking-tight mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}>
              Sign in
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/15 text-[var(--color-danger)] text-[13px] font-medium">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="label">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="you@institution.edu" required autoComplete="email" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center justify-between mb-[6px]">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password"
                  className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pr-10" placeholder="••••••••" required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3 mt-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </motion.button>
            </motion.div>
          </form>

          <div className="divider-label my-6">
            <span>or continue with</span>
          </div>

          <div className="space-y-2.5">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleGoogle} className="btn-secondary w-full py-2.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v2.325h3.15c1.85-1.7 2.9-4.2 2.9-7.25z"/>
                <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-2.5-1.95c-.7.475-1.575.75-2.65.75-1.95 0-3.6-1.275-4.2-3.05H3.45v1.65C5.15 20.125 8.3 23 12 23z"/>
                <path fill="#FBBC05" d="M5.8 14.25c-.225-.6-.35-1.225-.35-1.875 0-.65.125-1.275.35-1.875v-1.65H3.45v1.65C3.45 12.7 3.6 13.35 3.9 13.9z"/>
                <path fill="#EA4335" d="M12 5.25c1.55 0 2.975.525 4.05 1.4l2.975-2.975C17.2 2.1 14.7 1.25 12 1.25 8.3 1.25 5.15 4.125 3.45 8.1l1.65 1.25C5.4 9.525 5.8 8.4 5.8 7.2c0-1.3.525-2.475 1.4-3.325L5.8 5.25z"/>
              </svg>
              Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleApple} className="btn-secondary w-full py-2.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </motion.button>
          </div>

          <p className="text-center text-[13px] text-[var(--color-text-muted)] mt-8">
            Don't have an account? <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
