import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { fetchTable } from '../lib/supabase'
import type { User } from '../types'

// SVG Icons
const icons = {
  book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  file: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  clipboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  video: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
}

const statCards = [
  { key: 'subjects', label: 'Active Subjects', icon: icons.book, color: '#5B8CC0', gradient: 'linear-gradient(135deg,#5B8CC0,#7BAAD4)' },
  { key: 'exams', label: 'Upcoming Exams', icon: icons.file, color: '#C9A96E', gradient: 'linear-gradient(135deg,#C9A96E,#D4B87A)' },
  { key: 'lectures', label: 'Lectures This Week', icon: icons.calendar, color: '#6B9FCC', gradient: 'linear-gradient(135deg,#6B9FCC,#5B8CC0)' },
  { key: 'notifications', label: 'Notifications', icon: icons.bell, color: '#4CAF70', gradient: 'linear-gradient(135deg,#4CAF70,#6BCB8F)' },
  { key: 'assignments', label: 'Pending Work', icon: icons.clipboard, color: '#D4A04A', gradient: 'linear-gradient(135deg,#D4A04A,#E0BD6F)' },
  { key: 'completed', label: 'Completed', icon: icons.check, color: '#8B5CF6', gradient: 'linear-gradient(135deg,#8B5CF6,#A78BFA)' },
  { key: 'grade', label: 'Grade Average', icon: icons.chart, color: '#06B6D4', gradient: 'linear-gradient(135deg,#06B6D4,#67E8F9)' },
  { key: 'sessions', label: 'Live Sessions', icon: icons.video, color: '#E11D48', gradient: 'linear-gradient(135deg,#E11D48,#FB7185)' },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate(v) {
          node.textContent = suffix === '%' ? `${v.toFixed(1)}%` : Math.round(v).toString()
        },
      })
      return () => controls.stop()
    }
  }, [isInView, value, suffix])

  return <span ref={ref}>0</span>
}

export function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [courses, exams, assignments, notifications, grades, schedules] = await Promise.all([
          fetchTable('courses'),
          fetchTable('exams'),
          fetchTable('assignments'),
          fetchTable('notifications'),
          fetchTable('grades'),
          fetchTable('schedules'),
        ])
        const gradeAvg = grades.length > 0
          ? grades.reduce((sum: number, g: any) => sum + (g.score || 0), 0) / grades.length
          : 0
        const completed = grades.filter((g: any) => g.score >= 50).length
        setStats({
          subjects: courses.length,
          exams: exams.length,
          lectures: schedules.length,
          notifications: notifications.length,
          assignments: assignments.length,
          completed,
          grade: gradeAvg,
          sessions: schedules.length,
        })
      } catch { }
      setLoading(false)
    }
    load()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-8">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">WELCOME</div>
        <h1 className="text-2xl font-bold">{greeting()}, {user.full_name}</h1>
        <p className="text-sm text-text-muted mt-1 capitalize">{user.role} Dashboard</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i) => <div key={i} className="h-28 rounded-2xl bg-bg-secondary animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{opacity:0,y:20,scale:0.95}}
              animate={{opacity:1,y:0,scale:1}}
              transition={{delay:i*0.08, duration:0.5, ease:'easeOut'}}
              whileHover={{y:-4, scale:1.02}}
              className="p-5 rounded-2xl bg-bg-card border border-border relative overflow-hidden cursor-default"
              style={{borderTop:`3px solid ${card.color}`}}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{background:`radial-gradient(circle at 50% 50%, ${card.color}08, transparent 70%)`}}/>
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <motion.div 
                  initial={{scale:0}} 
                  animate={{scale:1}} 
                  transition={{delay:i*0.08+0.3, type:'spring', stiffness:300}}
                  className="w-10 h-10 rounded-xl flex items-center justify-center" 
                  style={{background:`${card.color}15`}}
                >
                  <span style={{color:card.color}}>{card.icon}</span>
                </motion.div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-extrabold font-mono" style={{background:card.gradient,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  <AnimatedCounter value={stats[card.key] || 0} suffix={card.key === 'grade' ? '%' : ''}/>
                </div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{card.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.5}} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Recent Activity</div>
          <div className="text-sm text-text-muted">No recent activity to display.</div>
        </motion.div>
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.6}} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Upcoming Deadlines</div>
          <div className="text-sm text-text-muted">No upcoming deadlines.</div>
        </motion.div>
      </div>
    </div>
  )
}
