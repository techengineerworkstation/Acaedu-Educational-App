import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

export function ExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [examType, setExamType] = useState('midterm')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('60')

  useEffect(() => { fetchTable('exams').then(setExams).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('exams', { title, course_id: courseId, exam_type: examType, date, duration_minutes: parseInt(duration), total_marks: 100 })
    setShowForm(false); setTitle('')
    fetchTable('exams').then(setExams)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">EXAMS</div><h1 className="text-2xl font-bold">Exams</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}><Plus size={16}/> Create Exam</button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Exam</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Type</label><select value={examType} onChange={e => setExamType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"><option>midterm</option><option>final</option><option>quiz</option></select></div>
            <div><label className="block text-sm text-text-secondary mb-1">Date</label><input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : exams.length === 0 ? (
        <div className="text-center py-16"><FileText size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No exams yet.</p></div>
      ) : (
        <div className="space-y-3">
          {exams.map((e, i) => (
            <motion.div key={e.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div><h3 className="font-bold">{e.title}</h3><p className="text-sm text-text-muted">{e.exam_type} · {e.duration_minutes} min · {e.total_marks} marks</p></div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{e.exam_type}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function GradesPage() {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchTable('grades').then(setGrades).finally(() => setLoading(false)) }, [])
  return (
    <div>
      <div className="mb-6"><div className="text-xs text-text-muted uppercase tracking-wider mb-1">GRADES</div><h1 className="text-2xl font-bold">Grades</h1></div>
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : grades.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No grades yet.</p></div>
      ) : (
        <div className="space-y-3">
          {grades.map((g, i) => (
            <motion.div key={g.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div><h3 className="font-bold">{g.course_name || 'Course'}</h3><p className="text-sm text-text-muted">Score: {g.score}%</p></div>
              <span className="text-2xl font-extrabold font-mono" style={{background:'var(--gradient-mixed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{g.grade_letter || g.score + '%'}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AssignmentsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [courseId, setCourseId] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => { fetchTable('assignments').then(setItems).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('assignments', { title, description: desc, course_id: courseId, due_date: dueDate })
    setShowForm(false); setTitle(''); setDesc('')
    fetchTable('assignments').then(setItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">ASSIGNMENTS</div><h1 className="text-2xl font-bold">Assignments</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}><Plus size={16}/> Create</button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Due Date</label><input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Description</label><input value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No assignments yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((a, i) => (
            <motion.div key={a.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border">
              <h3 className="font-bold">{a.title}</h3>
              <p className="text-sm text-text-muted">{a.description} · Due: {a.due_date || 'No due date'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function NotificationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchTable('notifications').then(setItems).finally(() => setLoading(false)) }, [])
  return (
    <div>
      <div className="mb-6"><div className="text-xs text-text-muted uppercase tracking-wider mb-1">NOTIFICATIONS</div><h1 className="text-2xl font-bold">Notifications</h1></div>
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No notifications yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => (
            <motion.div key={n.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border">
              <h3 className="font-bold">{n.title}</h3>
              <p className="text-sm text-text-muted">{n.body}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function VenuesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('50')
  const [building, setBuilding] = useState('')

  useEffect(() => { fetchTable('venues').then(setItems).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!name) return
    await insertRow('venues', { name, capacity: parseInt(capacity), building })
    setShowForm(false); setName('')
    fetchTable('venues').then(setItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">VENUES</div><h1 className="text-2xl font-bold">Venues</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}><Plus size={16}/> Add Venue</button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Add Venue</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Capacity</label><input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Building</label><input value={building} onChange={e => setBuilding(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No venues yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((v, i) => (
            <motion.div key={v.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="p-5 rounded-2xl bg-bg-card border border-border glow-hover">
              <h3 className="font-bold">{v.name}</h3>
              <p className="text-sm text-text-muted">Capacity: {v.capacity} · {v.building || 'N/A'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function EventsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => { fetchTable('events').then(setItems).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('events', { title, description: desc, location })
    setShowForm(false); setTitle(''); setDesc('')
    fetchTable('events').then(setItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">EVENTS</div><h1 className="text-2xl font-bold">Events</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}><Plus size={16}/> Create Event</button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Location</label><input value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div className="md:col-span-2"><label className="block text-sm text-text-secondary mb-1">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" rows={3}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No events yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((e, i) => (
            <motion.div key={e.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border">
              <h3 className="font-bold">{e.title}</h3>
              <p className="text-sm text-text-muted">{e.description} · {e.location}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SchedulePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [day, setDay] = useState('1')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  useEffect(() => { fetchTable('schedules').then(setItems).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    await insertRow('schedules', { course_id: courseId, day_of_week: parseInt(day), start_time: start, end_time: end })
    setShowForm(false); setCourseId('')
    fetchTable('schedules').then(setItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">SCHEDULE</div><h1 className="text-2xl font-bold">Class Schedule</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}><Plus size={16}/> Add Schedule</button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Add Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Day</label><select value={day} onChange={e => setDay(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"><option value="1">Mon</option><option value="2">Tue</option><option value="3">Wed</option><option value="4">Thu</option><option value="5">Fri</option></select></div>
            <div><label className="block text-sm text-text-secondary mb-1">Start</label><input type="time" value={start} onChange={e => setStart(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">End</label><input type="time" value={end} onChange={e => setEnd(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-muted">No schedules yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((s, i) => (
            <motion.div key={s.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div><h3 className="font-bold">{s.course_name || 'Course'}</h3><p className="text-sm text-text-muted">{['Mon','Tue','Wed','Thu','Fri'][s.day_of_week-1]} · {s.start_time} - {s.end_time}</p></div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Scheduled</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SettingsPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(!dark); localStorage.setItem('theme', dark ? 'light' : 'dark') }
  return (
    <div>
      <div className="mb-6"><div className="text-xs text-text-muted uppercase tracking-wider mb-1">SETTINGS</div><h1 className="text-2xl font-bold">Settings</h1></div>
      <div className="max-w-lg space-y-4">
        <div className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
          <div><h3 className="font-bold">Dark Mode</h3><p className="text-sm text-text-muted">Toggle dark/light theme</p></div>
          <button onClick={toggleDark} className="w-12 h-6 rounded-full bg-border relative transition-colors duration-300" style={{background: dark ? 'var(--color-primary)' : 'var(--color-border)'}}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300" style={{transform: dark ? 'translateX(24px)' : 'translateX(2px)'}}/>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
          <div><h3 className="font-bold">Sound Effects</h3><p className="text-sm text-text-muted">Play sounds on interactions</p></div>
          <button className="w-12 h-6 rounded-full bg-border relative transition-colors duration-300" style={{background:'var(--color-primary)'}}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300" style={{transform:'translateX(24px)'}}/>
          </button>
        </div>
      </div>
    </div>
  )
}
