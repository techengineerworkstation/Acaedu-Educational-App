import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Play, Clock, Upload } from 'lucide-react'
import { fetchTable, insertRow } from '../lib/supabase'

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">LECTURE VIDEOS</div>
          <h1 className="text-2xl font-bold">Lecture Videos</h1>
          <p className="text-sm text-text-muted mt-1">Watch recorded lectures by course and semester</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          <Upload size={16}/> Upload Video
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Upload Lecture Video</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="Lecture title"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="Course UUID"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Video URL (YouTube)</label><input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="https://youtube.com/watch?v=..."/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Semester</label><input value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="e.g. Fall 2026"/></div>
            <div className="md:col-span-2"><label className="block text-sm text-text-secondary mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" rows={2}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Upload</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : videos.length === 0 ? (
        <div className="text-center py-16"><Video size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No lecture videos yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <motion.div key={v.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="rounded-2xl bg-bg-card border border-border overflow-hidden glow-hover">
              {playingId === v.id ? (
                <div className="aspect-video">
                  <iframe src={getEmbedUrl(v.video_url)} className="w-full h-full" allowFullScreen frameBorder="0"/>
                </div>
              ) : (
                <div className="aspect-video bg-bg-secondary flex items-center justify-center cursor-pointer relative" onClick={() => setPlayingId(v.id)}>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Play size={28} className="text-primary ml-1"/>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{v.duration_seconds ? `${Math.floor(v.duration_seconds/60)}:${String(v.duration_seconds%60).padStart(2,'0')}` : ''}</div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold mb-1">{v.title}</h3>
                <p className="text-xs text-text-muted">{v.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={12}/> {v.semester || 'N/A'}</span>
                  <span>{v.video_type || 'lecture'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return '📄'
      case 'docx': return '📝'
      case 'pptx': return '📊'
      case 'video': return '🎬'
      default: return '📁'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">MATERIALS</div>
          <h1 className="text-2xl font-bold">Subject Materials</h1>
          <p className="text-sm text-text-muted mt-1">Upload and access course materials</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2" style={{background:'var(--gradient-primary)'}}>
          <Upload size={16}/> Upload Material
        </button>
      </div>

      {showForm && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-6 p-5 rounded-2xl bg-bg-card border border-border">
          <h3 className="font-bold mb-4">Upload Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-text-secondary mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="Material title"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">Course ID</label><input value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none"/></div>
            <div><label className="block text-sm text-text-secondary mb-1">File URL</label><input value={fileUrl} onChange={e => setFileUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" placeholder="https://..."/></div>
            <div><label className="block text-sm text-text-secondary mb-1">File Type</label>
              <select value={fileType} onChange={e => setFileType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none">
                <option value="pdf">PDF</option><option value="docx">DOCX</option><option value="pptx">PPTX</option><option value="video">Video</option><option value="link">Link</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-sm text-text-secondary mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-bg outline-none" rows={2}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white font-semibold" style={{background:'var(--gradient-primary)'}}>Upload</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </motion.div>
      )}

      {loading ? <div className="h-32 bg-bg-secondary rounded-2xl animate-pulse"/> : materials.length === 0 ? (
        <div className="text-center py-16"><Upload size={48} className="mx-auto mb-4 text-text-muted"/><p className="text-text-muted">No materials uploaded yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m, i) => (
            <motion.div key={m.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="p-5 rounded-2xl bg-bg-card border border-border glow-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getFileIcon(m.file_type)}</span>
                <div>
                  <h3 className="font-bold">{m.title}</h3>
                  <span className="text-xs text-text-muted uppercase">{m.file_type}</span>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-3">{m.description}</p>
              {m.file_url && <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-semibold hover:underline">Download →</a>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
