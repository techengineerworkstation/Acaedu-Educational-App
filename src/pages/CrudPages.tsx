import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchTable, insertRow, updateRow, deleteRow, supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import type { AcademicPreset } from '../lib/theme'
import {
  Plus, Pencil, Trash2, BookOpen, FileText, Calendar, ClipboardList,
  CheckCircle, Bell, MapPin, Megaphone, Upload, Video, Users, Building2,
  GitBranch, CreditCard, Shield, Mail, Search, Brain, Clock, GraduationCap,
  CalendarOff
} from 'lucide-react'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }

function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onCancel}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="modal" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:'color-mix(in srgb, var(--color-danger) 10%, transparent)'}}>
            <Trash2 size={20} className="text-[var(--color-danger)]"/>
          </div>
          <h3 className="text-[16px] font-bold text-[var(--color-navy)] mb-2 text-center" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
          <p className="text-[13px] text-[var(--color-text-muted)] mb-6 text-center">{message}</p>
          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={onCancel} className="btn-secondary px-6 py-2">Cancel</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={onConfirm} className="btn-primary px-6 py-2" style={{background:'var(--color-danger)'}}>Delete</motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface CrudField {
  key: string; label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'time' | 'date' | 'boolean'
  options?: { value: string; label: string }[]
}

interface CrudConfig {
  title: string; singular: string; table: string
  fields: CrudField[]
  displayFields: { key: string; label: string }[]
  badgeField?: { key: string }
  icon: React.ReactNode
}

