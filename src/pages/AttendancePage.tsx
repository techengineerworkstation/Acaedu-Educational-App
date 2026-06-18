import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Plus, Users, Clock } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

export function AttendancePage() {
  const [sessions, setSessions] = useState<any[]>([])
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
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">ATTENDANCE</div>
          <h1 className="text-2xl font-bold">Attendance Register</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          <Plus size={16}/> Create Session
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Attendance Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Course ID</label>
              <input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="Course UUID"/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Schedule ID (optional)</label>
              <input value={scheduleId} onChange={e => setScheduleId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="Schedule UUID"/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Window (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create Session</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
              <Users size={20} className="text-primary"/>
            </div>
            <div>
              <div className="text-xl font-bold">{sessions.length}</div>
              <div className="text-xs text-text-muted">Total Records</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-success/10">
              <CheckSquare size={20} className="text-success"/>
            </div>
            <div>
              <div className="text-xl font-bold">{sessions.filter(s => s.status === 'present').length}</div>
              <div className="text-xs text-text-muted">Present</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-danger/10">
              <Clock size={20} className="text-danger"/>
            </div>
            <div>
              <div className="text-xl font-bold">{sessions.filter(s => s.status === 'absent').length}</div>
              <div className="text-xs text-text-muted">Absent</div>
            </div>
          </div>
        </div>
      </div>

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : sessions.length === 0 ? (
        <div className="text-center py-16"><CheckSquare size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No attendance records yet.</p></div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <motion.div key={s.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
              className="p-3 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div>
                <div className="font-medium">{s.student_name || 'Student'}</div>
                <div className="text-xs text-text-muted">{s.course_name || 'Course'} · {s.instance_date}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                s.status === 'present' ? 'bg-success/10 text-success' :
                s.status === 'late' ? 'bg-warning/10 text-warning' :
                'bg-danger/10 text-danger'
              }`}>{s.status}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
