import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchTable, insertRow, updateRow, deleteRow } from '../lib/supabase'

// SVG Icons
const icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  file: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  clipboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  mapPin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  video: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  megaphone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  sun: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
}

// ─── Delete Confirmation Modal ──────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
          className="bg-bg-card rounded-2xl border border-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-sm text-text-muted mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-bg-secondary transition">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 transition">Delete</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Subjects Page (renamed from Courses) ────────────────────
export function SubjectsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [credits, setCredits] = useState('3')
  const [desc, setDesc] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { load() }, [])
  const load = () => { fetchTable('courses').then(setItems).finally(() => setLoading(false)) }

  const handleSubmit = async () => {
    if (!title || !code) return
    if (editId) {
      await updateRow('courses', editId, { title, course_code: code, credits: parseInt(credits), description: desc })
    } else {
      await insertRow('courses', { title, course_code: code, credits: parseInt(credits), description: desc })
    }
    resetForm(); load()
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteRow('courses', deleteId); setDeleteId(null); load() }
  }

  const startEdit = (c: any) => {
    setEditId(c.id); setTitle(c.title); setCode(c.course_code); setCredits(String(c.credits||3)); setDesc(c.description||''); setShowForm(true)
  }

  const resetForm = () => { setShowForm(false); setEditId(null); setTitle(''); setCode(''); setCredits('3'); setDesc('') }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">SUBJECTS</div><h1 className="text-2xl font-bold">My Subjects</h1></div>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          {icons.plus} Add Subject
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">{editId ? 'Edit Subject' : 'Create Subject'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Subject Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Subject Code</label><input value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Credits</label><input type="number" value={credits} onChange={e => setCredits(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Description</label><input value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>{editId ? 'Update' : 'Create'}</button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16">{icons.book}<p className="text-text-muted mt-4">No subjects yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="p-5 rounded-2xl bg-bg-card border border-border glow-hover">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-primary/10 transition text-primary">{icons.edit}</button>
                  <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition text-danger">{icons.trash}</button>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-2">{c.description || 'No description'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">{c.course_code}</span>
                <span className="text-xs text-text-muted">{c.credits} credits</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!deleteId} title="Delete Subject" message="Are you sure? This will permanently delete this subject and all related data." onConfirm={handleDelete} onCancel={() => setDeleteId(null)}/>
    </div>
  )
}

// ─── Generic CRUD Page Factory ────────────────────────────────
interface CrudField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'time'
  options?: { value: string; label: string }[]
  required?: boolean
}

interface CrudConfig {
  title: string
  singular: string
  table: string
  fields: CrudField[]
  displayFields: { key: string; label: string }[]
  badgeField?: { key: string; colors?: Record<string, string> }
  icon: any
}

