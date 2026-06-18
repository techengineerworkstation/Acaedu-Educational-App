import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, BarChart3, Bell, Shield, Sparkles } from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Subject Management', desc: 'Organize courses, materials, and schedules.' },
  { icon: GraduationCap, title: 'Exam & Grades', desc: 'Track exams, tests, assignments, and grades.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Real-time alerts for deadlines and announcements.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual charts for academic performance.' },
  { icon: Sparkles, title: 'AI Assistant', desc: 'Intelligent summaries and suggestions.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="max-w-2xl">
          <div className="text-xs tracking-[0.2em] text-text-muted uppercase mb-6">Smart Academic Platform</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Smart Academic Scheduling
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
            AI-powered scheduling, real-time notifications, and seamless collaboration for students, lecturers, and administrators.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:shadow-xl hover:-translate-y-0.5" style={{background:'var(--gradient-primary)'}}>Get started</Link>
            <Link to="/contact" className="px-8 py-3 rounded-xl border-2 border-border font-bold text-lg transition hover:border-primary hover:text-primary">See how it works</Link>
          </div>
        </motion.div>
      </main>

      <section className="py-16 px-6 bg-bg-secondary/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['10K+','Students'],['500+','Courses'],['50+','Institutions'],['99.9%','Uptime']].map(([num,label],i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <div className="text-3xl font-extrabold" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{num}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-3">What You Get</div>
            <h2 className="text-3xl font-bold">Everything for your institution</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                className="p-6 rounded-2xl bg-bg-card border border-border glow-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:'rgba(91,140,192,0.08)'}}>
                  <f.icon size={24} className="text-primary"/>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border text-center text-xs text-text-muted">
        © 2026 THB Tech Engineer Workplace
      </footer>
    </div>
  )
}
