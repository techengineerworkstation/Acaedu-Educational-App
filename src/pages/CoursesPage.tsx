import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

export function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [credits, setCredits] = useState('3')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    fetchTable('courses').then(setCourses).finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!title || !code) return
    await insertRow('courses', { title, course_code: code, credits: parseInt(credits), description: desc })
    setShowForm(false); setTitle(''); setCode(''); setDesc('')
    fetchTable('courses').then(setCourses)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">SUBJECTS</div>
          <h1 className="text-2xl font-bold">My Subjects</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 hover:shadow-lg transition" style={{background:'var(--gradient-primary)'}}>
          <Plus size={16}/> Add Subject
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Create Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Subject Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg focus:border-primary outline-none transition"/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Subject Code</label>
              <input value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg focus:border-primary outline-none transition"/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Credits</label>
              <input type="number" value={credits} onChange={e => setCredits(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg focus:border-primary outline-none transition"/>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Description</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg focus:border-primary outline-none transition"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-bg-secondary transition">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-36 rounded-2xl bg-bg-secondary animate-pulse"/>)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-4 text-text-muted"/>
          <p className="text-text-muted">No subjects yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="p-5 rounded-2xl bg-bg-card border border-border glow-hover">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">{c.course_code}</span>
              </div>
              <p className="text-sm text-text-secondary mb-2">{c.description || 'No description'}</p>
              <div className="text-xs text-text-muted">{c.credits} credits</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
