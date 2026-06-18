import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Plus, Clock, ExternalLink, ClipboardList, User as UserIcon, Mail, Phone, BookOpen } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

// Live Classes Page
export function LiveClassesPage() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [roomUrl, setRoomUrl] = useState('')

  useEffect(() => { fetchTable('meetings').then(setMeetings).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('meetings', { title, course_id: courseId, start_time: startTime, room_url: roomUrl, status: 'scheduled' })
    setShowForm(false); setTitle('')
    fetchTable('meetings').then(setMeetings)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">LIVE CLASSES</div><h1 className="text-2xl font-bold">Live Classes</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          <Plus size={16}/> Schedule Class
        </button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Schedule Live Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Start Time</label><input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Meeting URL</label><input value={roomUrl} onChange={e => setRoomUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="https://meet.google.com/..."/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Schedule</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : meetings.length === 0 ? (
        <div className="text-center py-16"><Video size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No live classes scheduled.</p></div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m, i) => (
            <motion.div key={m.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">{m.title}</h3>
                <p className="text-sm text-text-muted">{m.start_time ? new Date(m.start_time).toLocaleString() : 'TBD'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${m.status === 'scheduled' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>{m.status}</span>
                {m.room_url && <a href={m.room_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 transition"><ExternalLink size={16}/></a>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Tests Page
export function TestsPage() {
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [testType, setTestType] = useState('quiz')
  const [testDate, setTestDate] = useState('')
  const [duration, _setDuration] = useState('30')

  useEffect(() => { fetchTable('tests').then(setTests).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('tests', { title, course_id: courseId, test_type: testType, test_date: testDate, duration_minutes: parseInt(duration) })
    setShowForm(false); setTitle('')
    fetchTable('tests').then(setTests)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">TESTS</div><h1 className="text-2xl font-bold">Tests</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          <Plus size={16}/> Create Test
        </button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Type</label>
              <select value={testType} onChange={e => setTestType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none">
                <option value="quiz">Quiz</option><option value="pop_quiz">Pop Quiz</option><option value="practice">Practice</option><option value="assessment">Assessment</option>
              </select>
            </div>
            <div><label className="block text-sm text-text-secondary mb-1">Date</label><input type="datetime-local" value={testDate} onChange={e => setTestDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : tests.length === 0 ? (
        <div className="text-center py-16"><ClipboardList size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No tests yet.</p></div>
      ) : (
        <div className="space-y-3">
          {tests.map((t, i) => (
            <motion.div key={t.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div><h3 className="font-bold">{t.title}</h3><p className="text-sm text-text-muted">{t.test_type} · {t.duration_minutes} min · {t.test_date ? new Date(t.test_date).toLocaleDateString() : 'TBD'}</p></div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t.test_type}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Class Records Page (combines lecture videos)
export function ClassRecordsPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTable('videos').then(setVideos).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="mb-6"><div className="text-xs text-text-muted uppercase tracking-wider mb-1">CLASS RECORDS</div><h1 className="text-2xl font-bold">Class Records</h1></div>
      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : videos.length === 0 ? (
        <div className="text-center py-16"><Video size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No class records yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <motion.div key={v.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="rounded-2xl bg-bg-card border border-border overflow-hidden glow-hover">
              <div className="aspect-video bg-bg-secondary flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center"><Video size={24} className="text-primary"/></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{v.title}</h3>
                <p className="text-xs text-text-muted">{v.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <Clock size={12}/> {v.duration_seconds ? `${Math.floor(v.duration_seconds/60)}:${String(v.duration_seconds%60).padStart(2,'0')}` : 'N/A'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Profile Page
export function ProfilePage({ user }: { user: any }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTable('profiles', { id: user.id }).then(p => setProfile(p[0] || {})).finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <div className="h-64 bg-bg-secondary rounded-2xl animate-pulse"/>

  return (
    <div>
      <div className="mb-6"><div className="text-xs text-text-muted uppercase tracking-wider mb-1">PROFILE</div><h1 className="text-2xl font-bold">My Profile</h1></div>
      <div className="max-w-2xl">
        <div className="p-6 rounded-2xl bg-bg-card border border-border mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">{user.full_name?.[0] || '?'}</div>
            <div>
              <h2 className="text-xl font-bold">{user.full_name}</h2>
              <p className="text-sm text-text-muted">{user.email}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize mt-1 inline-block">{user.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary">
              <Mail size={18} className="text-primary"/>
              <div><div className="text-xs text-text-muted">Email</div><div className="font-medium">{user.email}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary">
              <Phone size={18} className="text-primary"/>
              <div><div className="text-xs text-text-muted">Phone</div><div className="font-medium">{profile?.phone || 'Not set'}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary">
              <BookOpen size={18} className="text-primary"/>
              <div><div className="text-xs text-text-muted">Department</div><div className="font-medium">{profile?.department || 'Not set'}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary">
              <UserIcon size={18} className="text-primary"/>
              <div><div className="text-xs text-text-muted">Role</div><div className="font-medium capitalize">{user.role}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