function CrudPage({ config }: { config: CrudConfig }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Record<string, string>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { load() }, [])
  const load = () => { fetchTable(config.table).then(setItems).finally(() => setLoading(false)) }

  const handleSubmit = async () => {
    const row: Record<string, any> = {}
    config.fields.forEach(f => {
      const val = formState[f.key] || ''
      if (f.type === 'number') row[f.key] = parseFloat(val) || 0
      else row[f.key] = val
    })
    if (editId) { await updateRow(config.table, editId, row) }
    else { await insertRow(config.table, row) }
    resetForm(); load()
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteRow(config.table, deleteId); setDeleteId(null); load() }
  }

  const startEdit = (item: any) => {
    setEditId(item.id)
    const state: Record<string, string> = {}
    config.fields.forEach(f => { state[f.key] = String(item[f.key] || '') })
    setFormState(state)
    setShowForm(true)
  }

  const resetForm = () => { setShowForm(false); setEditId(null); setFormState({}) }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><div className="text-xs text-text-muted uppercase tracking-wider mb-1">{config.title.toUpperCase()}</div><h1 className="text-2xl font-bold">{config.title}</h1></div>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          {icons.plus} Add {config.singular}
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">{editId ? `Edit ${config.singular}` : `Create ${config.singular}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {config.fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm text-text-secondary mb-1">{f.label}</label>
                {f.type === 'select' ? (
                  <select value={formState[f.key] || ''} onChange={e => setFormState({...formState, [f.key]: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none">
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea value={formState[f.key] || ''} onChange={e => setFormState({...formState, [f.key]: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" rows={3}/>
                ) : (
                  <input type={f.type} value={formState[f.key] || ''} onChange={e => setFormState({...formState, [f.key]: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>{editId ? 'Update' : 'Create'}</button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16">{config.icon}<p className="text-text-muted mt-4">No {config.title.toLowerCase()} yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
              className="p-4 rounded-xl bg-bg-card border border-border flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{item[config.displayFields[0]?.key] || 'Untitled'}</h3>
                <div className="flex flex-wrap gap-3 mt-1">
                  {config.displayFields.slice(1).map(df => (
                    <span key={df.key} className="text-xs text-text-muted">{item[df.key] || '-'}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {config.badgeField && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{item[config.badgeField.key]}</span>
                )}
                <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-primary/10 transition text-primary">{icons.edit}</button>
                <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition text-danger">{icons.trash}</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!deleteId} title={`Delete ${config.singular}`} message={`Are you sure? This will permanently delete this ${config.singular.toLowerCase()}.`} onConfirm={handleDelete} onCancel={() => setDeleteId(null)}/>
    </div>
  )
}

// ─── Pre-built Pages ──────────────────────────────────────────

export function ExamsPage() {
  return <CrudPage config={{
    title: 'Exams', singular: 'Exam', table: 'exams', icon: icons.file,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'course_id', label: 'Subject ID', type: 'text' },
      { key: 'exam_type', label: 'Type', type: 'select', options: [{value:'midterm',label:'Midterm'},{value:'final',label:'Final'},{value:'quiz',label:'Quiz'},{value:'practical',label:'Practical'}] },
      { key: 'date', label: 'Date', type: 'datetime-local' },
      { key: 'duration_minutes', label: 'Duration (min)', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'exam_type', label: 'Type' }, { key: 'date', label: 'Date' }],
    badgeField: { key: 'exam_type' },
  }}/>
}

export function AssignmentsPage() {
  return <CrudPage config={{
    title: 'Assignments', singular: 'Assignment', table: 'assignments', icon: icons.clipboard,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'course_id', label: 'Subject ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'due_date', label: 'Due Date', type: 'datetime-local' },
      { key: 'max_points', label: 'Max Points', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'due_date', label: 'Due Date' }, { key: 'max_points', label: 'Points' }],
    badgeField: { key: 'status' },
  }}/>
}

export function TestsPage() {
  return <CrudPage config={{
    title: 'Tests', singular: 'Test', table: 'tests', icon: icons.clipboard,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'course_id', label: 'Subject ID', type: 'text' },
      { key: 'test_type', label: 'Type', type: 'select', options: [{value:'quiz',label:'Quiz'},{value:'pop_quiz',label:'Pop Quiz'},{value:'practice',label:'Practice'},{value:'assessment',label:'Assessment'}] },
      { key: 'test_date', label: 'Date', type: 'datetime-local' },
      { key: 'duration_minutes', label: 'Duration (min)', type: 'number' },
      { key: 'total_marks', label: 'Total Marks', type: 'number' },
      { key: 'passing_marks', label: 'Passing Marks', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'test_type', label: 'Type' }, { key: 'test_date', label: 'Date' }],
    badgeField: { key: 'test_type' },
  }}/>
}

export function VenuesPage() {
  return <CrudPage config={{
    title: 'Venues', singular: 'Venue', table: 'venues', icon: icons.mapPin,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'building', label: 'Building', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'building', label: 'Building' }, { key: 'capacity', label: 'Capacity' }],
  }}/>
}

export function EventsPage() {
  return <CrudPage config={{
    title: 'Events', singular: 'Event', table: 'events', icon: icons.calendar,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'event_date', label: 'Date', type: 'datetime-local' },
      { key: 'location', label: 'Location', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'event_date', label: 'Date' }, { key: 'location', label: 'Location' }],
  }}/>
}

export function SchedulePage() {
  return <CrudPage config={{
    title: 'Schedule', singular: 'Schedule', table: 'schedules', icon: icons.calendar,
    fields: [
      { key: 'course_id', label: 'Subject ID', type: 'text' },
      { key: 'day_of_week', label: 'Day', type: 'select', options: [{value:'1',label:'Monday'},{value:'2',label:'Tuesday'},{value:'3',label:'Wednesday'},{value:'4',label:'Thursday'},{value:'5',label:'Friday'}] },
      { key: 'start_time', label: 'Start Time', type: 'time' },
      { key: 'end_time', label: 'End Time', type: 'time' },
    ],
    displayFields: [{ key: 'course_id', label: 'Subject' }, { key: 'day_of_week', label: 'Day' }, { key: 'start_time', label: 'Start' }, { key: 'end_time', label: 'End' }],
    badgeField: { key: 'day_of_week' },
  }}/>
}

export function GradesPage() {
  return <CrudPage config={{
    title: 'Grades', singular: 'Grade', table: 'grades', icon: icons.check,
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text', required: true },
      { key: 'course_id', label: 'Subject ID', type: 'text', required: true },
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'grade_letter', label: 'Grade Letter', type: 'text' },
      { key: 'remarks', label: 'Remarks', type: 'text' },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Subject' }, { key: 'score', label: 'Score' }, { key: 'grade_letter', label: 'Grade' }],
    badgeField: { key: 'grade_letter' },
  }}/>
}

export function NotificationsPage() {
  return <CrudPage config={{
    title: 'Notifications', singular: 'Notification', table: 'notifications', icon: icons.bell,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'body', label: 'Message', type: 'textarea' },
      { key: 'notification_type', label: 'Type', type: 'select', options: [{value:'general',label:'General'},{value:'class_update',label:'Class Update'},{value:'exam',label:'Exam'},{value:'assignment',label:'Assignment'},{value:'billing',label:'Billing'}] },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'body', label: 'Message' }, { key: 'notification_type', label: 'Type' }],
    badgeField: { key: 'notification_type' },
  }}/>
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
          <button className="w-12 h-6 rounded-full bg-primary relative transition-colors duration-300">
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300" style={{transform:'translateX(24px)'}}/>
          </button>
        </div>
        <div className="mt-8 mb-4">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">BILLING</div>
          <h2 className="text-lg font-bold">Subscription & Payments</h2>
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="font-bold text-lg">Current Plan</h3><p className="text-sm text-text-muted">Manage your subscription</p></div>
            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">Free</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-bg-secondary text-center"><div className="text-lg font-bold text-primary">Free</div><div className="text-xs text-text-muted">Basic features</div></div>
            <div className="p-3 rounded-lg border-2 border-primary/30 text-center"><div className="text-lg font-bold text-primary">Pro</div><div className="text-xs text-text-muted">$9.99/month</div></div>
            <div className="p-3 rounded-lg bg-bg-secondary text-center"><div className="text-lg font-bold text-primary">Enterprise</div><div className="text-xs text-text-muted">Custom pricing</div></div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm" style={{background:'var(--gradient-primary)'}}>Subscribe with Paystack</button>
            <button className="flex-1 py-2.5 rounded-lg border-2 border-border font-semibold text-sm hover:border-primary transition">Pay with PayPal</button>
          </div>
        </div>
      </div>
    </div>
  )
}
