import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, GraduationCap, BookOpen, Shield, ArrowLeft } from 'lucide-react'
import { signUp, signInWithGoogle, signInWithApple } from '../lib/supabase'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const roles = [
  { value: 'student',  label: 'Student',      icon: GraduationCap, desc: 'Access subjects, grades & schedule' },
  { value: 'lecturer', label: 'Lecturer',      icon: BookOpen,     desc: 'Manage classes, attendance & grades' },
  { value: 'admin',    label: 'Administrator',  icon: Shield,       desc: 'Full system management' },
]

export function RegisterPage() {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [role, setRole]           = useState('student')
  const [step, setStep]           = useState(1)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--color-bg)' }}>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-[420px] p-8 sm:p-10"
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-md)',
        }}
      >

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-primary)' }}>
            <span className="text-white font-extrabold text-base" style={{ fontFamily: 'var(--font-display)' }}>A</span>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>Acaedu</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-bold tracking-tight mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)' }}>
            {step === 1 ? 'Create your account' : 'Complete your profile'}
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
            {step === 1 ? 'Select your role to get started' : `Registering as ${roles.find(r => r.value === role)?.label}`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-lg text-[13px] font-medium text-center"
            style={{
              background: 'color-mix(in srgb, var(--color-danger) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-danger) 15%, transparent)',
              color: 'var(--color-danger)',
            }}>
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* Step 1 — Role selection */
            <motion.div key="step1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3, ease }}
              className="space-y-3"
            >
              {roles.map((r, i) => (
                <motion.button key={r.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, ease }}
                  onClick={() => { setRole(r.value); setStep(2) }}
                  className="w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-200 group"
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 40%, transparent)'
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 4%, transparent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.background = 'var(--color-bg-card)'
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:scale-105"
                    style={{ background: 'var(--color-bg-secondary)' }}>
                    <r.icon size={20} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold" style={{ color: 'var(--color-navy)' }}>{r.label}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{r.desc}</div>
                  </div>
                </motion.button>
              ))}

              {/* Divider */}
              <div className="divider-label my-6">
                <span>or continue with</span>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleGoogle}
                  className="btn-secondary h-[44px] rounded-lg text-[13px]">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v2.325h3.15c1.85-1.7 2.9-4.2 2.9-7.25z"/>
                    <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-2.5-1.95c-.7.475-1.575.75-2.65.75-1.95 0-3.6-1.275-4.2-3.05H3.45v1.65C5.15 20.125 8.3 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.8 14.25c-.225-.6-.35-1.225-.35-1.875 0-.65.125-1.275.35-1.875v-1.65H3.45v1.65C3.45 12.7 3.6 13.35 3.9 13.9z"/>
                    <path fill="#EA4335" d="M12 5.25c1.55 0 2.975.525 4.05 1.4l2.975-2.975C17.2 2.1 14.7 1.25 12 1.25 8.3 1.25 5.15 4.125 3.45 8.1l1.65 1.25C5.4 9.525 5.8 8.4 5.8 7.2c0-1.3.525-2.475 1.4-3.325L5.8 5.25z"/>
                  </svg>
                  Google
                </button>
                <button onClick={handleApple}
                  className="btn-secondary h-[44px] rounded-lg text-[13px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </motion.div>
          ) : (
            /* Step 2 — Registration form */
            <motion.div key="step2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3, ease }}
            >
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="input" placeholder="John Doe" required autoComplete="name" />
                </div>

                <div>
                  <label className="label">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input" placeholder="you@example.com" required autoComplete="email" />
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      className="input pr-10" placeholder="Min 8 chars, upper + lower + number" required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--color-text-muted)' }}
                      aria-label={showPass ? 'Hide password' : 'Show password'}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="btn-secondary flex-1 h-[44px] rounded-lg text-[14px] gap-2">
                    <ArrowLeft size={15} />
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="btn-primary flex-1 h-[44px] rounded-lg text-[14px]">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer link */}
        <p className="text-center text-[13px] mt-8" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
            Sign in
          </Link>
        </p>
      </motion.div>

      {/* Page footer */}
      <div className="mt-8 text-center text-[11px] space-x-4" style={{ color: 'var(--color-text-muted)' }}>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/help" className="hover:underline">Help</Link>
      </div>
    </div>
  )
}
