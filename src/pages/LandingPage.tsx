import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}

// SVG Icons
const icons = {
  book: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  chart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bell: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  video: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  users: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  calendar: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  star: <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
}

const features = [
  { icon: icons.book, title: 'Subject Management', desc: 'Organize subjects, materials, and schedules in one place.' },
  { icon: icons.chart, title: 'Grade Tracking', desc: 'Real-time grade updates with performance analytics.' },
  { icon: icons.video, title: 'Live Classes', desc: 'Integrated video conferencing for virtual lectures.' },
  { icon: icons.bell, title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines and announcements.' },
  { icon: icons.zap, title: 'AI Assistant', desc: 'Intelligent summaries, suggestions, and lecture analysis.' },
  { icon: icons.shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access control.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Student', quote: 'Acaedu transformed how I manage my studies. The notifications keep me on track with every deadline.' },
  { name: 'Dr. James K.', role: 'Lecturer', quote: 'Managing attendance and grades has never been easier. The AI summaries save me hours every week.' },
  { name: 'Prof. Amina H.', role: 'Administrator', quote: 'The analytics dashboard gives us real-time insights into student performance across all departments.' },
]

const categories = [
  { name: 'Artificial Intelligence', count: '25+ subjects' },
  { name: 'Data Science', count: '30+ subjects' },
  { name: 'Business', count: '40+ subjects' },
  { name: 'Healthcare', count: '20+ subjects' },
  { name: 'Engineering', count: '35+ subjects' },
  { name: 'Computer Science', count: '45+ subjects' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-bg-card/80 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{background:'var(--gradient-primary)'}}>A</div>
          <span className="text-lg font-bold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Acaedu</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-ghost px-4 py-2 text-sm rounded-lg border border-border hover:border-primary hover:text-primary transition">Log in</Link>
          <Link to="/register" className="btn px-4 py-2 text-sm rounded-lg text-white font-semibold transition hover:shadow-lg" style={{background:'var(--gradient-primary)'}}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.8 }} className="max-w-2xl">
          <motion.div variants={scaleIn} transition={{ delay: 0.2 }} className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">Smart Academic Platform</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} transition={{ delay: 0.3, duration: 0.8 }} className="text-5xl md:text-6xl font-extrabold mb-6" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Smart Academic Scheduling
          </motion.h1>
          <motion.p variants={fadeInUp} transition={{ delay: 0.4, duration: 0.8 }} className="text-xl text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
            AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators.
          </motion.p>
          <motion.div variants={fadeInUp} transition={{ delay: 0.5, duration: 0.8 }} className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:shadow-xl hover:-translate-y-0.5" style={{background:'var(--gradient-primary)'}}>Get started</Link>
            <Link to="/contact" className="px-8 py-3 rounded-xl border-2 border-border font-bold text-lg transition hover:border-primary hover:text-primary">See how it works</Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Stats Bar */}
      <AnimatedSection>
        <section className="py-16 px-6 bg-bg-secondary/50">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['10K+','Students'],['500+','Subjects'],['50+','Institutions'],['99.9%','Uptime']].map(([num,label],i) => (
              <motion.div key={i} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl font-extrabold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{num}</div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection>
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-3">What You Get</div>
              <h2 className="text-3xl font-bold">Everything for your institution</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f,i) => (
                <motion.div key={i} variants={scaleIn} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-bg-card border border-border glow-hover">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:'rgba(91,140,192,0.08)'}}>
                    <span className="text-primary">{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection>
        <section className="py-16 px-6 bg-bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Explore</div>
              <h2 className="text-2xl font-bold">Popular Categories</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat,i) => (
                <motion.div key={i} variants={scaleIn} transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl bg-bg-card border border-border glow-hover flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'var(--gradient-primary)'}}>
                    <span className="text-white text-sm font-bold">{cat.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{cat.name}</div>
                    <div className="text-xs text-text-muted">{cat.count}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Testimonials</div>
              <h2 className="text-2xl font-bold">What our users say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t,i) => (
                <motion.div key={i} variants={fadeInUp} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-bg-card border border-border glow-hover">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s}>{icons.star}</span>)}
                  </div>
                  <p className="text-sm text-text-secondary mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{t.name[0]}</div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-text-muted">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection>
        <section className="py-16 px-6 bg-bg-secondary/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-text-secondary mb-8">Join thousands of institutions already using Acaedu.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:shadow-xl" style={{background:'var(--gradient-primary)'}}>Create free account</Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{background:'var(--gradient-primary)'}}>A</div>
            <span className="font-bold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Acaedu</span>
          </div>
          <div className="flex justify-center gap-6 mb-4 text-sm text-text-muted">
            <Link to="/terms" className="hover:text-primary transition">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
          </div>
          <p className="text-xs text-text-muted">© 2026 Acaedu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
// Fri Jun 19 02:25:23 AM WAT 2026
