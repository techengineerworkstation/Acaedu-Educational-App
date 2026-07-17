import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sun, Moon, ArrowRight, Zap, Shield, Users, Brain, BookOpen, Bell } from 'lucide-react'
import { NumberTicker } from '@/components/aceternity/text-reveal'

/* ─── Animation variants ─────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  )
}

/* ─── Data ───────────────────────────────────────────────────── */
const features = [
  { icon: BookOpen, num: '01', title: 'Subject Management',  desc: 'Organise courses, materials, and timetables in one unified workspace.' },
  { icon: Zap,      num: '02', title: 'Grade Analytics',     desc: 'Real-time grade tracking with visual performance dashboards.' },
  { icon: Bell,     num: '03', title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines, exams, and announcements.' },
  { icon: Users,    num: '04', title: 'Live Collaboration',  desc: 'Integrated video conferencing and shared class recordings.' },
  { icon: Brain,    num: '05', title: 'AI Assistant',        desc: 'Intelligent lecture summaries, scheduling suggestions, and insights.' },
  { icon: Shield,   num: '06', title: 'Enterprise Security', desc: 'Bank-grade encryption, RLS policies, and role-based access control.' },
]

const testimonials = [
  { name: 'Sarah M.',       role: 'Student',       quote: 'Acaedu transformed how I manage my studies. Every deadline, every grade — all in one place.' },
  { name: 'Dr. James K.',   role: 'Lecturer',      quote: 'The AI summaries save me hours each week and the attendance system is completely effortless.' },
  { name: 'Prof. Amina H.', role: 'Administrator', quote: 'Real-time analytics across all departments. Decision-making has never been this data-driven.' },
]

const disciplines = [
  'Artificial Intelligence', 'Data Science', 'Business Administration',
  'Healthcare', 'Engineering', 'Computer Science', 'Law', 'Architecture',
]

/* ─── Component ──────────────────────────────────────────────── */
export function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') { document.documentElement.classList.add('dark'); return true }
    }
    return false
  })
  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(d => { localStorage.setItem('theme', !d ? 'dark' : 'light'); return !d })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between" style={{ height: '60px' }}>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[9px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-glow-navy)] transition-shadow duration-300">
              <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Acaedu
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {['Features', 'Disciplines', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-primary)] transition-all duration-250 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]"
              aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="btn-ghost text-[13px] px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-[13px] px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-[60px]">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 hero-gradient" />

          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }} />

          {/* Faint diagonal stripes — institutional motif */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 24px)',
            }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* Left — copy */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                {/* Eyebrow */}
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.13em] uppercase text-[var(--color-gold-light)] bg-white/5 border border-white/10 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-bright)] animate-pulse" />
                    Professional Academic Platform
                  </span>
                </motion.div>

                {/* Headline */}
                <div className="mb-6">
                  {['Smart', 'Academic', 'Scheduling'].map((word, i) => (
                    <motion.div key={i} variants={fadeUp} className="overflow-hidden leading-none mb-1">
                      <span className={`block text-display-xl ${i === 1 ? 'gold-text' : 'text-white'}`}>
                        {word}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Subheadline */}
                <motion.p variants={fadeUp}
                  className="text-[15px] text-white/50 max-w-[440px] leading-relaxed mb-9">
                  AI-powered scheduling, real-time notifications, and seamless collaboration — for students, lecturers, and administrators.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
                  <Link to="/register" className="btn-gold group flex items-center gap-2 text-[13px]">
                    Get Started Free
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white/60 border border-white/12 rounded-[var(--radius-md)] hover:border-white/30 hover:text-white/90 transition-all duration-200">
                    Learn More
                  </Link>
                </motion.div>

                {/* Trust strip */}
                <motion.div variants={fadeUp}
                  className="flex items-center gap-3 mt-9 pt-7 border-t border-white/8">
                  {['SOC 2', 'FERPA', 'GDPR'].map(badge => (
                    <span key={badge}
                      className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/25 border border-white/10 px-2.5 py-1 rounded-full">
                      {badge}
                    </span>
                  ))}
                  <span className="text-[11px] text-white/20 ml-1">Certified &amp; Compliant</span>
                </motion.div>
              </motion.div>

              {/* Right — image card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease }}
                className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[24px] bg-[var(--color-primary)]/25 blur-2xl scale-105" />
                  <div className="relative rounded-[24px] overflow-hidden shadow-2xl border border-white/10">
                    <img src="/images/hero-graduation.jpg" alt="Graduation ceremony"
                      className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/50 via-transparent to-transparent" />
                  </div>
                  {/* Floating cards */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-4 -left-4 rounded-[14px] overflow-hidden shadow-xl border border-white/12 w-40">
                    <img src="/images/studying.jpg" alt="Students studying"
                      className="w-full h-24 object-cover" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -top-4 -right-4 rounded-[14px] overflow-hidden shadow-xl border border-white/12 w-32 h-20">
                    <img src="/images/books.jpg" alt="Academic books"
                      className="w-full h-full object-cover" />
                  </motion.div>
                  {/* Live badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/12">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/75 tracking-wide">LIVE PLATFORM</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/25">Scroll</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
              className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent" />
          </motion.div>
        </section>

        {/* ── Stats bar ──────────────────────────────────────────── */}
        <Section className="py-12 border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: 10000, suffix: '+', label: 'Students Enrolled' },
                { num: 500,   suffix: '+', label: 'Active Courses' },
                { num: 50,    suffix: '+', label: 'Institutions' },
                { num: 99.9,  suffix: '%', label: 'Uptime SLA' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-navy)] tracking-tight mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    <NumberTicker value={s.num} />{s.suffix}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Features ───────────────────────────────────────────── */}
        <Section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">What You Get</span>
              <h2 className="section-title mt-2.5 text-3xl md:text-4xl mb-3">
                Everything your institution needs
              </h2>
              <p className="text-[14px] text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                One platform for every academic workflow — from enrollment to graduation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="card-academic p-6 h-full flex flex-col cursor-default">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--color-navy-pale)] flex items-center justify-center">
                        <f.icon size={19} className="text-[var(--color-primary)]" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.14em] text-[var(--color-gold-mid)] uppercase">
                        {f.num}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-[var(--color-navy)] mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {f.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed flex-1">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Disciplines ────────────────────────────────────────── */}
        <Section id="disciplines" className="py-20 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="section-label">Explore</span>
              <h2 className="section-title mt-2.5 text-3xl md:text-4xl">Popular Disciplines</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {disciplines.map((d, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.03 }}
                  className="px-5 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white hover:border-[var(--color-navy)] hover:shadow-[var(--shadow-glow-navy)] transition-all duration-200 cursor-pointer">
                  {d}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <Section id="testimonials" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title mt-2.5 text-3xl md:text-4xl">
                Trusted by educators worldwide
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="card p-6 flex flex-col h-full">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                          fill="var(--color-gold-bright)" stroke="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-5 flex-1 italic">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
                      <div className="avatar w-8 h-8 text-[11px]">{t.name[0]}</div>
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--color-navy)]">{t.name}</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <Section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 opacity-[0.06]">
            <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          {/* Subtle diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 24px)',
            }} />

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.13em] uppercase text-[var(--color-gold-light)] bg-white/5 border border-white/10 rounded-full mb-7">
                <Zap size={10} className="text-[var(--color-gold-bright)]" />
                Start Today — Free Forever
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-display-lg text-white mb-4">
              Ready to modernise your institution?
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[14px] text-white/40 mb-9 max-w-lg mx-auto leading-relaxed">
              Join thousands of students, lecturers, and administrators already streamlining their academic experience.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register" className="btn-gold group flex items-center gap-2 text-[13px] px-7 py-3">
                Create Free Account
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-white/55 border border-white/12 rounded-[var(--radius-md)] hover:border-white/28 hover:text-white/85 transition-all duration-200">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="py-10 bg-[var(--color-navy)] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-white/8 flex items-center justify-center">
                  <span className="text-white font-extrabold text-[10px]"
                    style={{ fontFamily: 'var(--font-display)' }}>A</span>
                </div>
                <span className="text-[14px] font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
                <span className="text-white/18 text-[11px] ml-2">© 2026. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-5">
                {['Terms', 'Privacy', 'Contact'].map(item => (
                  <Link key={item} to={`/${item.toLowerCase()}`}
                    className="text-[12px] text-white/28 hover:text-white/65 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
