import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, Suspense, lazy, Component, type ReactNode } from 'react'
import { ArrowRight, Zap, Shield, Users, Brain, BookOpen, Bell, Sparkles, Search, GraduationCap, Globe, LineChart, Video } from 'lucide-react'
import { NumberTicker, TextReveal } from '@/components/aceternity/text-reveal'
import { CardContainer, CardBody } from '@/components/aceternity/3d-card'
import { useTheme } from '@/lib/theme'

const SparklesComponent = lazy(() => import('@/components/aceternity/sparkles').then(m => ({ default: m.Sparkles })))

class SilentErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() { return this.state.crashed ? null : this.props.children }
}

/* ─── Animation variants ─────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}
const scaleFade = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
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

/* ─── Hero SVG illustrations ─────────────────────────────────── */
const heroSlides = [
  {
    label: 'Smart Scheduling',
    svg: (
      <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="140" cy="110" r="90" fill="rgba(193,39,45,0.08)" />
        <circle cx="140" cy="110" r="65" fill="rgba(193,39,45,0.06)" />
        <rect x="90" y="55" width="100" height="110" rx="10" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="100" y="70" width="80" height="10" rx="3" fill="rgba(193,39,45,0.6)"/>
        <rect x="100" y="88" width="50" height="6" rx="2" fill="rgba(255,255,255,0.2)"/>
        <rect x="100" y="100" width="65" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
        <rect x="100" y="112" width="40" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
        <rect x="100" y="124" width="55" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
        <rect x="100" y="136" width="45" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
        <circle cx="180" cy="55" r="22" fill="#00262b" stroke="rgba(193,39,45,0.4)" strokeWidth="1.5"/>
        <text x="180" y="60" textAnchor="middle" fill="#e8535a" fontSize="14" fontWeight="800">AI</text>
        <circle cx="65" cy="80" r="8" fill="rgba(77,208,216,0.2)"/>
        <circle cx="215" cy="150" r="6" fill="rgba(193,39,45,0.15)"/>
        <circle cx="55" cy="150" r="5" fill="rgba(240,204,90,0.2)"/>
      </svg>
    ),
  },
  {
    label: 'Live Collaboration',
    svg: (
      <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="140" cy="110" r="85" fill="rgba(2,94,107,0.08)"/>
        <circle cx="110" cy="85" r="20" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <circle cx="110" cy="76" r="7" fill="rgba(77,208,216,0.5)"/>
        <rect x="98" y="88" width="24" height="14" rx="4" fill="rgba(77,208,216,0.25)"/>
        <circle cx="170" cy="85" r="20" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <circle cx="170" cy="76" r="7" fill="rgba(193,39,45,0.5)"/>
        <rect x="158" y="88" width="24" height="14" rx="4" fill="rgba(193,39,45,0.2)"/>
        <circle cx="140" cy="135" r="20" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <circle cx="140" cy="126" r="7" fill="rgba(240,204,90,0.5)"/>
        <rect x="128" y="138" width="24" height="14" rx="4" fill="rgba(240,204,90,0.2)"/>
        <line x1="120" y1="95" x2="130" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="160" y1="95" x2="150" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3"/>
        <path d="M135 60 L140 50 L145 60" fill="none" stroke="rgba(193,39,45,0.4)" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Grade Analytics',
    svg: (
      <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="140" cy="110" r="85" fill="rgba(240,204,90,0.06)"/>
        <rect x="75" y="60" width="130" height="100" rx="10" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="85" y="72" width="45" height="6" rx="2" fill="rgba(255,255,255,0.25)"/>
        <rect x="85" y="84" width="110" height="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="90" y="130" width="14" height="22" rx="3" fill="rgba(193,39,45,0.6)"/>
        <rect x="110" y="118" width="14" height="34" rx="3" fill="rgba(77,208,216,0.5)"/>
        <rect x="130" y="108" width="14" height="44" rx="3" fill="rgba(240,204,90,0.5)"/>
        <rect x="150" y="115" width="14" height="37" rx="3" fill="rgba(193,39,45,0.5)"/>
        <rect x="170" y="100" width="14" height="52" rx="3" fill="rgba(77,208,216,0.6)"/>
        <circle cx="200" cy="65" r="15" fill="#00262b" stroke="rgba(193,39,45,0.3)" strokeWidth="1"/>
        <text x="200" y="70" textAnchor="middle" fill="#e8535a" fontSize="11" fontWeight="700">A+</text>
      </svg>
    ),
  },
  {
    label: 'Campus Events',
    svg: (
      <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="140" cy="110" r="85" fill="rgba(193,39,45,0.06)"/>
        <rect x="85" y="65" width="110" height="95" rx="8" fill="#00262b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="85" y="65" width="110" height="25" rx="8" fill="rgba(193,39,45,0.3)"/>
        <rect x="95" y="100" width="42" height="48" rx="5" fill="rgba(77,208,216,0.12)" stroke="rgba(77,208,216,0.25)" strokeWidth="1"/>
        <rect x="143" y="100" width="42" height="48" rx="5" fill="rgba(240,204,90,0.1)" stroke="rgba(240,204,90,0.2)" strokeWidth="1"/>
        <rect x="100" y="108" width="32" height="4" rx="1.5" fill="rgba(255,255,255,0.2)"/>
        <rect x="100" y="116" width="24" height="3" rx="1" fill="rgba(255,255,255,0.1)"/>
        <rect x="148" y="108" width="32" height="4" rx="1.5" fill="rgba(255,255,255,0.2)"/>
        <rect x="148" y="116" width="24" height="3" rx="1" fill="rgba(255,255,255,0.1)"/>
        <circle cx="115" cy="78" r="6" fill="rgba(255,255,255,0.3)"/>
        <text x="115" y="82" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">15</text>
        <circle cx="55" cy="90" r="4" fill="rgba(193,39,45,0.15)"/>
        <circle cx="220" cy="140" r="5" fill="rgba(77,208,216,0.15)"/>
      </svg>
    ),
  },
]

/* ─── Data ───────────────────────────────────────────────────── */
const features = [
  { icon: BookOpen,  title: 'Subject Management',  desc: 'Organise courses, materials, and timetables in one unified workspace.', accent: 'rgba(193,39,45,0.08)', iconBg: 'rgba(193,39,45,0.12)', iconColor: '#c1272d' },
  { icon: LineChart, title: 'Grade Analytics',      desc: 'Real-time grade tracking with visual performance dashboards.', accent: 'rgba(2,94,107,0.08)', iconBg: 'rgba(2,94,107,0.10)', iconColor: '#025e6b' },
  { icon: Bell,      title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines, exams, and announcements.', accent: 'rgba(240,204,90,0.08)', iconBg: 'rgba(240,204,90,0.12)', iconColor: '#b8860b' },
  { icon: Video,     title: 'Live Collaboration',  desc: 'Integrated video conferencing and shared class recordings.', accent: 'rgba(77,208,216,0.08)', iconBg: 'rgba(77,208,216,0.10)', iconColor: '#025e6b' },
  { icon: Brain,     title: 'AI Assistant',        desc: 'Intelligent lecture summaries, scheduling suggestions, and insights.', accent: 'rgba(193,39,45,0.06)', iconBg: 'rgba(193,39,45,0.10)', iconColor: '#c1272d' },
  { icon: Shield,    title: 'Enterprise Security', desc: 'Bank-grade encryption, RLS policies, and role-based access control.', accent: 'rgba(0,38,43,0.06)', iconBg: 'rgba(0,38,43,0.08)', iconColor: '#00262b' },
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

const themeIcons: Record<string, React.ReactNode> = {
  light: <span className="text-[var(--color-text-muted)]"><Sparkles size={16} /></span>,
  dark: <span className="text-[var(--color-text-muted)]"><Sparkles size={16} /></span>,
  midnight: <span className="text-[var(--color-text-muted)]"><Sparkles size={16} /></span>,
}

/* ─── Pulsating headline animation ────────────────────────────── */
function PulsatingHeadline() {
  return (
    <motion.h1
      className="text-[36px] md:text-[52px] font-extrabold text-white leading-[1.04] tracking-tight mb-6"
      style={{ fontFamily: 'var(--font-display)' }}
      animate={{
        textShadow: [
          '0 0 0px rgba(193,39,45,0)',
          '0 0 20px rgba(193,39,45,0.15)',
          '0 0 40px rgba(193,39,45,0.08)',
          '0 0 20px rgba(193,39,45,0.15)',
          '0 0 0px rgba(193,39,45,0)',
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      Learn without limits.<br />Advance your career.
    </motion.h1>
  )
}

/* ─── Component ──────────────────────────────────────────────── */
export function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const { theme, cycle } = useTheme()

  const [slideIndex, setSlideIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(i => (i + 1) % heroSlides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '60px' }}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-[10px] bg-[var(--color-primary)] flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-glow-navy)] transition-shadow duration-300">
              <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </motion.div>
            <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Acaedu
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {['Features', 'Disciplines', 'Testimonials'].map(item => (
              <motion.a key={item} href={`#${item.toLowerCase()}`}
                whileHover={{ y: -1 }}
                className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full rounded-full" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={cycle}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle theme" title={`Current: ${theme}`}>
              {themeIcons[theme]}
            </motion.button>
            <Link to="/login" className="btn-ghost text-[13px] px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-[13px] px-5 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-[60px]">

        {/* ── Hero — edX dark with sparkles + animated SVG carousel ─── */}
        <section ref={heroRef} className="relative min-h-[calc(100vh-60px)] flex items-center overflow-hidden bg-[var(--color-secondary)]">
          {/* Sparkles particle overlay */}
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-60">
            <SilentErrorBoundary>
              <Suspense fallback={null}>
                <SparklesComponent count={70} speed={0.4} colors={['#c1272d', '#e8535a', '#025e6b', '#4dd0d8', '#ffffff']} />
              </Suspense>
            </SilentErrorBoundary>
          </div>

          {/* Dark overlay gradient */}
          <div className="absolute inset-0 z-[2]"
            style={{
              background: 'linear-gradient(160deg, rgba(0,18,20,0.88) 0%, rgba(0,38,43,0.72) 40%, rgba(0,56,63,0.65) 70%, rgba(0,38,43,0.85) 100%)',
            }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="max-w-6xl mx-auto px-6 w-full relative z-10 py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left — text, centered */}
              <div className="flex-1 text-center lg:text-center max-w-2xl mx-auto lg:mx-0">

                {/* Eyebrow */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 bg-white/6 border border-white/10 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    Professional Academic Platform
                  </span>
                </motion.div>

                {/* Headline with pulsating glow */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }}>
                  <PulsatingHeadline />
                </motion.div>

                {/* Sub-headline */}
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8, ease }}
                  className="text-[16px] text-white/40 max-w-xl mx-auto leading-relaxed mb-10">
                  AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators.
                </motion.p>

                {/* Search-style CTA bar */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0, ease }}
                  className="flex items-center gap-3 max-w-lg mx-auto bg-white/8 border border-white/12 rounded-[var(--radius-md)] p-1.5 backdrop-blur-sm">
                  <div className="flex-1 flex items-center gap-2.5 px-3">
                    <Search size={16} className="text-white/30 flex-shrink-0" />
                    <input type="text" placeholder="What do you want to learn?"
                      className="bg-transparent border-none outline-none text-[14px] text-white/80 placeholder:text-white/25 w-full" />
                  </div>
                  <Link to="/register"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/20">
                    Get Started
                    <ArrowRight size={13} />
                  </Link>
                </motion.div>

                {/* Trust strip */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }}
                  className="flex items-center justify-center gap-3 mt-8">
                  {['SOC 2', 'FERPA', 'GDPR'].map(badge => (
                    <span key={badge}
                      className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/25 border border-white/8 px-2.5 py-1 rounded-full">
                      {badge}
                    </span>
                  ))}
                  <span className="text-[10px] text-white/15 ml-1">Certified &amp; Compliant</span>
                </motion.div>
              </div>

              {/* Right — animated SVG illustration carousel */}
              <div className="flex-shrink-0 w-[280px] h-[220px] md:w-[340px] md:h-[260px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.92, rotateY: 8 }}
                    transition={{ duration: 0.6, ease }}
                    className="absolute inset-0"
                  >
                    {heroSlides[slideIndex].svg}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel dots */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === slideIndex ? 'bg-[var(--color-primary)] w-5' : 'bg-white/20 hover:bg-white/35'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/25">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </section>

        {/* ── Stats bar ──────────────────────────────────────────── */}
        <Section className="py-14 border-y border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
          <div className="page-section">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: 10000, suffix: '+', label: 'Students Enrolled' },
                { num: 500,   suffix: '+', label: 'Active Courses' },
                { num: 50,    suffix: '+', label: 'Institutions' },
                { num: 99.9,  suffix: '%', label: 'Uptime SLA' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="stat-row-item">
                  <div className="stat-row-value">
                    <NumberTicker value={s.num} />{s.suffix}
                  </div>
                  <div className="stat-row-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Feature Cards — soft rounded-square, icon-forward ─── */}
        <Section id="features" className="py-24">
          <div className="page-section">
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">What You Get</span>
              <span className="rule-gold" />
              <h2 className="section-title mt-4 text-3xl md:text-4xl mb-3">
                Everything your institution needs
              </h2>
              <p className="text-[14px] text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
                One platform for every academic workflow, from enrollment to graduation.
              </p>
            </motion.div>

            {/* Feature cards — soft rounded shape, prominent graphic icons, no numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <CardContainer>
                    <CardBody className="card-academic p-6 h-full flex flex-col cursor-default group">
                      {/* Icon with background accent */}
                      <motion.div
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                        className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-5"
                        style={{ background: f.iconBg }}
                      >
                        <f.icon size={24} style={{ color: f.iconColor }} />
                      </motion.div>

                      <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                      <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed flex-1">{f.desc}</p>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>

            {/* Course image cards — edX large-image pattern */}
            <div className="mt-14">
              <motion.div variants={fadeUp} className="text-center mb-10">
                <span className="section-label">Explore Programs</span>
                <span className="rule-gold" />
                <h2 className="section-title mt-4 text-2xl md:text-3xl">Popular courses</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courseCards.map((course, i) => (
                  <motion.div key={i} variants={scaleFade}>
                    <CardContainer>
                      <CardBody className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-[var(--shadow-card)] group cursor-pointer hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                        <div className="relative h-44 overflow-hidden">
                          <motion.img src={course.img} alt={course.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <span className="absolute top-3 right-3 badge badge-navy text-[9px] bg-[var(--color-primary)] text-white border-none">{course.tag}</span>
                        </div>
                        <div className="p-5">
                          <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">{course.institution}</div>
                          <h3 className="text-[15px] font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1"
                            style={{ fontFamily: 'var(--font-display)' }}>{course.title}</h3>
                          <p className="text-[12px] text-[var(--color-text-muted)]">{course.meta}</p>
                        </div>
                      </CardBody>
                    </CardContainer>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Disciplines ────────────────────────────────────────── */}
        <Section id="disciplines" className="py-20 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border-light)]">
          <div className="page-section">
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="section-label">Explore</span>
              <span className="rule-gold" />
              <h2 className="section-title mt-4 text-3xl md:text-4xl">Popular Disciplines</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {disciplines.map((d, i) => (
                <motion.div key={i} variants={fadeUp}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}>
                  <span className="discipline-pill inline-flex items-center gap-2">
                    <d.icon size={13} className="opacity-50" />
                    {d.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <Section id="testimonials" className="py-24">
          <div className="page-section">
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">Testimonials</span>
              <span className="rule-gold" />
              <h2 className="section-title mt-4 text-3xl md:text-4xl">
                Trusted by educators worldwide
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="card p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <motion.svg key={s} width="14" height="14" viewBox="0 0 24 24"
                          fill="var(--color-gold-bright)" stroke="none"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + s * 0.08, duration: 0.3 }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </motion.svg>
                      ))}
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-5 flex-1 italic">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
                      <div className="avatar w-9 h-9 text-[12px]">{t.name[0]}</div>
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

        {/* ── CTA — edX dark editorial ───────────────────────────── */}
        <Section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-secondary)]" />
          <div className="absolute inset-0 opacity-[0.08]">
            <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(193,39,45,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(2,94,107,0.08) 0%, transparent 50%)',
          }} />
          <div className="page-section text-center relative z-10">
            <motion.div variants={fadeUp}>
              <span className="trust-badge mb-8 inline-flex gap-1.5">
                <Zap size={10} className="text-[var(--color-primary-light)]" />
                Start Today — Free Forever
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-display-lg text-white mb-5">
              Ready to modernise your institution?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[15px] text-white/35 mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of students, lecturers, and administrators already streamlining their academic experience.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn-primary group flex items-center gap-2 text-[14px] h-[44px] px-8">
                  Create Free Account
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3 text-[14px] font-semibold text-white/45 border border-white/10 rounded-[var(--radius-md)] hover:border-white/25 hover:text-white/75 transition-all duration-200">
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="py-12 bg-[var(--color-secondary)] border-t border-white/5">
          <div className="page-section">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-white/8 flex items-center justify-center">
                  <span className="text-white font-extrabold text-[11px]"
                    style={{ fontFamily: 'var(--font-display)' }}>A</span>
                </div>
                <span className="text-[15px] font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
                <span className="text-white/15 text-[11px] ml-2">&copy; 2026. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Contact'].map(item => (
                  <motion.div key={item} whileHover={{ y: -1 }}>
                    <Link to={`/${item.toLowerCase()}`}
                      className="text-[12px] text-white/25 hover:text-white/55 transition-colors">{item}</Link>
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