function CrudPage({ config }: { config: CrudConfig }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Record<string, string>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(() => { fetchTable(config.table).then(setItems).finally(() => setLoading(false)) }, [config.table])
  useEffect(() => { load() }, [load])

  const handleSubmit = async () => {
    const row: Record<string, unknown> = {}
    config.fields.forEach(f => {
      const val = formState[f.key] || ''
      if (f.type === 'number') row[f.key] = parseFloat(val) || 0
      else if (f.type === 'boolean') row[f.key] = val === 'true'
      else row[f.key] = val
    })
    if (editId) await updateRow(config.table, editId, row)
    else await insertRow(config.table, row)
    resetForm(); load()
  }

  const handleDelete = async () => {
    if (deleteId) { await deleteRow(config.table, deleteId); setDeleteId(null); load() }
  }

  const startEdit = (item: Record<string, unknown>) => {
    setEditId(item.id as string)
    const state: Record<string, string> = {}
    config.fields.forEach(f => { state[f.key] = String(item[f.key] ?? '') })
    setFormState(state); setShowForm(true)
  }

  const resetForm = () => { setShowForm(false); setEditId(null); setFormState({}) }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-8">
        <span className="section-label">{config.title}</span>
        <h1 className="section-title mt-2 text-3xl">{config.title}</h1>
      </motion.div>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="flex justify-center mb-8">
        <motion.button whileHover={{scale:1.03,y:-1}} whileTap={{scale:0.97}}
          onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary">
          <Plus size={16}/> Add {config.singular}
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
            className="card p-6 mb-6">
            <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-5 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              {editId ? `Edit ${config.singular}` : `Create ${config.singular}`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 max-w-2xl mx-auto">
              {config.fields.map(f => (
                <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="label">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="select">
                      <option value="">Select...</option>
                      {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="textarea" rows={3} />
                  ) : f.type === 'boolean' ? (
                    <select value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="select">
                      <option value="false">No</option><option value="true">Yes</option>
                    </select>
                  ) : (
                    <input type={f.type} value={formState[f.key] || ''} onChange={e => setFormState({ ...formState, [f.key]: e.target.value })} className="input" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleSubmit} className="btn-primary px-6">{editId ? 'Update' : 'Create'}</motion.button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={resetForm} className="btn-secondary px-6">Cancel</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}} className="skeleton h-14" />)}
        </div>
      ) : items.length === 0 ? (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="empty-state">
          <div className="empty-state-icon">{config.icon}</div>
          <p className="empty-state-text text-[var(--color-text-muted)]">No {config.title.toLowerCase()} yet.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {items.map((item) => (
            <motion.div key={item.id as string} variants={fadeUp}
              whileHover={{x:4,boxShadow:'var(--shadow-sm)'}}
              className="card card-interactive p-4 flex items-center gap-4">
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{background:'var(--gradient-primary)'}}/>
              <div className="flex-1 min-w-0 text-center">
                <h3 className="text-[13px] font-bold text-[var(--color-navy)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {String(item[config.displayFields[0]?.key] || 'Untitled')}
                </h3>
                <div className="flex flex-wrap justify-center gap-3 mt-1">
                  {config.displayFields.slice(1).map(df => (
                    <span key={df.key} className="text-[11px] text-[var(--color-text-muted)]">{String(item[df.key] ?? '-')}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {config.badgeField && item[config.badgeField.key] != null && (
                  <span className="badge badge-navy">{String(item[config.badgeField.key])}</span>
                )}
                <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={() => startEdit(item)} className="btn-ghost p-1.5"><Pencil size={14}/></motion.button>
                <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={() => setDeleteId(item.id as string)} className="btn-ghost p-1.5 text-[var(--color-danger)]" style={{color:'var(--color-danger)'}}><Trash2 size={14}/></motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <ConfirmModal open={!!deleteId} title={`Delete ${config.singular}`} message={`Are you sure? This will permanently delete this ${config.singular.toLowerCase()}.`} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}

const icon = (Icon: React.ComponentType<{ size?: number; className?: string }>) => <Icon size={40} className="text-[var(--color-text-muted)]"/>

export function CoursesPage() {
  return <CrudPage config={{
    title: 'Subjects', singular: 'Subject', table: 'courses', icon: icon(BookOpen),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_code', label: 'Subject Code', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'credits', label: 'Credits', type: 'number' },
      { key: 'department_id', label: 'Department ID', type: 'text' },
      { key: 'lecturer_id', label: 'Lecturer ID', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'course_code', label: 'Code' }, { key: 'credits', label: 'Credits' }],
    badgeField: { key: 'course_code' },
  }}/>
}

export function EnrollmentsPage() {
  return <CrudPage config={{
    title: 'Enrollments', singular: 'Enrollment', table: 'enrollments', icon: icon(GraduationCap),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'active',label:'Active'},{value:'dropped',label:'Dropped'},{value:'completed',label:'Completed'}] },
      { key: 'enrolled_at', label: 'Enrolled At', type: 'datetime-local' },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function SchedulesPage() {
  return <CrudPage config={{
    title: 'Schedules', singular: 'Schedule', table: 'schedules', icon: icon(Calendar),
    fields: [
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'day_of_week', label: 'Day', type: 'select', options: [{value:'1',label:'Monday'},{value:'2',label:'Tuesday'},{value:'3',label:'Wednesday'},{value:'4',label:'Thursday'},{value:'5',label:'Friday'},{value:'6',label:'Saturday'}] },
      { key: 'start_time', label: 'Start Time', type: 'time' },
      { key: 'end_time', label: 'End Time', type: 'time' },
      { key: 'venue_id', label: 'Venue ID', type: 'text' },
    ],
    displayFields: [{ key: 'course_id', label: 'Course' }, { key: 'day_of_week', label: 'Day' }, { key: 'start_time', label: 'Start' }, { key: 'end_time', label: 'End' }],
    badgeField: { key: 'day_of_week' },
  }}/>
}

export function ScheduleInstancesPage() {
  return <CrudPage config={{
    title: 'Schedule Instances', singular: 'Instance', table: 'schedule_instances', icon: icon(Clock),
    fields: [
      { key: 'schedule_id', label: 'Schedule ID', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'scheduled',label:'Scheduled'},{value:'completed',label:'Completed'},{value:'cancelled',label:'Cancelled'}] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    displayFields: [{ key: 'schedule_id', label: 'Schedule' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function AttendanceCrudPage() {
  return <CrudPage config={{
    title: 'Attendance', singular: 'Record', table: 'attendance', icon: icon(CheckCircle),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'schedule_id', label: 'Schedule ID', type: 'text' },
      { key: 'instance_date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'present',label:'Present'},{value:'absent',label:'Absent'},{value:'late',label:'Late'},{value:'excused',label:'Excused'}] },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'status', label: 'Status' }, { key: 'instance_date', label: 'Date' }],
    badgeField: { key: 'status' },
  }}/>
}

export function HolidaysPage() {
  return <CrudPage config={{
    title: 'Holidays', singular: 'Holiday', table: 'holidays', icon: icon(CalendarOff),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'date', label: 'Date' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function ExamsPage() {
  return <CrudPage config={{
    title: 'Exams', singular: 'Exam', table: 'exams', icon: icon(FileText),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'exam_type', label: 'Type', type: 'select', options: [{value:'midterm',label:'Midterm'},{value:'final',label:'Final'},{value:'quiz',label:'Quiz'},{value:'practical',label:'Practical'}] },
      { key: 'date', label: 'Date', type: 'datetime-local' },
      { key: 'duration_minutes', label: 'Duration (min)', type: 'number' },
      { key: 'total_marks', label: 'Total Marks', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'exam_type', label: 'Type' }, { key: 'date', label: 'Date' }],
    badgeField: { key: 'exam_type' },
  }}/>
}

export function TestsPage() {
  return <CrudPage config={{
    title: 'Tests', singular: 'Test', table: 'tests', icon: icon(ClipboardList),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
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

export function AssignmentsPage() {
  return <CrudPage config={{
    title: 'Assignments', singular: 'Assignment', table: 'assignments', icon: icon(ClipboardList),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'due_date', label: 'Due Date', type: 'datetime-local' },
      { key: 'max_points', label: 'Max Points', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'due_date', label: 'Due Date' }, { key: 'max_points', label: 'Points' }],
  }}/>
}

export function GradesPage() {
  return <CrudPage config={{
    title: 'Grades', singular: 'Grade', table: 'grades', icon: icon(CheckCircle),
    fields: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'grade_letter', label: 'Grade Letter', type: 'text' },
      { key: 'remarks', label: 'Remarks', type: 'text' },
    ],
    displayFields: [{ key: 'student_id', label: 'Student' }, { key: 'course_id', label: 'Course' }, { key: 'score', label: 'Score' }, { key: 'grade_letter', label: 'Grade' }],
    badgeField: { key: 'grade_letter' },
  }}/>
}

export function AnnouncementsCrudPage() {
  return <CrudPage config={{
    title: 'Announcements', singular: 'Announcement', table: 'announcements', icon: icon(Megaphone),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: [{value:'low',label:'Low'},{value:'normal',label:'Normal'},{value:'high',label:'High'},{value:'urgent',label:'Urgent'}] },
      { key: 'author_id', label: 'Author ID', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'priority', label: 'Priority' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'priority' },
  }}/>
}

export function NotificationsPage() {
  return <CrudPage config={{
    title: 'Notifications', singular: 'Notification', table: 'notifications', icon: icon(Bell),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Message', type: 'textarea' },
      { key: 'notification_type', label: 'Type', type: 'select', options: [{value:'general',label:'General'},{value:'class_update',label:'Class Update'},{value:'exam',label:'Exam'},{value:'assignment',label:'Assignment'},{value:'billing',label:'Billing'}] },
      { key: 'read', label: 'Read', type: 'boolean' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'notification_type', label: 'Type' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'notification_type' },
  }}/>
}

export function VideosPage() {
  return <CrudPage config={{
    title: 'Videos', singular: 'Video', table: 'videos', icon: icon(Video),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'video_url', label: 'Video URL', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'video_type', label: 'Type', type: 'select', options: [{value:'lecture',label:'Lecture'},{value:'tutorial',label:'Tutorial'},{value:'seminar',label:'Seminar'}] },
      { key: 'semester', label: 'Semester', type: 'text' },
      { key: 'duration_seconds', label: 'Duration (sec)', type: 'number' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'video_type', label: 'Type' }, { key: 'semester', label: 'Semester' }],
    badgeField: { key: 'video_type' },
  }}/>
}

export function MaterialsPage() {
  return <CrudPage config={{
    title: 'Subject Materials', singular: 'Material', table: 'course_materials', icon: icon(Upload),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'file_url', label: 'File URL', type: 'text' },
      { key: 'file_type', label: 'File Type', type: 'select', options: [{value:'pdf',label:'PDF'},{value:'docx',label:'DOCX'},{value:'pptx',label:'PPTX'},{value:'video',label:'Video'},{value:'link',label:'Link'}] },
      { key: 'is_public', label: 'Public', type: 'boolean' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'file_type', label: 'Type' }, { key: 'course_id', label: 'Course' }],
    badgeField: { key: 'file_type' },
  }}/>
}

export function EventsPage() {
  return <CrudPage config={{
    title: 'Events', singular: 'Event', table: 'events', icon: icon(Calendar),
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'event_date', label: 'Date', type: 'datetime-local' },
      { key: 'location', label: 'Location', type: 'text' },
    ],
    displayFields: [{ key: 'title', label: 'Title' }, { key: 'event_date', label: 'Date' }, { key: 'location', label: 'Location' }],
  }}/>
}

export function VenuesPage() {
  return <CrudPage config={{
    title: 'Venues', singular: 'Venue', table: 'venues', icon: icon(MapPin),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'building', label: 'Building', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'building', label: 'Building' }, { key: 'capacity', label: 'Capacity' }],
  }}/>
}

