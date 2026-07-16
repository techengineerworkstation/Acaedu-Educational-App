import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { Sparkles } from '@/components/aceternity/sparkles'
import { CardContainer, CardBody } from '@/components/aceternity/3d-card'
import { TextReveal, GlowingEffect, NumberTicker } from '@/components/aceternity/text-reveal'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
}
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  )
}

const features = [
  { num: '01', title: 'Subject Management', desc: 'Organize subjects, materials, and schedules in one place.' },
  { num: '02', title: 'Grade Tracking', desc: 'Real-time grade updates with performance analytics.' },
  { num: '03', title: 'Live Classes', desc: 'Integrated video conferencing for virtual lectures.' },
  { num: '04', title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines and announcements.' },
  { num: '05', title: 'AI Assistant', desc: 'Intelligent summaries, suggestions, and lecture analysis.' },
  { num: '06', title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access control.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Student', quote: 'Acaedu transformed how I manage my studies. The notifications keep me on track with every deadline.' },
  { name: 'Dr. James K.', role: 'Lecturer', quote: 'Managing attendance and grades has never been easier. The AI summaries save me hours every week.' },
  { name: 'Prof. Amina H.', role: 'Administrator', quote: 'The analytics dashboard gives us real-time insights into student performance across all departments.' },
]

const disciplines = ['Artificial Intelligence', 'Data Science', 'Business', 'Healthcare', 'Engineering', 'Computer Science']

export function LandingPage() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') { document.documentElement.classList.add('dark'); return true }
    }
    return false
  })
  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(!dark); localStorage.setItem('theme', dark ? 'light' : 'dark') }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[var(--color-beige)]/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--color-navy)] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xs" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A</span>
            </div>
            <span className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Acaedu</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Disciplines', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-200">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-[var(--color-navy)]/5 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-navy)]" title="Toggle theme">
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <Link to="/login" className="btn-ghost text-[13px]">Log in</Link>
            <Link to="/register" className="btn-primary text-[13px] px-5 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* ── Hero with Background Gradient + Sparkles ─────────── */}
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden">
          <BackgroundGradient className="absolute inset-0">
            <Sparkles count={50} />
          </BackgroundGradient>

          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-navy) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--color-navy)] bg-[var(--color-navy)]/5 border border-[var(--color-navy)]/8 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
                    Smart Academic Platform
                  </span>
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[0.92] mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <span className="text-[var(--color-navy)]">Smart</span><br />
                  <span className="text-[var(--color-navy)]/20">Academic</span><br />
                  <span className="text-[var(--color-navy)]">Scheduling</span>
                </motion.h1>

                <motion.div variants={fadeInUp}>
                  <TextReveal text="AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators." className="text-[15px] md:text-base text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed mb-10" />
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
                  <Link to="/register" className="btn-primary px-7 py-3 text-[13px] group">
                    Get started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link to="/contact" className="btn-secondary px-6 py-3 text-[13px]">Learn more</Link>
                </motion.div>
              </motion.div>

              {/* Right: Hero Images */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }} className="hidden lg:block">
                <div className="relative">
                  <div className="rounded-[24px] overflow-hidden shadow-2xl border border-[var(--color-beige)]/40">
                    <img src="/images/hero-graduation.jpg" alt="Students at graduation" className="w-full h-[420px] object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 rounded-[16px] overflow-hidden shadow-xl border border-[var(--color-beige)]/40 w-40 h-28">
                    <img src="/images/studying.jpg" alt="Students studying" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-4 -right-4 rounded-[16px] overflow-hidden shadow-xl border border-[var(--color-beige)]/40 w-32 h-24">
                    <img src="/images/books.jpg" alt="Academic books" className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats with Number Ticker ─────────────────────────── */}
        <Section className="py-16 border-y border-[var(--color-beige)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { num: 10000, suffix: '+', label: 'Students' },
                { num: 500, suffix: '+', label: 'Subjects' },
                { num: 50, suffix: '+', label: 'Institutions' },
                { num: 99.9, suffix: '%', label: 'Uptime' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <NumberTicker value={item.num} />{item.suffix}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.12em] mt-1.5">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Features with 3D Cards + Glow ─────────────────── */}
        <Section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="section-label">What You Get</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl">Everything for your institution</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <CardContainer>
                    <CardBody>
                      <GlowingEffect className="card p-6 text-center h-full">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-navy)]/5 flex items-center justify-center mx-auto mb-4">
                          <span className="text-[11px] font-bold text-[var(--color-gold)] font-mono">{f.num}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.title}</h3>
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
                      </GlowingEffect>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Disciplines ──────────────────────────────────── */}
        <Section id="disciplines" className="py-24 bg-[var(--color-beige-light)]/40 border-y border-[var(--color-beige)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <span className="section-label">Explore</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl">Popular Disciplines</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {disciplines.map((cat, i) => (
                <motion.div key={i} variants={fadeInUp} className="px-6 py-3 bg-white border border-[var(--color-beige)] rounded-xl text-[13px] font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white hover:border-[var(--color-navy)] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md">
                  {cat}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <Section id="testimonials" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title mt-3 text-3xl md:text-4xl">What our users say</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <CardContainer>
                    <CardBody>
                      <GlowingEffect className="card p-6 flex flex-col h-full">
                        <div className="flex gap-0.5 mb-5 justify-center">
                          {[1, 2, 3, 4, 5].map(s => (
                            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-6 flex-1 italic text-center">"{t.quote}"</p>
                        <div className="flex items-center gap-3 justify-center">
                          <div className="avatar w-9 h-9 text-xs">{t.name[0]}</div>
                          <div className="text-left">
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

        {/* ── CTA ──────────────────────────────────────────── */}
        <Section className="py-24 bg-[var(--color-navy)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="/images/campus.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[var(--color-navy)]/80" />
          <Sparkles count={30} className="z-10" />
          <div className="max-w-6xl mx-auto px-6 text-center relative z-20">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Ready to get started?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[14px] text-white/40 mb-10 max-w-md mx-auto">
              Join thousands of institutions already using Acaedu.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/register" className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-[var(--color-navy)] font-semibold text-[13px] rounded-[var(--radius-md)] hover:bg-[var(--color-cream)] transition-colors shadow-lg">
                Create free account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="py-12 bg-[var(--color-navy-dark)] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-extrabold text-[10px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>A</span>
              </div>
              <span className="text-sm font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Acaedu</span>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              {['Terms', 'Privacy', 'Contact'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-[12px] text-white/30 hover:text-white/70 transition-colors">{item}</Link>
              ))}
            </div>
            <p className="text-[11px] text-white/20">© 2026 Acaedu. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
