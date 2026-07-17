import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { signIn, signInWithGoogle, signInWithApple } from '../lib/supabase'

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

      {/* ── Left panel — institutional identity ──────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(6,15,30,0.92) 0%, rgba(15,42,82,0.88) 50%, rgba(15,42,82,0.95) 100%)' }} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative z-10 flex flex-col h-full px-12 py-10">

          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-auto">
            <div className="w-9 h-9 rounded-[10px] bg-white/10 flex items-center justify-center border border-white/10">
              <span className="text-white font-extrabold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-lg font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          {/* Main copy */}
          <div className="py-16">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--color-gold-light)] mb-5">
              Academic Platform
            </p>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Welcome back to your academic workspace
            </h2>
            <p className="text-[14px] text-white/38 leading-relaxed max-w-sm">
              Access your courses, grades, schedule, and institution tools — all in one place.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-8 border-t border-white/8 pt-8">
            {[
              { value: '10K+', label: 'Active Students' },
              { value: '500+', label: 'Courses' },
              { value: '50+',  label: 'Institutions' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-extrabold text-white mb-0.5"
                  style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-[10px] text-white/28 font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-bg)]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-[360px]">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-navy)]"
              style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[22px] font-extrabold text-[var(--color-navy)] tracking-tight mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}>
              Sign in
            </h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/15 text-[var(--color-danger)] text-[13px] font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@institution.edu"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-[5px]">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password"
                  className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--color-border-light)]" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">or continue with</span>
            <div className="flex-1 h-px bg-[var(--color-border-light)]" />
          </div>

          {/* OAuth buttons */}
          <div className="space-y-2.5">
            <button onClick={handleGoogle} className="btn-secondary w-full py-2.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v2.325h3.15c1.85-1.7 2.9-4.2 2.9-7.25z"/>
                <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-3.15-2.325c-.875.6-2 .95-3.5.95-2.7 0-4.975-1.825-5.8-4.275H2.9v2.4C4.55 20.825 8.05 23 12 23z"/>
                <path fill="#FBBC05" d="M6.2 14.875A6.54 6.54 0 0 1 5.85 13c0-.65.125-1.275.35-1.875V8.725H2.9A11.01 11.01 0 0 0 1.75 13c0 1.475.3 2.875.825 4.15l3.625-2.275z"/>
                <path fill="#EA4335" d="M12 5.75c1.525 0 2.875.525 3.95 1.55l2.95-2.95C17 2.7 14.7 1.75 12 1.75 8.05 1.75 4.55 3.925 2.9 7.15l3.3 2.575C7.025 7.575 9.3 5.75 12 5.75z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={handleApple} className="btn-secondary w-full py-2.5 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-[13px] text-[var(--color-text-muted)] mt-7">
            Don&apos;t have an account?{' '}
            <Link to="/register"
              className="font-semibold text-[var(--color-primary)] hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
