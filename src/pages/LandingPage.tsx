import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Shield, Brain, BookOpen, Bell, Search, GraduationCap, Globe, LineChart, Video, Zap, Calendar, Users, BarChart3, FileText, CheckCircle2 } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { Moon, Sun, Star } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  )
}

const features = [
  { icon: BookOpen,  title: 'Subject Management',  desc: 'Organise subjects, materials, and timetables in one unified workspace.' },
  { icon: LineChart, title: 'Grade Analytics',      desc: 'Real-time grade tracking with visual performance dashboards.' },
  { icon: Bell,      title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines, exams, and announcements.' },
  { icon: Video,     title: 'Live Collaboration',  desc: 'Integrated video conferencing and shared class recordings.' },
  { icon: Brain,     title: 'AI Assistant',        desc: 'Intelligent lecture summaries, scheduling suggestions, and insights.' },
  { icon: Shield,    title: 'Enterprise Security', desc: 'Bank-grade encryption, RLS policies, and role-based access control.' },
]

const courseCards = [
  { img: '/images/hero-graduation.jpg', title: 'Smart Academic Scheduling', meta: 'AI-Powered', tag: 'New', institution: 'Acaedu Institute' },
  { img: '/images/studying.jpg',        title: 'Real-Time Grade Analytics', meta: 'Dashboard', tag: 'Popular', institution: 'Acaedu School of Data' },
  { img: '/images/library.jpg',         title: 'Live Class Collaboration',  meta: 'Video + Chat', tag: 'Beta', institution: 'Acaedu Engineering' },
  { img: '/images/campus.jpg',          title: 'Campus Event Management',   meta: 'Calendar', tag: 'New', institution: 'Acaedu Student Life' },
]

const testimonials = [
  { name: 'Sarah M.',       role: 'Student',       quote: 'Acaedu transformed how I manage my studies. Every deadline, every grade, all in one place.' },
  { name: 'Dr. James K.',   role: 'Lecturer',      quote: 'The AI summaries save me hours each week and the attendance system is completely effortless.' },
  { name: 'Prof. Amina H.', role: 'Administrator', quote: 'Real-time analytics across all departments. Decision-making has never been this data-driven.' },
]

const disciplines = [
  { name: 'Artificial Intelligence', icon: Brain },
  { name: 'Data Science', icon: LineChart },
  { name: 'Business Administration', icon: Globe },
  { name: 'Healthcare', icon: Shield },
  { name: 'Engineering', icon: Zap },
  { name: 'Computer Science', icon: BookOpen },
  { name: 'Law', icon: Shield },
  { name: 'Architecture', icon: GraduationCap },
]

const heroSlides = [
  { headline: 'Learn without limits.\nAdvance your career.', sub: 'AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators.' },
  { headline: 'Students,\nyour journey starts here.', sub: 'Track grades, manage schedules, and never miss a deadline with smart notifications.' },
  { headline: 'Lecturers,\nteach with confidence.', sub: 'Auto-generated summaries, attendance tracking, and seamless grade management.' },
  { headline: 'Administrators,\ndrive institutional excellence.', sub: 'Real-time analytics, department oversight, and data-driven decision making.' },
]

const floatingCards = [
  { icon: Calendar,  label: 'Smart Schedule',    color: 'var(--color-primary)',   delay: 0,   x: '72%', y: '18%' },
  { icon: BarChart3, label: 'Live Analytics',    color: 'var(--color-purple)',    delay: 1.2, x: '80%', y: '55%' },
  { icon: Bell,      label: 'Instant Alerts',    color: 'var(--color-warning)',   delay: 2.4, x: '15%', y: '62%' },
  { icon: Users,     label: 'Collaborate Live',  color: 'var(--color-accent-warm)', delay: 0.6, x: '10%', y: '25%' },
  { icon: FileText,  label: 'AI Summaries',      color: 'var(--color-success)',   delay: 1.8, x: '85%', y: '38%' },
]

const featureCards = [
  { icon: CheckCircle2, text: '500+ Active Subjects',   bg: 'rgba(255,255,255,0.08)' },
  { icon: CheckCircle2, text: '99.9% Uptime',           bg: 'rgba(255,255,255,0.08)' },
  { icon: CheckCircle2, text: 'AI-Powered Insights',    bg: 'rgba(255,255,255,0.08)' },
  { icon: CheckCircle2, text: 'FERPA Compliant',        bg: 'rgba(255,255,255,0.08)' },
]

export function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const { theme, cycle } = useTheme()

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 nav-center glass">
        <div className="relative mx-auto px-6 flex items-center justify-between" style={{ height: '60px', maxWidth: '1152px' }}>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] overflow-hidden shadow-sm">
              <img src="/favicon.svg" alt="Acaedu" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Acaedu
            </span>
          </Link>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-7" style={{ textAlign: 'center' }}>
            {['Features', 'Disciplines', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button onClick={cycle}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle theme" title={`Current: ${theme}`}>
              {theme === 'light'
                ? <Sun size={16} className="text-[var(--color-text-muted)]" />
                : <Moon size={16} className="text-[var(--color-text-muted)]" />
              }
            </button>
            <Link to="/login" className="btn-ghost text-[13px] px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-[13px] px-5 py-2">Start Now</Link>
          </div>
        </div>
      </nav>

      <main className="pt-[60px]">

        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-navy)' }}>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 z-[1]"
            style={{
              background: 'linear-gradient(160deg, rgba(11,33,73,0.95) 0%, rgba(18,59,117,0.85) 40%, rgba(11,33,73,0.90) 70%, rgba(10,18,32,0.98) 100%)',
            }} />

          {/* Floating geometric shapes */}
          <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
            {/* Large orb top-right */}
            <motion.div
              animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.05, 0.95, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(24,101,242,0.12) 0%, transparent 70%)' }}
            />
            {/* Medium orb bottom-left */}
            <motion.div
              animate={{ x: [0, -20, 25, 0], y: [0, 20, -15, 0], scale: [1, 0.95, 1.05, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-16 -left-16 w-[300px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(144,89,255,0.1) 0%, transparent 70%)' }}
            />
            {/* Small orb center */}
            <motion.div
              animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/3 left-1/2 w-[200px] h-[200px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(20,191,150,0.08) 0%, transparent 70%)' }}
            />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
            {/* Diagonal lines */}
            <motion.div
              animate={{ opacity: [0.02, 0.05, 0.02] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(255,255,255,0.3) 80px, rgba(255,255,255,0.3) 81px)',
              }}
            />
          </div>

          {/* Floating feature cards */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9], y: [20, 0, 0, -10] }}
                transition={{ duration: 6, repeat: Infinity, delay: card.delay, ease: 'easeInOut' }}
                className="absolute hidden lg:block"
                style={{ left: card.x, top: card.y }}
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/8 backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, ${card.color} 15%, transparent)` }}>
                    <card.icon size={16} style={{ color: card.color }} />
                  </div>
                  <span className="text-[12px] font-semibold text-white/70 whitespace-nowrap">{card.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="max-w-5xl mx-auto px-6 w-full relative z-10 py-20">
            <div className="flex flex-col items-center text-center">

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 bg-white/6 border border-white/10 rounded-full mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  Professional Academic Platform
                </span>
              </motion.div>

              {/* Text carousel */}
              <div className="relative h-[140px] md:h-[130px] mb-6 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0 flex flex-col items-center"
                  >
                    <h1 className="text-[36px] md:text-[52px] font-extrabold text-white leading-[1.08] tracking-tight whitespace-pre-line"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {heroSlides[currentSlide].headline}
                    </h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-[16px] text-white/40 max-w-xl mx-auto leading-relaxed mt-4"
                      style={{ textAlign: 'center' }}>
                      {heroSlides[currentSlide].sub}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0, ease }}
                className="flex items-center gap-3 w-full max-w-lg mx-auto bg-white/8 border border-white/12 rounded-[var(--radius-md)] p-1.5 backdrop-blur-sm">
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search size={16} className="text-white/30 flex-shrink-0" />
                  <input type="text" placeholder="What do you want to learn?"
                    className="bg-transparent border-none outline-none text-[14px] text-white/80 placeholder:text-white/25 w-full" />
                </div>
                <Link to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/20">
                  Start Now
                  <ArrowRight size={13} />
                </Link>
              </motion.div>

              {/* Slide indicators */}
              <div className="flex items-center gap-2 mt-6">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-400 ${i === currentSlide ? 'w-6 bg-[var(--color-primary)]' : 'w-1.5 bg-white/20 hover:bg-white/35'}`}
                    aria-label={`Slide ${i + 1}`} />
                ))}
              </div>

              {/* Feature cards row */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2, ease }}
                className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                {featureCards.map((fc, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/8"
                    style={{ background: fc.bg }}>
                    <fc.icon size={12} className="text-white/50" />
                    <span className="text-[11px] font-semibold text-white/55">{fc.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.8 }}
                className="flex items-center justify-center gap-3 mt-6">
                {['SOC 2', 'FERPA', 'GDPR'].map(badge => (
                  <span key={badge}
                    className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/25 border border-white/8 px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
                <span className="text-[10px] text-white/15 ml-1">Certified &amp; Compliant</span>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Stats bar */}
        <Section className="py-14 border-y border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
          <div className="page-section text-center" style={{ textAlign: 'center' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '10,000+', label: 'Students Enrolled' },
                { num: '500+',   label: 'Active Subjects' },
                { num: '50+',    label: 'Institutions' },
                { num: '99.9%',  label: 'Uptime SLA' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="font-[var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] font-[800] text-[var(--color-navy)] tracking-tight leading-none mb-1.5"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {s.num}
                  </div>
                  <div className="text-[12px] font-[600] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section id="features" className="py-24">
          <div className="page-section text-center" style={{ textAlign: 'center' }}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">What You Get</span>
              <h2 className="section-heading mt-3">
                Everything your institution needs
              </h2>
              <p className="section-subtext mt-3">
                One platform for every academic workflow, from enrollment to graduation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 bg-[var(--color-primary-muted)]">
                      <f.icon size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                    <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed flex-1">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Course cards */}
            <div className="mt-14">
              <motion.div variants={fadeUp} className="text-center mb-10">
                <span className="section-label">Explore Programs</span>
                <h2 className="section-heading mt-3">Popular Subjects</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courseCards.map((course, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <div className="card overflow-hidden group cursor-pointer">
                      <div className="relative h-44 overflow-hidden">
                        <img src={course.img} alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 badge badge-navy text-[9px] bg-[var(--color-primary)] text-white border-none">{course.tag}</span>
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">{course.institution}</div>
                        <h3 className="text-[15px] font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1"
                          style={{ fontFamily: 'var(--font-display)' }}>{course.title}</h3>
                        <p className="text-[12px] text-[var(--color-text-muted)]">{course.meta}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Disciplines */}
        <Section id="disciplines" className="py-20 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border-light)]">
          <div className="page-section text-center" style={{ textAlign: 'center' }}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="section-label">Explore</span>
              <h2 className="section-heading mt-3">Popular Disciplines</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {disciplines.map((d, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 text-[15px] font-[600] text-[var(--color-text)] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-pill)] cursor-pointer transition-all duration-200 hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]">
                    <d.icon size={13} className="opacity-50" />
                    {d.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials */}
        <Section id="testimonials" className="py-24">
          <div className="page-section text-center" style={{ textAlign: 'center' }}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">Testimonials</span>
              <h2 className="section-heading mt-3">
                Trusted by educators worldwide
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="card p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} fill="var(--color-gold-bright)" stroke="none" />
                      ))}
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-5 flex-1 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-[700] text-white flex-shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[var(--color-navy)]">{t.name}</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, rgba(11,33,73,0.98) 0%, rgba(18,59,117,0.95) 50%, rgba(10,18,32,0.98) 100%)',
          }} />
          <div className="page-section text-center relative z-10" style={{ textAlign: 'center' }}>
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/50 bg-white/6 border border-white/10 rounded-full mb-8">
                <Zap size={10} className="text-[var(--color-primary-light)]" />
                Start Today — Free Forever
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-heading text-white mb-5">
              Ready to modernise your institution?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[15px] text-white/35 mb-10 max-w-lg mx-auto leading-relaxed text-center" style={{ textAlign: 'center' }}>
              Join thousands of students, lecturers, and administrators already streamlining their academic experience.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary group flex items-center gap-2 text-[14px] h-[44px] px-8">
                Create Account
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white/45 border border-white/10 rounded-[var(--radius-md)] hover:border-white/25 hover:text-white/75 transition-all duration-200">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="py-12 bg-[var(--color-secondary)] border-t border-white/5">
          <div className="page-section">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-[10px] bg-white/8 flex items-center justify-center">
                    <span className="text-white font-extrabold text-[11px]" style={{ fontFamily: 'var(--font-display)' }}>A</span>
                  </div>
                  <span className="text-[15px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
                </div>
                <p className="text-[12px] text-white/30 leading-relaxed">
                  AI-powered academic platform for modern institutions.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">Contact</h4>
                <div className="space-y-2">
                  <a href="mailto:DanielEbirim25@gmail.com" className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">DanielEbirim25@gmail.com</a>
                  <a href="tel:+2349115899245" className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">+234 911 589 9245</a>
                  <p className="text-[12px] text-white/30">Lekki, Lagos, Nigeria</p>
                </div>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">Connect</h4>
                <div className="space-y-2">
                  <a href="https://wa.me/2349115899245" target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/30 hover:text-[#25D366] transition-colors">WhatsApp</a>
                  <a href="https://t.me/acaedu" target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/30 hover:text-[#0088cc] transition-colors">Telegram</a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">Legal</h4>
                <div className="space-y-2">
                  {['Terms', 'Privacy', 'About', 'Contact'].map(item => (
                    <Link key={item} to={`/${item.toLowerCase()}`}
                      className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">{item}</Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-white/15 text-[11px]">&copy; 2026 Acaedu. All rights reserved.</span>
              <div className="flex items-center gap-4">
                {['Terms', 'Privacy', 'About', 'Contact'].map(item => (
                  <motion.div key={item} whileHover={{ y: -1 }}>
                    <Link to={`/${item.toLowerCase()}`}
                      className="text-[11px] text-white/20 hover:text-white/45 transition-colors">{item}</Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
