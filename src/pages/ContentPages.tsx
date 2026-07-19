import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Play, Clock, Upload, FileText, Download } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }

export function LectureVideosPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [semester, setSemester] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => { fetchTable('videos').then(setVideos).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title || !videoUrl) return
    await insertRow('videos', { title, course_id: courseId, video_url: videoUrl, description, semester, video_type: 'lecture' })
    setShowForm(false); setTitle(''); setVideoUrl(''); setDescription('')
    fetchTable('videos').then(setVideos)
  }

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const id = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }
    return url
  }

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Lecture Videos</span>
          <h1 className="section-title mt-1">Lecture Videos</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Upload size={16}/> Upload Video
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-8,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.25}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Upload Lecture Video</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div><label className="label">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Lecture title"/></div>
            <div><label className="label">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input" placeholder="Course UUID"/></div>
            <div><label className="label">Video URL (YouTube)</label><input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="input" placeholder="https://youtube.com/watch?v=..."/></div>
            <div><label className="label">Semester</label><input value={semester} onChange={e => setSemester(e.target.value)} className="input" placeholder="e.g. Fall 2026"/></div>
            <div className="md:col-span-2"><label className="label">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="textarea" rows={2}/></div>
          </div>
          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Upload</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i) => <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}} className="skeleton h-64" />)}
        </div>
      ) : videos.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><Video size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No lecture videos yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <motion.div key={v.id} variants={fadeUp}
              whileHover={{y:-2}}
              className="card overflow-hidden">
              {playingId === v.id ? (
                <div className="aspect-video">
                  <iframe src={getEmbedUrl(v.video_url)} className="w-full h-full" allowFullScreen frameBorder="0"/>
                </div>
              ) : (
                <div className="aspect-video bg-[var(--color-bg-secondary)] flex items-center justify-center cursor-pointer relative" onClick={() => setPlayingId(v.id)}>
                  <motion.div whileHover={{scale:1.1}} whileTap={{scale:0.95}}
                    className="w-14 h-14 rounded-full flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-primary) 12%, transparent)'}}>
                    <Play size={24} className="text-[var(--color-primary)] ml-0.5"/>
                  </motion.div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{v.duration_seconds ? `${Math.floor(v.duration_seconds/60)}:${String(v.duration_seconds%60).padStart(2,'0')}` : ''}</div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold mb-1 text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)]">{v.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]"><Clock size={12}/> {v.semester || 'N/A'}</span>
                  <span className="badge badge-navy text-[10px]">{v.video_type || 'lecture'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('pdf')

  useEffect(() => { fetchTable('course_materials').then(setMaterials).finally(() => setLoading(false)) }, [])

  const handleCreate = async () => {
    if (!title || !fileUrl) return
    await insertRow('course_materials', { title, course_id: courseId, description, file_url: fileUrl, file_type: fileType, is_public: true })
    setShowForm(false); setTitle(''); setFileUrl(''); setDescription('')
    fetchTable('course_materials').then(setMaterials)
  }

  return (
    <div>
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex justify-between items-center mb-6">
        <div>
          <span className="section-label">Materials</span>
          <h1 className="section-title mt-1">Subject Materials</h1>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Upload size={16}/> Upload Material
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{opacity:0,y:-8,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.25}}
          className="card p-6 mb-6">
          <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>Upload Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div><label className="label">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Material title"/></div>
            <div><label className="label">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="input"/></div>
            <div><label className="label">File URL</label><input value={fileUrl} onChange={e => setFileUrl(e.target.value)} className="input" placeholder="https://..."/></div>
            <div><label className="label">File Type</label>
              <select value={fileType} onChange={e => setFileType(e.target.value)} className="select">
                <option value="pdf">PDF</option><option value="docx">DOCX</option><option value="pptx">PPTX</option><option value="video">Video</option><option value="link">Link</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="label">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="textarea" rows={2}/></div>
          </div>
          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleCreate} className="btn-primary px-6">Upload</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => setShowForm(false)} className="btn-secondary px-6">Cancel</motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i) => <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}} className="skeleton h-32" />)}
        </div>
      ) : materials.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon"><Upload size={28}/></div>
          <p className="text-[var(--color-text-muted)]">No materials uploaded yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <motion.div key={m.id} variants={fadeUp}
              whileHover={{y:-2}}
              className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-primary) 8%, transparent)'}}>
                  <FileText size={18} className="text-[var(--color-primary)]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--color-navy)] truncate" style={{ fontFamily: 'var(--font-display)' }}>{m.title}</h3>
                  <span className="badge badge-navy">{m.file_type}</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">{m.description}</p>
              {m.file_url && <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"><Download size={12}/> Download</a>}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