export function AiSchedulerPage() {
  return <CrudPage config={{
    title: 'AI Scheduler Suggestions', singular: 'Suggestion', table: 'ai_scheduler_suggestions', icon: icon(Brain),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'suggestion', label: 'Suggestion', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'pending',label:'Pending'},{value:'accepted',label:'Accepted'},{value:'rejected',label:'Rejected'}] },
      { key: 'priority', label: 'Priority', type: 'number' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'suggestion', label: 'Suggestion' }, { key: 'status', label: 'Status' }],
    badgeField: { key: 'status' },
  }}/>
}

export function AiSummariesPage() {
  return <CrudPage config={{
    title: 'AI Summaries', singular: 'Summary', table: 'ai_summaries', icon: icon(Brain),
    fields: [
      { key: 'course_id', label: 'Course ID', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'summary_type', label: 'Type', type: 'select', options: [{value:'lecture',label:'Lecture'},{value:'assignment',label:'Assignment'},{value:'exam',label:'Exam'}] },
      { key: 'generated_by', label: 'Generated By', type: 'text' },
    ],
    displayFields: [{ key: 'course_id', label: 'Course' }, { key: 'summary_type', label: 'Type' }, { key: 'created_at', label: 'Created' }],
    badgeField: { key: 'summary_type' },
  }}/>
}

