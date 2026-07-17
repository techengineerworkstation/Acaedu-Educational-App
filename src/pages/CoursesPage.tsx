import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchTable, insertRow, updateRow, deleteRow } from '../lib/supabase'

const icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  book: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
}

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
        <div><div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">SUBJECTS</div><h1 className="text-2xl font-bold">My Subjects</h1></div>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          {icons.plus} Add Subject
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">{editId ? 'Edit Subject' : 'Create Subject'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-[var(--color-text-secondary)] mb-1">Subject Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-[var(--color-text-secondary)] mb-1">Subject Code</label><input value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-[var(--color-text-secondary)] mb-1">Credits</label><input type="number" value={credits} onChange={e => setCredits(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-[var(--color-text-secondary)] mb-1">Description</label><input value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>{editId ? 'Update' : 'Create'}</button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : items.length === 0 ? (
        <div className="text-center py-16">{icons.book}<p className="text-[var(--color-text-muted)] mt-4">No subjects yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="p-5 rounded-2xl bg-bg-card border border-border glow-hover">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-primary/10 transition text-primary">{icons.edit}</button>
                  <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition text-[var(--color-danger)]">{icons.trash}</button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">{c.description || 'No description'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">{c.course_code}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{c.credits} credits</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-bg-card rounded-2xl border border-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">Delete Subject</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">Are you sure? This will permanently delete this subject.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-danger text-white text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
