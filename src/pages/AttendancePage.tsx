import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Plus, Users, Clock } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }

export function AttendancePage() {
  const [sessions, setSessions] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [scheduleId, setScheduleId] = useState('')
  const [duration, setDuration] = useState('60')

  useEffect(() => { fetchTable('attendance').then(setSessions).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!courseId) return
    await insertRow('attendance', {
      course_id: courseId,
      schedule_id: scheduleId || null,
      instance_date: new Date().toISOString().split('T')[0],
      status: 'present',
    })
    setShowForm(false); setCourseId('')
    fetchTable('attendance').then(setSessions)
  }

  const statCards = [
    { label: 'Total Records', value: sessions.length, icon: Users, bg: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', iconColor: 'var(--color-primary)' },
    { label: 'Present', value: sessions.filter(s => s.status === 'present').length, icon: CheckSquare, bg: 'rgba(27,122,66,0.08)', iconColor: 'var(--color-success)' },
    { label: 'Absent', value: sessions.filter(s => s.status === 'absent').length, icon: Clock, bg: 'color-mix(in srgb, var(--color-danger) 8%, transparent)', iconColor: 'var(--color-danger)' },
  ]

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Attendance</span>
          <h1 className="section-title mt-2 text-2xl">Attendance Register</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={16}/> Create Session
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-12,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.35,ease:[0.22,1,0.36,1]}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Create Attendance Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div><label className="label">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input" placeholder="Course UUID"/></div>
            <div><label className="label">Schedule ID (optional)</label><input value={scheduleId} onChange={e => setScheduleId(e.target.value)} className="input" placeholder="Schedule UUID"/></div>
            <div><label className="label">Window (minutes)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="input"/></div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Create Session</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((s, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{y:-2}} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:s.bg}}>
                <s.icon size={20} style={{color:s.iconColor}}/>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-16"/>)}
        </div>
      ) : sessions.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><CheckSquare size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No attendance records yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {sessions.map((s) => (
            <motion.div key={s.id as string} variants={fadeUp}
              whileHover={{x:4,boxShadow:'var(--shadow-sm)'}}
              className="card card-interactive p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-[var(--color-navy)] font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>
                  {((s.student_name as string) || 'S')[0]}
                </div>
                <div>
                  <div className="font-medium text-sm text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{(s.student_name as string) || 'Student'}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{(s.course_name as string) || 'Course'} · {s.instance_date as string}</div>
                </div>
              </div>
              <span className={`badge ${
                s.status === 'present' ? 'badge-success' :
                s.status === 'late' ? 'badge-warning' :
                'badge-danger'
              }`}>{s.status as string}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