export function UsersPage() {
  return <CrudPage config={{
    title: 'Users', singular: 'User', table: 'profiles', icon: icon(Users),
    fields: [
      { key: 'full_name', label: 'Full Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'role', label: 'Role', type: 'select', options: [{value:'student',label:'Student'},{value:'lecturer',label:'Lecturer'},{value:'admin',label:'Admin'},{value:'dean',label:'Dean'}] },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'faculty', label: 'Faculty', type: 'text' },
      { key: 'matric_number', label: 'Matric Number', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'select', options: [{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}] },
    ],
    displayFields: [{ key: 'full_name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }],
    badgeField: { key: 'role' },
  }}/>
}

export function DepartmentsPage() {
  return <CrudPage config={{
    title: 'Departments', singular: 'Department', table: 'departments', icon: icon(Building2),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'faculty_id', label: 'Faculty ID', type: 'text' },
      { key: 'head_id', label: 'Head ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'faculty_id', label: 'Faculty' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function FacultiesPage() {
  return <CrudPage config={{
    title: 'Faculties', singular: 'Faculty', table: 'faculties', icon: icon(GitBranch),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
      { key: 'dean_id', label: 'Dean ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'institution_id', label: 'Institution' }, { key: 'description', label: 'Description' }],
  }}/>
}

export function InstitutionsPage() {
  return <CrudPage config={{
    title: 'Institutions', singular: 'Institution', table: 'institutions', icon: icon(Building2),
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
    ],
    displayFields: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }],
  }}/>
}

export function BillingPage() {
  return <CrudPage config={{
    title: 'Billing & Subscriptions', singular: 'Subscription', table: 'billing_subscriptions', icon: icon(CreditCard),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'plan', label: 'Plan', type: 'select', options: [{value:'free',label:'Free'},{value:'pro',label:'Pro'},{value:'enterprise',label:'Enterprise'}] },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'active',label:'Active'},{value:'cancelled',label:'Cancelled'},{value:'expired',label:'Expired'}] },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'plan', label: 'Plan' }, { key: 'status', label: 'Status' }, { key: 'amount', label: 'Amount' }],
    badgeField: { key: 'status' },
  }}/>
}

