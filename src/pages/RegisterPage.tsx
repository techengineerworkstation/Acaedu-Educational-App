import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signUp, signInWithGoogle, signInWithApple } from '../lib/supabase'
import { GraduationCap, BookOpen, Shield } from 'lucide-react'

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
  const [step, setStep] = useState(1) // 1=role, 2=details
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signUp(email, password, name, role)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    try { await signInWithGoogle() } catch (err: any) { setError(err.message) }
  }

  const handleApple = async () => {
    try { await signInWithApple() } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl" style={{background:'var(--gradient-primary)'}}>A</div>
          <h1 className="text-2xl font-bold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            {step === 1 ? 'Choose your role' : 'Create account'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {step === 1 ? 'Select how you want to use Acaedu' : `Registering as ${role}`}
          </p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm">{error}</div>}

        {step === 1 ? (
          <div className="space-y-3">
            {roles.map(r => (
              <motion.button
                key={r.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setRole(r.value); setStep(2) }}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition ${role === r.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background: role === r.value ? 'var(--gradient-primary)' : 'var(--color-bg-secondary)'}}>
                  <r.icon size={24} className={role === r.value ? 'text-white' : 'text-text-muted'}/>
                </div>
                <div>
                  <div className="font-bold">{r.label}</div>
                  <div className="text-sm text-text-muted">{r.desc}</div>
                </div>
              </motion.button>
            ))}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border"/><span className="text-xs text-text-muted">or continue with</span><div className="flex-1 h-px bg-border"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleGoogle} className="py-3 rounded-lg border-2 border-border font-semibold text-sm flex items-center justify-center gap-2 hover:border-primary transition">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.25c0-.75-.075-1.5-.2-2.25H12v4.25h5.4c-.225 1.2-.9 2.225-1.95 2.925v3.775c1.175.45 2.525.7 4.05 0 .6-.225 1.175-.525 1.65-1.025 2.5-1.875 3.2-2.975-1.025-1.425-2.1-3.375-2.1-5.375v-4.65c0-.2.025-.4.025-.6z"/><path fill="#34A853" d="M12 23c2.7 0 5-.9 6.65-2.475l-2.5-1.95c-.7.475-1.575.75-2.65.75-1.95 0-3.6-1.275-4.2-3.05H3.45v1.65C5.15 20.125 8.3 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.25c-.225-.6-.35-1.225-.35-1.875 0-.65.125-1.275.35-1.875v-1.65H3.45v1.65C3.45 12.7 3.6 13.35 3.9 13.9z"/><path fill="#EA4335" d="M12 5.25c1.55 0 2.975.525 4.05 1.4l2.975-2.975C17.2 2.1 14.7 1.25 12 1.25 8.3 1.25 5.15 4.125 3.45 8.1l1.65 1.25C5.4 9.525 5.8 8.4 5.8 7.2c0-1.3.525-2.475 1.4-3.325L5.8 5.25z"/></svg>
                Google
              </button>
              <button onClick={handleApple} className="py-3 rounded-lg border-2 border-border font-semibold text-sm flex items-center justify-center gap-2 hover:border-primary transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1 font-medium">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="John Doe" required/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1 font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="you@example.com" required/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1 font-medium">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Min 8 chars, upper+lower+number" required/>
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg border-2 border-border font-semibold transition hover:border-primary">Back</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg text-white font-bold transition hover:shadow-lg disabled:opacity-50" style={{background:'var(--gradient-primary)'}}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
