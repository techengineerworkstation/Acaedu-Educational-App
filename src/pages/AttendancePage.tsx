import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Plus, Users, Clock } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Attendance</div>
          <h1 className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Attendance Register</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 rounded-lg bg-[var(--color-navy)] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[var(--color-navy)]-light transition-all shadow-sm">
          <Plus size={16}/> Create Session
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <h3 className="font-bold text-[var(--color-navy)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Create Attendance Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Course ID</label>
              <input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Course UUID"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Schedule ID (optional)</label>
              <input value={scheduleId} onChange={e => setScheduleId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Schedule UUID"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Window (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-[var(--color-navy)] text-white font-semibold text-sm hover:bg-[var(--color-navy)]-light transition-all">Create Session</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-cream)] transition">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-navy)]/8">
              <Users size={20} className="text-[var(--color-navy)]"/>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{sessions.length}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-medium">Total Records</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-success)]/10">
              <CheckSquare size={20} className="text-[var(--color-success)]"/>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{sessions.filter(s => s.status === 'present').length}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-medium">Present</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-danger/10">
              <Clock size={20} className="text-[var(--color-danger)]"/>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{sessions.filter(s => s.status === 'absent').length}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-medium">Absent</div>
            </div>
          </div>
        </div>
      </div>

      {loading ? <div className="h-32 bg-[var(--color-bg-secondary)]/50 rounded-xl animate-pulse"/> : sessions.length === 0 ? (
        <div className="text-center py-16"><CheckSquare size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]"/><p className="text-[var(--color-text-muted)]">No attendance records yet.</p></div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <motion.div key={s.id as string} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
              className="p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex justify-between items-center hover:border-[var(--color-navy)]/20 transition-all">
              <div>
                <div className="font-medium text-sm text-[var(--color-navy)]">{(s.student_name as string) || 'Student'}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{(s.course_name as string) || 'Course'} · {s.instance_date as string}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                s.status === 'present' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' :
                s.status === 'late' ? 'bg-warning/10 text-warning' :
                'bg-danger/10 text-[var(--color-danger)]'
              }`}>{s.status as string}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