export function PaymentsPage() {
  return <CrudPage config={{
    title: 'Payments', singular: 'Payment', table: 'payments', icon: icon(CreditCard),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [{value:'pending',label:'Pending'},{value:'completed',label:'Completed'},{value:'failed',label:'Failed'},{value:'refunded',label:'Refunded'}] },
      { key: 'provider', label: 'Provider', type: 'select', options: [{value:'paystack',label:'Paystack'},{value:'paypal',label:'PayPal'}] },
      { key: 'reference', label: 'Reference', type: 'text' },
    ],
    displayFields: [{ key: 'user_id', label: 'User' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'provider', label: 'Provider' }],
    badgeField: { key: 'status' },
  }}/>
}

export function FeatureAccessPage() {
  return <CrudPage config={{
    title: 'Feature Access', singular: 'Feature', table: 'feature_access', icon: icon(Shield),
    fields: [
      { key: 'role', label: 'Role', type: 'select', options: [{value:'student',label:'Student'},{value:'lecturer',label:'Lecturer'},{value:'admin',label:'Admin'},{value:'dean',label:'Dean'}] },
      { key: 'feature_key', label: 'Feature Key', type: 'text' },
      { key: 'enabled', label: 'Enabled', type: 'boolean' },
      { key: 'institution_id', label: 'Institution ID', type: 'text' },
    ],
    displayFields: [{ key: 'role', label: 'Role' }, { key: 'feature_key', label: 'Feature' }, { key: 'enabled', label: 'Enabled' }],
    badgeField: { key: 'enabled' },
  }}/>
}

export function EmailVerificationsPage() {
  return <CrudPage config={{
    title: 'Email Verifications', singular: 'Verification', table: 'email_verifications', icon: icon(Mail),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'token', label: 'Token', type: 'text' },
      { key: 'verified', label: 'Verified', type: 'boolean' },
      { key: 'expires_at', label: 'Expires At', type: 'datetime-local' },
    ],
    displayFields: [{ key: 'email', label: 'Email' }, { key: 'verified', label: 'Verified' }, { key: 'expires_at', label: 'Expires' }],
    badgeField: { key: 'verified' },
  }}/>
}

export function SearchQueriesPage() {
  return <CrudPage config={{
    title: 'Search Queries', singular: 'Query', table: 'search_queries', icon: icon(Search),
    fields: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'query', label: 'Query', type: 'text' },
      { key: 'results_count', label: 'Results Count', type: 'number' },
      { key: 'filters', label: 'Filters', type: 'textarea' },
    ],
    displayFields: [{ key: 'query', label: 'Query' }, { key: 'user_id', label: 'User' }, { key: 'results_count', label: 'Results' }, { key: 'created_at', label: 'Time' }],
  }}/>
}

