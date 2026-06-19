import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
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

const categories = [
  'Artificial Intelligence', 'Data Science', 'Business',
  'Healthcare', 'Engineering', 'Computer Science'
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav - Ultra minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-text flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Acaedu</span>
          </Link>
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-sm text-text-secondary hover:text-text transition-colors">Features</a>
            <a href="#categories" className="text-sm text-text-secondary hover:text-text transition-colors">Categories</a>
            <a href="#testimonials" className="text-sm text-text-secondary hover:text-text transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-text text-white text-sm font-medium rounded-full hover:bg-text/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Minimal with large type */}
      <main className="pt-20">
        <section className="min-h-[90vh] flex items-center">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-4xl"
            >
              <motion.div variants={fadeInUp} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-text-muted border border-border rounded-full mb-8">
                  Smart Academic Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-10"
              >
                <span className="block">Smart</span>
                <span className="block text-text-muted">Academic</span>
                <span className="block">Scheduling</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed mb-12"
              >
                AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex items-center gap-6"
              >
                <Link to="/register" className="group flex items-center gap-3 px-8 py-4 bg-text text-white font-medium rounded-full hover:bg-text/90 transition-all">
                  Get started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/contact" className="text-sm font-medium text-text-secondary hover:text-text transition-colors underline underline-offset-4">
                  See how it works
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats - Minimal divider */}
        <Section className="py-24 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                ['10K+', 'Students'],
                ['500+', 'Subjects'],
                ['50+', 'Institutions'],
                ['99.9%', 'Uptime']
              ].map(([num, label], i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{num}</div>
                  <div className="text-sm text-text-muted uppercase tracking-widest">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Features - Numbered list style */}
        <Section id="features" className="py-32 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <motion.div variants={fadeInUp} className="mb-20">
              <span className="text-xs font-medium tracking-widest uppercase text-text-muted">What You Get</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">Everything for your institution</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group"
                >
                  <div className="text-xs font-mono text-text-muted mb-4">{f.num}</div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Categories - Horizontal scroll style */}
        <Section id="categories" className="py-32 bg-bg-secondary/30 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <motion.div variants={fadeInUp} className="mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-text-muted">Explore</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">Popular Categories</h2>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="px-8 py-4 bg-white border border-border rounded-full hover:border-text hover:bg-text hover:text-white transition-all cursor-pointer group"
                >
                  <span className="text-sm font-medium">{cat}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials - Clean cards */}
        <Section id="testimonials" className="py-32 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <motion.div variants={fadeInUp} className="mb-20">
              <span className="text-xs font-medium tracking-widest uppercase text-text-muted">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">What our users say</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-8 bg-bg-secondary/30 rounded-2xl border border-border hover:border-text/20 transition-colors"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-8">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-text flex items-center justify-center text-white font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-text-muted">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA - Bold and minimal */}
        <Section className="py-32 bg-text border-t border-border">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 text-center">
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 mb-12 max-w-md mx-auto"
            >
              Join thousands of institutions already using Acaedu.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-text font-medium rounded-full hover:bg-white/90 transition-colors text-lg">
                Create free account
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* Footer - Ultra minimal */}
        <footer className="py-16 bg-text border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-white font-semibold">Acaedu</span>
              </div>
              <div className="flex items-center gap-8">
                <Link to="/terms" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link>
                <Link to="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
              </div>
              <p className="text-sm text-white/30">© 2026 Acaedu. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
// Redeploy Fri Jun 19 06:55:10 AM WAT 2026
