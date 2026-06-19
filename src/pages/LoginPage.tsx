import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signIn, signInWithGoogle, signInWithApple } from '../lib/supabase'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] bg-[var(--color-navy)] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/90 via-[var(--color-navy)]/80 to-[var(--color-navy)]/95" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 px-14 max-w-md text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-[12px] bg-white/10 flex items-center justify-center">
              <span className="text-white font-extrabold text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A</span>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Acaedu</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome back to your academic platform
          </h2>
          <p className="text-[14px] text-white/35 leading-relaxed">
            Access your courses, grades, schedule, and connect with your institution — all in one place.
          </p>
          <div className="mt-14 flex items-center justify-center gap-10">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>10K+</div>
              <div className="text-[11px] text-white/25 mt-1">Active Students</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>500+</div>
              <div className="text-[11px] text-white/25 mt-1">Courses</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[360px]">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Acaedu</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[var(--color-navy)] tracking-tight mb-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Sign in</h1>
            <p className="text-[13px] text-[var(--color-text-muted)]">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/15 text-[var(--color-danger)] text-[13px] font-medium text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors">
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--color-beige)]" />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--color-beige)]" />
          </div>

          <div className="space-y-2.5">
            <button onClick={handleGoogle} className="btn-secondary w-full py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v3.775c1.175.45 2.525.7 4.05 0 .6-.225 1.175-.525 1.65-1.025 2.5-1.875 3.2-2.975-1.025-1.425-2.1-3.375-2.1-5.375v-4.65c0-.2.025-.4.025-.6z"/><path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-2.5-1.95c-.7.475-1.575.75-2.65.75-1.95 0-3.6-1.275-4.2-3.05H3.45v1.65C5.15 20.125 8.3 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.25c-.225-.6-.35-1.225-.35-1.875 0-.65.125-1.275.35-1.875v-1.65H3.45v1.65C3.45 12.7 3.6 13.35 3.9 13.9z"/><path fill="#EA4335" d="M12 5.25c1.55 0 2.975.525 4.05 1.4l2.975-2.975C17.2 2.1 14.7 1.25 12 1.25 8.3 1.25 5.15 4.125 3.45 8.1l1.65 1.25C5.4 9.525 5.8 8.4 5.8 7.2c0-1.3.525-2.475 1.4-3.325L5.8 5.25z"/></svg>
              Continue with Google
            </button>
            <button onClick={handleApple} className="btn-secondary w-full py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>
          </div>

          <p className="text-center text-[13px] text-[var(--color-text-muted)] mt-8">
            Don&apos;t have an account? <Link to="/register" className="font-semibold text-[var(--color-navy)] hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