export function SettingsPage() {
  const { theme, cycle, academicPreset, setAcademicPreset, availablePresets } = useTheme()
  const isDark = theme !== 'light'
  const [sound, setSound] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('sound') !== 'off'
    return true
  })
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [fontSize, setFontSize] = useState('medium')
  const [sidebarCompact, setSidebarCompact] = useState(false)

  const [modal, setModal] = useState<null | 'password' | 'email' | '2fa' | 'export' | 'delete'>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [modalError, setModalError] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const closeModal = () => { setModal(null); setModalMsg(''); setModalError(''); setNewPassword(''); setConfirmPassword(''); setNewEmail(''); setDeleteConfirm('') }

  const toggleDark = () => cycle()
  const toggleSound = () => { setSound(!sound); localStorage.setItem('sound', sound ? 'off' : 'on') }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { setModalError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setModalError('Passwords do not match.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setModalMsg('Password updated successfully.')
      setTimeout(closeModal, 2000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update password.')
    }
    setModalLoading(false)
  }

  const handleUpdateEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { setModalError('Enter a valid email address.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      setModalMsg('Confirmation email sent. Check your inbox to verify the new address.')
      setTimeout(closeModal, 3000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update email.')
    }
    setModalLoading(false)
  }

  const handle2FA = async () => {
    setModalLoading(true); setModalError('')
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'Acaedu' })
      if (error) throw error
      if (data?.totp?.qr_code) {
        setModalMsg(`Scan the QR code with your authenticator app.\n\nManual key: ${data.totp.secret}`)
      } else {
        setModalMsg('2FA enrollment initiated. Check your authenticator app.')
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Could not enroll 2FA.')
    }
    setModalLoading(false)
  }

  const handleExportData = async () => {
    setModalLoading(true); setModalError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const [profile, grades, enrollments, attendance] = await Promise.all([
        fetchTable('profiles', { id: user.id }),
        fetchTable('grades', { student_id: user.id }),
        fetchTable('enrollments', { student_id: user.id }),
        fetchTable('attendance', { student_id: user.id }),
      ])
      const exportData = { exportedAt: new Date().toISOString(), profile: profile[0] || {}, grades, enrollments, attendance }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `acaedu-data-${user.id.slice(0,8)}.json`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
      setModalMsg('Your data has been downloaded.')
      setTimeout(closeModal, 2000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Export failed.')
    }
    setModalLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') { setModalError('Type DELETE to confirm.'); return }
    setModalLoading(true); setModalError('')
    try {
      const { error } = await supabase.auth.admin.deleteUser((await supabase.auth.getUser()).data.user?.id || '')
      if (error) { await supabase.auth.signOut(); window.location.href = '/login'; return }
      await supabase.auth.signOut(); window.location.href = '/login'
    } catch { await supabase.auth.signOut(); window.location.href = '/login' }
  }

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="w-12 h-[26px] rounded-full relative transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? 'var(--color-primary)' : 'var(--color-bg-secondary)' }}>
      <div className="w-5 h-5 rounded-full bg-[var(--color-bg-card)] absolute top-[3px] transition-transform duration-200 shadow-sm"
        style={{ transform: on ? 'translateX(23px)' : 'translateX(3px)' }} />
    </button>
  )

  const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <AnimatePresence>
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-backdrop" onClick={closeModal}>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="text-[15px] font-bold text-[var(--color-navy)] mb-4 text-center" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
            {modalError && <div className="mb-3 badge-danger px-3 py-2 text-[12px] rounded-lg">{modalError}</div>}
            {modalMsg && <div className="mb-3 badge-success px-3 py-2 text-[12px] rounded-lg">{modalMsg}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const settingsGroup = (title: string, items: React.ReactNode) => (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mb-8">
      <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
      <div className="space-y-2">{items}</div>
    </motion.div>
  )

  const settingRow = (label: string, desc: string, control: React.ReactNode, danger?: boolean) => (
    <motion.div whileHover={{x:2}} className={`card p-4 flex items-center justify-between ${danger ? 'border-[var(--color-danger)]/20' : ''}`}>
      <div>
        <h3 className={`text-[14px] font-bold ${danger ? 'text-[var(--color-danger)]' : 'text-[var(--color-navy)]'}`} style={{ fontFamily: 'var(--font-display)' }}>{label}</h3>
        <p className="text-[12px] text-[var(--color-text-muted)]">{desc}</p>
      </div>
      {control}
    </motion.div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-10">
        <span className="section-label">Settings</span>
        <h1 className="section-title mt-2 text-3xl">Settings</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5">Manage your account preferences and app settings</p>
      </motion.div>

      {/* Academic Theme */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Academic Theme</h2>
        <p className="text-[12px] text-[var(--color-text-muted)] mb-3">Choose a design inspired by leading academic platforms</p>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(availablePresets) as [AcademicPreset, typeof availablePresets[AcademicPreset]][]).map(([key, preset]) => (
            <motion.button key={key}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => setAcademicPreset(key)}
              className={`preset-card ${academicPreset === key ? 'active' : ''}`}>
              <div className="w-9 h-9 rounded-[10px] mx-auto mb-2.5 flex items-center justify-center" style={{ background: preset.color }}>
                <span className="text-white text-[11px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>{preset.label[0]}</span>
              </div>
              <div className="text-[13px] font-bold text-[var(--color-navy)]">{preset.label}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{preset.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {settingsGroup('Appearance', <>
        {settingRow('Theme', `Current: ${theme}`, <Toggle on={isDark} onToggle={toggleDark} />)}
        {settingRow('Font Size', 'Adjust text size across the app',
          <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="select w-auto text-[13px] min-w-[100px]">
            <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
          </select>)}
        {settingRow('Compact Sidebar', 'Show icons only in sidebar navigation', <Toggle on={sidebarCompact} onToggle={() => setSidebarCompact(!sidebarCompact)} />)}
      </>)}

      {settingsGroup('Notifications', <>
        {settingRow('Email Notifications', 'Receive email alerts for important updates', <Toggle on={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />)}
        {settingRow('Push Notifications', 'Browser push notifications for real-time alerts', <Toggle on={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} />)}
        {settingRow('Weekly Digest', 'Get a weekly summary of your academic activity', <Toggle on={weeklyDigest} onToggle={() => setWeeklyDigest(!weeklyDigest)} />)}
      </>)}

      {settingsGroup('Sound & Media', <>
        {settingRow('Sound Effects', 'Play sounds on interactions and notifications', <Toggle on={sound} onToggle={toggleSound} />)}
      </>)}

      {settingsGroup('Regional', <>
        {settingRow('Language', 'Select your preferred language',
          <select value={language} onChange={e => setLanguage(e.target.value)} className="select w-auto text-[13px] min-w-[140px]">
            <option value="en">English</option><option value="fr">Français</option><option value="ha">Hausa</option><option value="yo">Yorùbá</option><option value="ig">Igbo</option>
          </select>)}
        {settingRow('Timezone', 'Set your local timezone for schedules',
          <select value={timezone} onChange={e => setTimezone(e.target.value)} className="select w-auto text-[13px] min-w-[180px]">
            <option value="Africa/Lagos">West Africa (WAT)</option><option value="Africa/Nairobi">East Africa (EAT)</option>
            <option value="Europe/London">London (GMT)</option><option value="America/New_York">New York (EST)</option><option value="Asia/Dubai">Dubai (GST)</option>
          </select>)}
      </>)}

      {settingsGroup('Privacy & Security', <>
        {settingRow('Two-Factor Authentication', 'Add an extra layer of security to your account',
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setModal('2fa'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Enable</motion.button>)}
        {settingRow('Download My Data', 'Export a copy of all your account data',
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setModal('export'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Export</motion.button>)}
        {settingRow('Delete Account', 'Permanently delete your account and all data',
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setModal('delete'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5 text-[var(--color-danger)] border-[var(--color-danger)]/30 hover:bg-[var(--color-danger)]/5">Delete</motion.button>, true)}
      </>)}

      {/* Billing */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mb-8">
        <h2 className="text-[13px] font-bold text-[var(--color-navy)] uppercase tracking-[0.08em] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Billing & Subscription</h2>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-[14px] font-bold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Current Plan</h3><p className="text-[12px] text-[var(--color-text-muted)]">Manage your subscription and billing</p></div>
            <span className="badge badge-success">Free</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-[10px] bg-[var(--color-bg)] text-center border border-[var(--color-bg-secondary)]">
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Free</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Basic features</div>
            </div>
            <div className="p-3 rounded-[10px] text-center border-2 border-[var(--color-primary)]/30" style={{background:'color-mix(in srgb, var(--color-primary) 3%, transparent)'}}>
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Pro</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">$9.99/month</div>
            </div>
            <div className="p-3 rounded-[10px] bg-[var(--color-bg)] text-center border border-[var(--color-bg-secondary)]">
              <div className="text-[15px] font-extrabold text-[var(--color-navy)]" style={{ fontFamily: 'var(--font-display)' }}>Enterprise</div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Custom pricing</div>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} className="btn-primary flex-1 py-2.5 text-[13px]">Subscribe with Paystack</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} className="btn-secondary flex-1 py-2.5 text-[13px]">Pay with PayPal</motion.button>
          </div>
        </div>
      </motion.div>

      {settingsGroup('Account', <>
        {settingRow('Change Password', 'Update your account password',
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setModal('password'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Change</motion.button>)}
        {settingRow('Update Email', 'Change the email associated with your account',
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={() => { setModal('email'); setModalMsg(''); setModalError('') }} className="btn-secondary text-[12px] px-4 py-1.5">Update</motion.button>)}
      </>)}

      {/* Modals */}
      {modal === 'password' && (
        <Modal title="Change Password">
          <div className="space-y-3 mb-4">
            <div><label className="label">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="Min 8 characters" /></div>
            <div><label className="label">Confirm Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" placeholder="Repeat new password" /></div>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleChangePassword} disabled={modalLoading} className="btn-primary flex-1 py-2">{modalLoading ? 'Saving...' : 'Update'}</motion.button>
          </div>
        </Modal>
      )}
      {modal === 'email' && (
        <Modal title="Update Email">
          <div className="mb-4">
            <label className="label">New Email Address</label>
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="input" placeholder="new@example.com" />
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">A confirmation link will be sent to the new address.</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleUpdateEmail} disabled={modalLoading} className="btn-primary flex-1 py-2">{modalLoading ? 'Sending...' : 'Send Link'}</motion.button>
          </div>
        </Modal>
      )}
      {modal === '2fa' && (
        <Modal title="Enable Two-Factor Authentication">
          {!modalMsg ? (
            <>
              <p className="text-[13px] text-[var(--color-text-muted)] mb-4 text-center">Use an authenticator app like Google Authenticator or Authy to add 2FA to your account.</p>
              <div className="flex gap-2">
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</motion.button>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handle2FA} disabled={modalLoading} className="btn-primary flex-1 py-2">{modalLoading ? 'Setting up...' : 'Enable 2FA'}</motion.button>
              </div>
            </>
          ) : (
            <>
              <pre className="text-[12px] text-[var(--color-text-muted)] mb-4 whitespace-pre-wrap text-center bg-[var(--color-bg-secondary)] p-3 rounded-lg">{modalMsg}</pre>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-primary w-full py-2">Done</motion.button>
            </>
          )}
        </Modal>
      )}
      {modal === 'export' && (
        <Modal title="Download My Data">
          {!modalMsg ? (
            <>
              <p className="text-[13px] text-[var(--color-text-muted)] mb-4 text-center">Export your profile, grades, enrollments, and attendance data as a JSON file.</p>
              <div className="flex gap-2">
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</motion.button>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleExportData} disabled={modalLoading} className="btn-primary flex-1 py-2">{modalLoading ? 'Exporting...' : 'Export'}</motion.button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4"><div className="text-[13px] text-[var(--color-success)] font-medium">{modalMsg}</div></div>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-primary w-full py-2">Done</motion.button>
            </>
          )}
        </Modal>
      )}
      {modal === 'delete' && (
        <Modal title="Delete Account">
          <p className="text-[13px] text-[var(--color-text-muted)] mb-4 text-center">This action is irreversible. Type <strong>DELETE</strong> to confirm.</p>
          <div className="mb-4">
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="input" placeholder='Type "DELETE" to confirm'/>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={closeModal} className="btn-secondary flex-1 py-2">Cancel</motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleDeleteAccount} disabled={modalLoading} className="btn-primary flex-1 py-2" style={{background:'var(--color-danger)'}}>{modalLoading ? 'Deleting...' : 'Delete Account'}</motion.button>
          </div>
        </Modal>
      )}
    </div>
  )
}
