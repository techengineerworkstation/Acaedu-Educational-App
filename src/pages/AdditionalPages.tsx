import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Plus, Clock, ExternalLink, ClipboardList, User as UserIcon, Mail, Phone, BookOpen } from 'lucide-react'
import { fetchTable, insertRow, updateRow } from '../lib/supabase'
import type { User } from '../types'

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Live Classes</div>
          <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Live Classes</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 rounded-lg bg-navy text-white font-semibold text-sm flex items-center gap-2 hover:bg-navy-light transition-all shadow-sm">
          <Plus size={16}/> Schedule Class
        </button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-xl bg-white border border-beige">
          <h3 className="font-bold text-navy mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Schedule Live Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Start Time</label><input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Meeting URL</label><input value={roomUrl} onChange={e => setRoomUrl(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition" placeholder="https://meet.google.com/..."/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-all">Schedule</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-beige text-sm font-medium hover:bg-cream transition">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-beige/50 rounded-xl animate-pulse"/> : meetings.length === 0 ? (
        <div className="text-center py-16"><Video size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No live classes scheduled.</p></div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m, i) => (
            <motion.div key={m.id as string} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="p-4 rounded-xl bg-white border border-beige flex justify-between items-center hover:border-navy/20 transition-all">
              <div>
                <h3 className="font-bold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.title as string}</h3>
                <p className="text-sm text-text-muted">{m.start_time ? new Date(m.start_time as string).toLocaleString() : 'TBD'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${m.status === 'scheduled' ? 'bg-navy/8 text-navy' : 'bg-success/10 text-success'}`}>{m.status as string}</span>
                {m.room_url ? <a href={m.room_url as string} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-navy/5 transition text-navy/60 hover:text-navy"><ExternalLink size={16}/></a> : null}
              </div>
            </motion.div>
          ))}
        </div>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Tests</div>
          <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Tests</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 rounded-lg bg-navy text-white font-semibold text-sm flex items-center gap-2 hover:bg-navy-light transition-all shadow-sm">
          <Plus size={16}/> Create Test
        </button>
      </div>
      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-xl bg-white border border-beige">
          <h3 className="font-bold text-navy mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Create Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Type</label>
              <select value={testType} onChange={e => setTestType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition">
                <option value="quiz">Quiz</option><option value="pop_quiz">Pop Quiz</option><option value="practice">Practice</option><option value="assessment">Assessment</option>
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Date</label><input type="datetime-local" value={testDate} onChange={e => setTestDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-all">Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-beige text-sm font-medium hover:bg-cream transition">Cancel</button>
          </div>
        </motion.div>
      )}
      {loading ? <div className="h-32 bg-beige/50 rounded-xl animate-pulse"/> : tests.length === 0 ? (
        <div className="text-center py-16"><ClipboardList size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No tests yet.</p></div>
      ) : (
        <div className="space-y-3">
          {tests.map((t, i) => (
            <motion.div key={t.id as string} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="p-4 rounded-xl bg-white border border-beige flex justify-between items-center hover:border-navy/20 transition-all">
              <div><h3 className="font-bold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{t.title as string}</h3><p className="text-sm text-text-muted">{t.test_type as string} · {t.duration_minutes as number} min · {t.test_date ? new Date(t.test_date as string).toLocaleDateString() : 'TBD'}</p></div>
              <span className="text-xs px-2 py-1 rounded-md bg-navy/8 text-navy font-medium">{t.test_type as string}</span>
            </motion.div>
          ))}
        </div>
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
      <div className="mb-6">
        <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Class Records</div>
        <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Class Records</h1>
      </div>
      {loading ? <div className="h-32 bg-beige/50 rounded-xl animate-pulse"/> : videos.length === 0 ? (
        <div className="text-center py-16"><Video size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No class records yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <motion.div key={v.id as string} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="rounded-xl bg-white border border-beige overflow-hidden hover:border-navy/20 hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-cream flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center"><Video size={24} className="text-navy"/></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-navy mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{v.title as string}</h3>
                <p className="text-xs text-text-muted">{v.description as string}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <Clock size={12}/> {v.duration_seconds ? `${Math.floor((v.duration_seconds as number)/60)}:${String((v.duration_seconds as number)%60).padStart(2,'0')}` : 'N/A'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
    full_name: '',
    phone: '',
    department: '',
    faculty: '',
    bio: '',
    gender: '',
    matric_number: '',
    year_of_study: '',
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
        full_name: form.full_name,
        phone: form.phone,
        department: form.department,
        faculty: form.faculty,
        bio: form.bio,
        gender: form.gender,
        matric_number: form.matric_number,
        year_of_study: form.year_of_study,
      })
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false)
      setSaveMsg('Profile updated successfully.')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Save failed.')
    }
    setSaving(false)
  }

  const field = (key: keyof typeof form, label: string, type: string = 'text', opts?: { value: string; label: string }[]) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</label>
      {editing ? (
        opts ? (
          <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition">
            <option value="">Select...</option>
            {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition" />
        )
      ) : (
        <div className="px-3 py-2 rounded-lg bg-cream text-sm text-navy font-medium min-h-[36px]">
          {form[key] || <span className="text-text-muted italic">Not set</span>}
        </div>
      )}
    </div>
  )

  if (loading) return <div className="h-64 bg-beige/50 rounded-xl animate-pulse"/>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-gold uppercase tracking-[0.15em] mb-1">Profile</div>
          <h1 className="text-2xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>My Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-beige text-sm font-medium hover:bg-cream transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy/90 transition flex items-center gap-2">
                {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Saving...</> : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg border border-beige text-sm font-medium hover:bg-cream transition flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {saveMsg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${saveMsg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {saveMsg}
        </motion.div>
      )}

      <div className="max-w-2xl space-y-5">
        {/* Avatar + identity */}
        <div className="p-6 rounded-xl bg-white border border-beige">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-3xl flex-shrink-0"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {(form.full_name || user.full_name)?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              {editing ? (
                <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="text-xl font-extrabold text-navy w-full px-2 py-1 rounded-lg border border-beige bg-cream outline-none focus:border-navy transition"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
              ) : (
                <h2 className="text-xl font-extrabold text-navy" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{form.full_name || user.full_name}</h2>
              )}
              <p className="text-sm text-text-muted mt-0.5">{user.email}</p>
              <span className="text-xs px-2 py-1 rounded-md bg-navy/8 text-navy font-medium capitalize mt-1 inline-block">{user.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('phone', 'Phone', 'tel')}
            {field('gender', 'Gender', 'text', [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other / Prefer not to say' },
            ])}
            {field('department', 'Department')}
            {field('faculty', 'Faculty')}
            {field('matric_number', 'Matric / Staff Number')}
            {field('year_of_study', 'Year of Study')}
          </div>

          {/* Bio */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Bio</label>
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                className="w-full px-3 py-2 rounded-lg border border-beige bg-cream text-sm outline-none focus:border-navy transition resize-none"
                placeholder="Tell us a bit about yourself..." />
            ) : (
              <div className="px-3 py-2 rounded-lg bg-cream text-sm text-navy min-h-[60px]">
                {form.bio || <span className="text-text-muted italic">No bio yet.</span>}
              </div>
            )}
          </div>
        </div>

        {/* Read-only account info */}
        <div className="p-5 rounded-xl bg-white border border-beige">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">Account Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              <Mail size={16} className="text-navy flex-shrink-0"/>
              <div><div className="text-[10px] text-text-muted uppercase tracking-wider">Email</div><div className="font-medium text-sm">{user.email}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              <UserIcon size={16} className="text-navy flex-shrink-0"/>
              <div><div className="text-[10px] text-text-muted uppercase tracking-wider">Role</div><div className="font-medium text-sm capitalize">{user.role}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              <BookOpen size={16} className="text-navy flex-shrink-0"/>
              <div><div className="text-[10px] text-text-muted uppercase tracking-wider">Member Since</div>
                <div className="font-medium text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              <Phone size={16} className="text-navy flex-shrink-0"/>
              <div><div className="text-[10px] text-text-muted uppercase tracking-wider">User ID</div><div className="font-medium text-[11px] font-mono truncate">{user.id}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
