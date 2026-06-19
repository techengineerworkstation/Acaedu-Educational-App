import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }
const scaleIn = { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } }
const slideLeft = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } }
const slideRight = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeInUp} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }} className={className}>
      {children}
    </motion.div>
  )
}

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
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
}

const features = [
  { icon: icons.book, title: 'Subject Management', desc: 'Organize subjects, materials, and schedules in one place.', color: '#5B8CC0' },
  { icon: icons.chart, title: 'Grade Tracking', desc: 'Real-time grade updates with performance analytics.', color: '#4CAF70' },
  { icon: icons.video, title: 'Live Classes', desc: 'Integrated video conferencing for virtual lectures.', color: '#7B68EE' },
  { icon: icons.bell, title: 'Smart Notifications', desc: 'Context-aware alerts for deadlines and announcements.', color: '#D4A04A' },
  { icon: icons.zap, title: 'AI Assistant', desc: 'Intelligent summaries, suggestions, and lecture analysis.', color: '#C9A96E' },
  { icon: icons.shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access control.', color: '#D44333' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Student', quote: 'Acaedu transformed how I manage my studies. The notifications keep me on track with every deadline.' },
  { name: 'Dr. James K.', role: 'Lecturer', quote: 'Managing attendance and grades has never been easier. The AI summaries save me hours every week.' },
  { name: 'Prof. Amina H.', role: 'Administrator', quote: 'The analytics dashboard gives us real-time insights into student performance across all departments.' },
]

const categories = [
  { name: 'Artificial Intelligence', count: '25+ subjects', emoji: '🤖' },
  { name: 'Data Science', count: '30+ subjects', emoji: '📊' },
  { name: 'Business', count: '40+ subjects', emoji: '💼' },
  { name: 'Healthcare', count: '20+ subjects', emoji: '🏥' },
  { name: 'Engineering', count: '35+ subjects', emoji: '⚙️' },
  { name: 'Computer Science', count: '45+ subjects', emoji: '💻' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/70 border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30" style={{background:'var(--gradient-primary)'}}>A</div>
          <span className="text-xl font-extrabold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Acaedu</span>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/login" className="px-5 py-2.5 text-sm rounded-xl border-2 border-primary/20 text-primary font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all">Log in</Link>
          <Link to="/register" className="px-5 py-2.5 text-sm rounded-xl text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" style={{background:'var(--gradient-primary)'}}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{animationDelay:'1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.9 }} className="relative z-10 max-w-3xl">
          <motion.div variants={scaleIn} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-primary">Smart Academic Platform</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} transition={{ delay: 0.3, duration: 0.9 }} className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="metallic-text">Smart Academic</span>
            <br />
            <span className="text-text">Scheduling</span>
          </motion.h1>

          <motion.p variants={fadeInUp} transition={{ delay: 0.45, duration: 0.8 }} className="text-lg md:text-xl text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed">
            AI-powered scheduling, real-time notifications, and seamless collaboration for <span className="text-primary font-semibold">students</span>, <span className="secondary font-semibold" style={{color:'#C9A96E'}}>lecturers</span>, and <span className="text-accent font-semibold">administrators</span>.
          </motion.p>

          <motion.div variants={fadeInUp} transition={{ delay: 0.6, duration: 0.8 }} className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="group flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all" style={{background:'var(--gradient-primary)'}}>
              Get started {icons.arrow}
            </Link>
            <Link to="/contact" className="flex items-center gap-2 px-10 py-4 rounded-2xl border-2 border-border font-bold text-lg text-text-secondary hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all">
              See how it works
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeInUp} transition={{ delay: 0.8 }} className="mt-12 flex items-center justify-center gap-6 text-text-muted text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-success">✓</span> Free to start
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-success">✓</span> No credit card needed
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-success">✓</span> Setup in 2 minutes
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Stats Bar */}
      <AnimatedSection>
        <section className="py-16 px-6 relative overflow-hidden" style={{background:'linear-gradient(135deg, #5B8CC0 0%, #3D6A9E 50%, #C9A96E 100%)'}}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[['10K+','Students'],['500+','Subjects'],['50+','Institutions'],['99.9%','Uptime']].map(([num,label],i) => (
              <motion.div key={i} variants={scaleIn} transition={{ delay: i * 0.15, type: 'spring' }}>
                <div className="text-4xl md:text-5xl font-black text-white mb-1">{num}</div>
                <div className="text-xs text-white/70 uppercase tracking-widest font-semibold">{label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection>
        <section className="py-24 px-6 bg-gradient-to-b from-white to-bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/15 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-primary">What You Get</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-text">Everything for your institution</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f,i) => (
                <motion.div key={i} variants={slideLeft} transition={{ delay: i * 0.1 }}
                  className="group p-7 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110" style={{background:`linear-gradient(135deg, ${f.color}20, ${f.color}40)`}}>
                    <span style={{color:f.color}}>{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-text">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection>
        <section className="py-20 px-6 bg-bg-secondary/40">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase" style={{color:'#C9A96E'}}>Explore</span>
              </div>
              <h2 className="text-3xl font-black text-text">Popular Categories</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {categories.map((cat,i) => (
                <motion.div key={i} variants={scaleIn} transition={{ delay: i * 0.08, type: 'spring' }}
                  className="group p-5 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer">
                  <div className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</div>
                  <div>
                    <div className="font-bold text-sm text-text">{cat.name}</div>
                    <div className="text-xs text-text-muted font-medium">{cat.count}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className="py-24 px-6 bg-gradient-to-b from-bg-secondary/30 to-white">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/20 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-warning">Testimonials</span>
              </div>
              <h2 className="text-3xl font-black text-text">What our users say</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.map((t,i) => (
                <motion.div key={i} variants={slideRight} transition={{ delay: i * 0.15 }}
                  className="p-7 rounded-2xl bg-white border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <span key={s}>{icons.star}</span>)}
                  </div>
                  <p className="text-sm text-text-secondary mb-5 italic leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md" style={{background:'var(--gradient-primary)'}}>{t.name[0]}</div>
                    <div>
                      <div className="text-sm font-bold text-text">{t.name}</div>
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
        <section className="py-20 px-6 relative overflow-hidden" style={{background:'linear-gradient(135deg, #5B8CC0 0%, #C9A96E 100%)'}}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5">Ready to get started?</h2>
            <p className="text-white/80 mb-10 text-lg">Join thousands of institutions already using Acaedu.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Create free account {icons.arrow}
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-10 px-6 bg-text border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg" style={{background:'var(--gradient-primary)'}}>A</div>
            <span className="text-lg font-extrabold text-white">Acaedu</span>
          </div>
          <div className="flex justify-center gap-8 mb-5 text-sm text-white/50">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-white/30 text-center">© 2026 Acaedu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
// Fri Jun 19 02:25:23 AM WAT 2026
// Build timestamp: 1781832594
