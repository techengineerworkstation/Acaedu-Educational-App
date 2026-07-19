import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'
import { sendEmail, announcementEmail } from '../lib/email'

const priorityConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  low: { color: 'text-[var(--color-navy)]', bg: 'bg-[var(--color-navy)]/8', icon: Info },
  normal: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', icon: Megaphone },
  high: { color: 'text-warning', bg: 'bg-warning/10', icon: AlertTriangle },
  urgent: { color: 'text-[var(--color-danger)]', bg: 'bg-danger/10', icon: AlertCircle },
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-[0.15em] mb-1">Announcements</div>
          <h1 className="text-2xl font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Announcements</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 rounded-lg bg-[var(--color-navy)] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[var(--color-navy)]-light transition-all shadow-sm">
          <Plus size={16}/> Create Announcement
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <h3 className="font-bold text-[var(--color-navy)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Create Announcement</h3>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Announcement title"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition resize-none" rows={4} placeholder="Announcement content..."/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Course ID (optional)</label>
                <input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] text-sm outline-none focus:border-[var(--color-navy)] transition" placeholder="Link to course"/>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-[var(--color-navy)] text-white font-semibold text-sm hover:bg-[var(--color-navy)]-light transition-all">Publish</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-cream)] transition">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-[var(--color-bg-secondary)]/50 rounded-xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16"><Megaphone size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]"/><p className="text-[var(--color-text-muted)]">No announcements yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((a, i) => {
            const config = priorityConfig[(a.priority as string)] || priorityConfig.normal
            const Icon = config.icon
            return (
              <motion.div key={a.id as string} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-navy)]/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                    <Icon size={20} className={config.color}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{a.title as string}</h3>
                      <span className={`text-xs px-2 py-1 rounded-md ${config.bg} ${config.color} font-medium`}>{a.priority as string}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{a.content as string}</p>
                    <div className="text-xs text-[var(--color-text-muted)] mt-2">{a.created_at ? new Date(a.created_at as string).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
