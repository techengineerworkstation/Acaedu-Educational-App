import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Plus, Clock, ExternalLink, ClipboardList, User as UserIcon, Mail, Phone, BookOpen } from 'lucide-react'
import { fetchTable, insertRow, updateRow } from '../lib/supabase'
import type { User } from '../types'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }

export function LiveClassesPage() {
  const [meetings, setMeetings] = useState<Record<string, unknown>[]>([])
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
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Live Classes</span>
          <h1 className="section-title mt-2 text-2xl">Live Classes</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={16}/> Schedule Class
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-12,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.35,ease:[0.22,1,0.36,1]}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Schedule Live Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div><label className="label">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="input"/></div>
            <div><label className="label">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input"/></div>
            <div><label className="label">Start Time</label><input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="input"/></div>
            <div><label className="label">Meeting URL</label><input value={roomUrl} onChange={e => setRoomUrl(e.target.value)} className="input" placeholder="https://meet.google.com/..."/></div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Schedule</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-20"/>)}</div>
      ) : meetings.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><Video size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No live classes scheduled.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {meetings.map((m) => (
            <motion.div key={m.id as string} variants={fadeUp}
              whileHover={{x:4,boxShadow:'var(--shadow-sm)'}}
              className="card card-interactive p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-primary) 8%, transparent)'}}>
                  <Video size={20} className="text-[var(--color-primary)]"/>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{m.title as string}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{m.start_time ? new Date(m.start_time as string).toLocaleString() : 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${m.status === 'scheduled' ? 'badge-navy' : 'badge-success'}`}>{m.status as string}</span>
                {m.room_url ? <a href={m.room_url as string} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2"><ExternalLink size={16}/></a> : null}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export function TestsPage() {
  const [tests, setTests] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [testType, setTestType] = useState('quiz')
  const [testDate, setTestDate] = useState('')

  useEffect(() => { fetchTable('tests').then(setTests).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title) return
    await insertRow('tests', { title, course_id: courseId, test_type: testType, test_date: testDate })
    setShowForm(false); setTitle('')
    fetchTable('tests').then(setTests)
  }

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Tests</span>
          <h1 className="section-title mt-2 text-2xl">Tests</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={16}/> Create Test
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-12,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.35,ease:[0.22,1,0.36,1]}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Create Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div><label className="label">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="input"/></div>
            <div><label className="label">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input"/></div>
            <div><label className="label">Type</label>
              <select value={testType} onChange={e => setTestType(e.target.value)} className="select">
                <option value="quiz">Quiz</option><option value="pop_quiz">Pop Quiz</option><option value="practice">Practice</option><option value="assessment">Assessment</option>
              </select>
            </div>
            <div><label className="label">Date</label><input type="datetime-local" value={testDate} onChange={e => setTestDate(e.target.value)} className="input"/></div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Create</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-20"/>)}</div>
      ) : tests.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><ClipboardList size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No tests yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {tests.map((t) => (
            <motion.div key={t.id as string} variants={fadeUp}
              whileHover={{x:4,boxShadow:'var(--shadow-sm)'}}
              className="card card-interactive p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-accent) 10%, transparent)'}}>
                  <ClipboardList size={20} className="text-[var(--color-accent)]"/>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{t.title as string}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{t.test_type as string} · {t.duration_minutes as number} min · {t.test_date ? new Date(t.test_date as string).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
              <span className="badge badge-navy">{t.test_type as string}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export function ClassRecordsPage() {
  const [videos, setVideos] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTable('videos').then(setVideos).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6">
        <span className="section-label">Class Records</span>
        <h1 className="section-title mt-2 text-2xl">Class Records</h1>
      </motion.div>

      {loading ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i) => <motion.div key={i} variants={fadeUp} className="skeleton h-56 rounded-xl"/>)}
        </motion.div>
      ) : videos.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><Video size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No class records yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <motion.div key={v.id as string} variants={fadeUp}
              whileHover={{y:-4,boxShadow:'var(--shadow-card-hover)'}}
              className="card-academic overflow-hidden glow-hover">
              <div className="aspect-video bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-primary) 10%, transparent)'}}>
                  <Video size={24} className="text-[var(--color-primary)]"/>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[var(--color-navy)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{v.title as string}</h3>
                <p className="text-xs text-[var(--color-text-muted)]">{v.description as string}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
                  <Clock size={12}/> {v.duration_seconds ? `${Math.floor((v.duration_seconds as number)/60)}:${String((v.duration_seconds as number)%60).padStart(2,'0')}` : 'N/A'}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export function ProfilePage({ user }: { user: User }) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState({
    full_name: '', phone: '', department: '', faculty: '', bio: '', gender: '', matric_number: '', year_of_study: '',
  })

  useEffect(() => {
    fetchTable('profiles', { id: user.id }).then(p => {
      const data = p[0] || {}
      setProfile(data)
      setForm({
        full_name: (data.full_name as string) || user.full_name || '',
        phone: (data.phone as string) || '',
        department: (data.department as string) || '',
        faculty: (data.faculty as string) || '',
        bio: (data.bio as string) || '',
        gender: (data.gender as string) || '',
        matric_number: (data.matric_number as string) || '',
        year_of_study: (data.year_of_study as string) || '',
      })
    }).finally(() => setLoading(false))
  }, [user.id, user.full_name])

  const handleSave = async () => {
    if (!profile?.id && !user.id) return
    setSaving(true); setSaveMsg('')
    try {
      await updateRow('profiles', (profile?.id as string) || user.id, {
        full_name: form.full_name, phone: form.phone, department: form.department,
        faculty: form.faculty, bio: form.bio, gender: form.gender,
        matric_number: form.matric_number, year_of_study: form.year_of_study,
      })
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false); setSaveMsg('Profile updated successfully.')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Save failed.')
    }
    setSaving(false)
  }

  const field = (key: keyof typeof form, label: string, type: string = 'text', opts?: { value: string; label: string }[]) => (
    <div key={key}>
      <label className="label">{label}</label>
      {editing ? (
        opts ? (
          <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="select">
            <option value="">Select...</option>
            {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input"/>
        )
      ) : (
        <div className="px-3 py-2 rounded-lg bg-[var(--color-cream)] text-sm text-[var(--color-navy)] font-medium min-h-[36px]">
          {form[key] || <span className="text-[var(--color-text-muted)] italic">Not set</span>}
        </div>
      )}
    </div>
  )

  if (loading) return <div className="skeleton h-64"/>

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6 flex items-center justify-between">
        <div>
          <span className="section-label">Profile</span>
          <h1 className="section-title mt-2 text-2xl">My Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setEditing(false)} className="btn-secondary">Cancel</motion.button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Saving...</> : 'Save Changes'}
              </motion.button>
            </>
          ) : (
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>

      {saveMsg && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${saveMsg.includes('success') ? 'badge-success' : 'badge-danger'}`}>
          {saveMsg}
        </motion.div>
      )}

      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="max-w-2xl space-y-5">
        {/* Avatar + identity */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0"
              style={{ fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)' }}>
              {(form.full_name || user.full_name)?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              {editing ? (
                <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="input text-xl font-extrabold w-full" style={{ fontFamily: 'var(--font-display)' }}/>
              ) : (
                <h2 className="text-xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{form.full_name || user.full_name}</h2>
              )}
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{user.email}</p>
              <span className="badge badge-navy capitalize mt-1 inline-block">{user.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('phone', 'Phone', 'tel')}
            {field('gender', 'Gender', 'text', [{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}])}
            {field('department', 'Department')}
            {field('faculty', 'Faculty')}
            {field('matric_number', 'Matric / Staff Number')}
            {field('year_of_study', 'Year of Study')}
          </div>
          <div className="mt-4">
            <label className="label">Bio</label>
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                className="textarea" placeholder="Tell us a bit about yourself..." />
            ) : (
              <div className="px-3 py-2 rounded-lg bg-[var(--color-cream)] text-sm text-[var(--color-navy)] min-h-[60px]">
                {form.bio || <span className="text-[var(--color-text-muted)] italic">No bio yet.</span>}
              </div>
            )}
          </div>
        </div>

        {/* Read-only account info */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="card p-5">
          <h3 className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-display)' }}>Account Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Mail, label: 'Email', value: user.email },
              { icon: UserIcon, label: 'Role', value: user.role },
              { icon: BookOpen, label: 'Member Since', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
              { icon: Phone, label: 'User ID', value: user.id, mono: true },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{scale:1.01}} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-cream)]">
                <item.icon size={16} className="text-[var(--color-navy)] flex-shrink-0"/>
                <div>
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{item.label}</div>
                  <div className={`font-medium text-sm capitalize ${item.mono ? 'font-mono truncate' : ''}`}>{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
