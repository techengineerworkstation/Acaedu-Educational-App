import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'
import { sendEmail, announcementEmail } from '../lib/email'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }

const priorityConfig: Record<string, { badge: string; bg: string; iconClass: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  low:    { badge: 'badge-navy',    bg: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', iconClass: 'text-[var(--color-primary)]', icon: Info },
  normal: { badge: 'badge-success', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)', iconClass: 'text-[var(--color-success)]', icon: Megaphone },
  high:   { badge: 'badge-warning', bg: 'color-mix(in srgb, var(--color-warning) 8%, transparent)', iconClass: 'text-[var(--color-warning)]', icon: AlertTriangle },
  urgent: { badge: 'badge-danger',  bg: 'color-mix(in srgb, var(--color-danger) 8%, transparent)', iconClass: 'text-[var(--color-danger)]', icon: AlertCircle },
}

export function AnnouncementsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('normal')
  const [courseId, setCourseId] = useState('')

  useEffect(() => { fetchTable('announcements').then(setItems).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title || !content) return
    const data = await insertRow('announcements', {
      title, content, priority,
      course_id: courseId || null,
    })
    setShowForm(false); setTitle(''); setContent('')

    if (data && courseId) {
      try {
        const enrollments = await fetchTable('enrollments', { course_id: courseId, status: 'active' })
        for (const enrollment of enrollments) {
          const profiles = await fetchTable('profiles', { id: enrollment.student_id })
          const profile = profiles[0]
          if (profile?.email) {
            const { subject, html } = announcementEmail(profile.full_name || 'Student', title, content.substring(0, 200))
            await sendEmail({ to: profile.email, subject, html })
          }
        }
      } catch (err) { console.error('Email error:', err) }
    }

    fetchTable('announcements').then(setItems)
  }

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Announcements</span>
          <h1 className="section-title mt-1">Announcements</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={16}/> Create Announcement
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-8,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.25}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Create Announcement</h3>
          <div className="space-y-4 mb-5">
            <div><label className="label">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Announcement title"/></div>
            <div><label className="label">Content</label><textarea value={content} onChange={e => setContent(e.target.value)} className="textarea" rows={4} placeholder="Announcement content..."/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="select">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div><label className="label">Course ID (optional)</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input" placeholder="Link to course"/></div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Publish</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-20"/>)}
        </div>
      ) : items.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><Megaphone size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No announcements yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {items.map((a) => {
            const config = priorityConfig[(a.priority as string)] || priorityConfig.normal
            const Icon = config.icon
            return (
              <motion.div key={a.id as string} variants={fadeUp}
                className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:config.bg}}>
                    <Icon size={20} className={config.iconClass}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{a.title as string}</h3>
                      <span className={`badge ${config.badge} flex-shrink-0`}>{a.priority as string}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{a.content as string}</p>
                    <div className="text-xs text-[var(--color-text-muted)] mt-2">{a.created_at ? new Date(a.created_at as string).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
