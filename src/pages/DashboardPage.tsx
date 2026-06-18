import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, GraduationCap, ClipboardList, Bell, MapPin, Calendar, Video, BarChart3, TrendingUp } from 'lucide-react'
import { fetchTable } from '../lib/supabase'
import type { User } from '../types'

const statCards = [
  { key: 'subjects', label: 'Active Subjects', icon: BookOpen, color: '#5B8CC0', gradient: 'linear-gradient(135deg,#5B8CC0,#7BAAD4)' },
  { key: 'exams', label: 'Upcoming Exams', icon: FileText, color: '#C9A96E', gradient: 'linear-gradient(135deg,#C9A96E,#D4B87A)' },
  { key: 'lectures', label: 'Lectures This Week', icon: Calendar, color: '#6B9FCC', gradient: 'linear-gradient(135deg,#6B9FCC,#5B8CC0)' },
  { key: 'notifications', label: 'Notifications', icon: Bell, color: '#4CAF70', gradient: 'linear-gradient(135deg,#4CAF70,#6BCB8F)' },
  { key: 'assignments', label: 'Pending Work', icon: ClipboardList, color: '#D4A04A', gradient: 'linear-gradient(135deg,#D4A04A,#E0BD6F)' },
  { key: 'completed', label: 'Completed', icon: GraduationCap, color: '#8B5CF6', gradient: 'linear-gradient(135deg,#8B5CF6,#A78BFA)' },
  { key: 'grade', label: 'Grade Average', icon: TrendingUp, color: '#06B6D4', gradient: 'linear-gradient(135deg,#06B6D4,#67E8F9)' },
  { key: 'sessions', label: 'Live Sessions', icon: Video, color: '#E11D48', gradient: 'linear-gradient(135deg,#E11D48,#FB7185)' },
]

export function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [courses, exams, assignments, notifications] = await Promise.all([
          fetchTable('courses'),
          fetchTable('exams'),
          fetchTable('assignments'),
          fetchTable('notifications'),
        ])
        setStats({
          subjects: courses.length,
          exams: exams.length,
          lectures: 5,
          notifications: notifications.length,
          assignments: assignments.length,
          completed: 2,
          grade: 85.5,
          sessions: 3,
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
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.06}}
              className="p-5 rounded-2xl bg-bg-card border border-border glow-hover relative overflow-hidden"
              style={{borderTop:`3px solid ${card.color}`}}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${card.color}15`}}>
                  <card.icon size={20} style={{color:card.color}}/>
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono" style={{background:card.gradient,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                {typeof stats[card.key] === 'number' && stats[card.key] % 1 !== 0 ? stats[card.key].toFixed(1) + '%' : stats[card.key]}
              </div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{card.label}</div>
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
