import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sun, Moon, ArrowRight, Zap, Shield, Users, Brain, BookOpen, Bell } from 'lucide-react'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { Sparkles } from '@/components/aceternity/sparkles'
import { CardContainer, CardBody } from '@/components/aceternity/3d-card'
import { TextReveal, GlowingEffect, NumberTicker } from '@/components/aceternity/text-reveal'

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-72px' })
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  )
}

const features = [
  { icon: BookOpen, num: '01', title: 'Subject Management',  desc: 'Organise courses, materials, and timetables in one unified workspace.' },
  { icon: Zap,      num: '02', title: 'Grade Analytics',     desc: 'Real-time grade tracking with visual performance dashboards.' },
  { icon: Bell,     num: '03', title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines, exams, and announcements.' },
  { icon: Users,    num: '04', title: 'Live Collaboration',  desc: 'Integrated video conferencing and shared class recordings.' },
  { icon: Brain,    num: '05', title: 'AI Assistant',        desc: 'Intelligent lecture summaries, scheduling suggestions, and insights.' },
  { icon: Shield,   num: '06', title: 'Enterprise Security', desc: 'Bank-grade encryption, RLS policies, and role-based access control.' },
]

const testimonials = [
  { name: 'Sarah M.',      role: 'Student',       quote: 'Acaedu transformed how I manage my studies. Every deadline, every grade — all in one place.' },
  { name: 'Dr. James K.',  role: 'Lecturer',      quote: 'The AI summaries save me hours each week and the attendance system is completely effortless.' },
  { name: 'Prof. Amina H.',role: 'Administrator', quote: 'Real-time analytics across all departments. Decision-making has never been this data-driven.' },
]

const disciplines = ['Artificial Intelligence', 'Data Science', 'Business Administration', 'Healthcare', 'Engineering', 'Computer Science', 'Law', 'Architecture']

const heroWords = [
  { word: 'Smart',      className: 'text-white' },
  { word: 'Academic',   className: 'gold-text' },
  { word: 'Scheduling', className: 'text-white' },
]

export function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

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

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm group-hover:shadow-[var(--shadow-glow-navy)] transition-shadow duration-300">
              <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'var(--font-display)' }}>A</span>
            </div>
            <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Disciplines', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-[var(--color-navy)]/6 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]">
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <Link to="/login" className="btn-ghost text-[13px]">Log in</Link>
            <Link to="/register" className="btn-primary text-[13px] px-5 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">

        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <BackgroundGradient className="absolute inset-0">
            <Sparkles count={60} />
          </BackgroundGradient>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-gold-light)] bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-bright)] animate-pulse" />
                    Professional Academic Platform
                  </span>
                </motion.div>

                <div className="mb-7">
                  {heroWords.map((w, i) => (
                    <motion.div key={i} variants={fadeUp} className="overflow-hidden leading-none mb-1">
                      <span className={`block text-display-xl ${w.className}`}>{w.word}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={fadeUp}>
                  <TextReveal
                    text="AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators."
                    className="text-[15px] text-white/55 max-w-[460px] leading-relaxed mb-10"
                  />
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
                  <Link to="/register" className="btn-gold group flex items-center gap-2 text-[13px]">
                    Get Started Free
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white/70 border border-white/15 rounded-[var(--radius-md)] hover:border-white/35 hover:text-white transition-all duration-200 backdrop-blur-sm">
                    Learn More
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-center gap-4 mt-10 pt-8 border-t border-white/8">
                  {['SOC 2', 'FERPA', 'GDPR'].map(badge => (
                    <span key={badge} className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/30 border border-white/10 px-2.5 py-1 rounded-full">{badge}</span>
                  ))}
                  <span className="text-[12px] text-white/25 ml-1">Certified &amp; Compliant</span>
                </motion.div>
              </motion.div>

              {/* Right */}
              <motion.div initial="hidden" animate="visible" variants={scaleIn} className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[28px] bg-[var(--color-primary)]/20 blur-2xl scale-105" />
                  <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-white/10">
                    <img src="/images/hero-graduation.jpg" alt="Graduation" className="w-full h-[420px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/50 via-transparent to-transparent" />
                  </div>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-5 -left-5 rounded-[18px] overflow-hidden shadow-xl border border-white/12 w-44">
                    <img src="/images/studying.jpg" alt="Studying" className="w-full h-28 object-cover" />
                  </motion.div>
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -top-5 -right-5 rounded-[18px] overflow-hidden shadow-xl border border-white/12 w-36 h-24">
                    <img src="/images/books.jpg" alt="Books" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/80 tracking-wide">LIVE PLATFORM</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30">Scroll</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        {/* Stats */}
        <Section className="py-14 border-y border-[var(--color-beige)] bg-[var(--color-bg-secondary)]/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: 10000, suffix: '+', label: 'Students Enrolled' },
                { num: 500,   suffix: '+', label: 'Active Courses' },
                { num: 50,    suffix: '+', label: 'Institutions' },
                { num: 99.9,  suffix: '%', label: 'Uptime SLA' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-navy)] tracking-tight mb-1.5"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    <NumberTicker value={s.num} />{s.suffix}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.12em]">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section id="features" className="py-28">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="section-label">What You Get</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl mb-4">Everything your institution needs</h2>
              <p className="text-[14px] text-[var(--color-text-muted)] max-w-lg mx-auto">One platform for every academic workflow — from enrollment to graduation.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <CardContainer>
                    <CardBody>
                      <GlowingEffect className="card prismatic-border p-6 h-full flex flex-col">
                        <div className="w-11 h-11 rounded-xl bg-[var(--color-navy)]/6 flex items-center justify-center mb-4">
                          <f.icon size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <span className="text-[9px] font-bold tracking-[0.15em] text-[var(--color-gold)] uppercase mb-2">{f.num}</span>
                        <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed flex-1">{f.desc}</p>
                      </GlowingEffect>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Disciplines */}
        <Section id="disciplines" className="py-24 bg-[var(--color-beige-light)]/50 border-y border-[var(--color-beige)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-label">Explore</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl">Popular Disciplines</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {disciplines.map((d, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.04 }}
                  className="px-6 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-beige)] rounded-xl text-[13px] font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white hover:border-[var(--color-navy)] hover:shadow-[var(--shadow-glow-navy)] transition-all duration-200 cursor-pointer">
                  {d}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials */}
        <Section id="testimonials" className="py-28">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl">Trusted by educators worldwide</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <CardContainer>
                    <CardBody>
                      <GlowingEffect className="card p-7 flex flex-col h-full">
                        <div className="flex gap-1 mb-5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="var(--color-gold-bright)" stroke="none">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                          <div className="avatar w-9 h-9 text-xs">{t.name[0]}</div>
                          <div>
                            <div className="text-[13px] font-semibold text-[var(--color-navy)]">{t.name}</div>
                            <div className="text-[11px] text-[var(--color-text-muted)]">{t.role}</div>
                          </div>
                        </div>
                      </GlowingEffect>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 opacity-[0.07]">
            <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <BackgroundGradient className="absolute inset-0"><span /></BackgroundGradient>
          <Sparkles count={35} className="absolute inset-0 z-10" />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-20">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-gold-light)] bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                <Zap size={11} className="text-[var(--color-gold-bright)]" />
                Start Today — Free Forever
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-display-lg text-white mb-5">
              Ready to modernise your institution?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[15px] text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of students, lecturers, and administrators already streamlining their academic experience.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-gold group flex items-center gap-2.5 text-[14px] px-8 py-3.5">
                Create Free Account
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-white/65 border border-white/15 rounded-[var(--radius-md)] hover:border-white/35 hover:text-white transition-all backdrop-blur-sm">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-12 bg-[var(--color-navy-dark)] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center">
                  <span className="text-white font-extrabold text-[10px]" style={{ fontFamily: 'var(--font-display)' }}>A</span>
                </div>
                <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Acaedu</span>
                <span className="text-white/20 text-[11px] ml-2">© 2026. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Contact'].map(item => (
                  <Link key={item} to={`/${item.toLowerCase()}`}
                    className="text-[12px] text-white/30 hover:text-white/70 transition-colors">{item}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
